import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  fetchFailure,
  fetchSuccess,
  fetchStart,
  like,
  dislike,
} from "../redux/videoSlice";
import { subscription } from "../redux/userSlice";
import axios from "axios";
import Comments from "../components/Comments";
import Card from "../components/Card";
import { format } from "timeago.js";
import Recommendation from "../components/Recommendation";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
max-height: 480px;
width: 720px,
object-fit:cover;
`;

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const path = useLocation().pathname.split("/")[2];
  const url = "http://localhost:8800/api";
  const [channel, setChannel] = useState({});
  //let videoId;

  //console.log(currentUser);

  useEffect(() => {
    const addView = async () => {
      try {
        await axios.put(`${url}/videos/view/${path}`);
      } catch (error) {}
    };
    addView();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`${url}/videos/find/${path}`);
        const channelRes = await axios.get(
          `${url}/users/find/${videoRes.data.userId}`
        );
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
        //videoId = currentVideo._id;
      } catch (error) {}
    };

    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    await axios.put(`${url}/users/like/${currentVideo._id}`);
    dispatch(like(currentUser._id));
  };

  const handleDislike = async () => {
    await axios.put(`${url}/users/dislike/${currentVideo._id}`);
    dispatch(dislike(currentUser._id));
  };

  const handleSub = async () => {
    if (currentUser.subscribedUsers.includes(channel._id)) {
      await axios.put(`${url}/users/unsub/${channel._id}`);
      dispatch(subscription(channel._id));
    } else {
      await axios.put(`${url}/users/sub/${channel._id}`);
      dispatch(subscription(channel._id));
    }
  };

  // console.log(path);
  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={currentVideo.videoUrl} controls></VideoFrame>
        </VideoWrapper>
        <Title>{currentVideo.title}</Title>
        <Details>
          <Info>
            {currentVideo.views} views • {format(currentVideo.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo.likes?.includes(currentUser._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}
              {"  "}
              {currentVideo.likes?.length} Likes
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo.dislikes?.includes(currentUser._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}{" "}
              Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
              <Description>{currentVideo.desc}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe
            onClick={handleSub}
            style={{
              backgroundColor: currentUser.subscribedUsers?.includes(
                channel._id
              )
                ? "gray"
                : "#cc1a00",
            }}
          >
            {currentUser.subscribedUsers?.includes(channel._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo._id} />
      </Content>
      <Recommendation tags={currentVideo.tags} />
    </Container>
  );
};

export default Video;
