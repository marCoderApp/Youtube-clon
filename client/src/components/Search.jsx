import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import { useLocation } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Search = () => {
  const [videos, setVideos] = useState([]);
  const query = useLocation().search;
  const url = "http://localhost:8800/api";
  console.log(query);
  console.log(useLocation());

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`${url}/videos/search${query}`);
      setVideos(res.data);
    };

    fetchVideos();
  }, [query]);

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Search;
