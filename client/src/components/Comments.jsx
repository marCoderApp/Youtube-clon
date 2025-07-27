import React from "react";
import styled from "styled-components";
import Comment from "./Comment";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const url = "http://localhost:8800/api";
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ desc: "", videoId: "" });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${url}/comments/${videoId}`);
        setComments(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, [videoId, newComment]);

  const addNewComment = async (desc, videoId) => {
    try {
      await axios.post(`${url}/comments`, { desc, videoId });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addNewComment(newComment.desc, newComment.videoId);
  };

  const handleChange = (e) => {
    setNewComment({
      ...newComment,
      [e.target.name]: e.target.value,
      videoId: videoId,
    });

    console.log(e.target.value);
  };

  console.log(newComment);

  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser.img} />
        <Input
          placeholder="Add a comment..."
          name="desc"
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>post</button>
      </NewComment>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </Container>
  );
};

export default Comments;
