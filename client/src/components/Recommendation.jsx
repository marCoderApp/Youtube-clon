import react from "react";
import { useState, useEffect } from "react";
import Card from "./Card";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  flex: 2;
`;

const Recommendation = ({ tags }) => {
  const [videos, setVideos] = useState([]);

  const url = "http://localhost:8800/api";

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`${url}/videos/tags?tags=${tags}`);
      setVideos(res.data);
    };

    fetchVideos();
  }, [tags]);

  return (
    <>
      <Container>
        {videos.map((video) => (
          <Card key={video._id} video={video} type="sm" />
        ))}
      </Container>
    </>
  );
};
export default Recommendation;
