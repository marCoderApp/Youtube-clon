import react from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;
const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Button = styled.button`
  border: none;
  color: ${({ theme }) => theme.text};
  padding: 10px 20px;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  padding: 10px;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.label`
  font-size: 14px;
`;

const Upload = ({ setOpen }) => {
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const url = "http://localhost:8800/api";
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        urlType === "imgUrl"
          ? setImgPerc(Math.round(progress))
          : setVideoPerc(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            console.log(downloadURL);
            console.log(prev);
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };
  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);

  useEffect(() => {
    img && uploadFile(img, "imgUrl");
  }, [img]);

  const handleUpload = async (e) => {
    e.preventDefault();
    console.log(inputs);
    try {
      const res = await axios.post(`http://localhost:8800/api/videos/`, {
        ...inputs,
        tags,
      });
      console.log(res);
      setOpen(false);
      res.status === 200 && navigate(`/video/${res.data._id}`);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Upload a new video</Title>
        <Label>Video:</Label>
        {videoPerc > 0 ? (
          "Uploading: " + "% " + videoPerc
        ) : (
          <Input
            type="file"
            accept="
        video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          ></Input>
        )}
        <Input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handleChange}
        ></Input>
        <Desc
          placeholder="Description"
          rows={8}
          name="desc"
          onChange={handleChange}
        ></Desc>
        <Input
          type="text"
          placeholder="Separate tags with commas"
          onChange={handleTags}
        ></Input>
        <Label>Image:</Label>
        {imgPerc > 0 ? (
          "Uploading: " + "% " + imgPerc
        ) : (
          <Input
            type="file"
            accept="
        image/*"
            onChange={(e) => setImg(e.target.files[0])}
          ></Input>
        )}
        <Button onClick={handleUpload}>Upload</Button>
      </Wrapper>
    </Container>
  );
};

export default Upload;
