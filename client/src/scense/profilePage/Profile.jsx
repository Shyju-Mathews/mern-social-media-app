import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "scense/navbar/Navbar";
import FriendListWidget from "scense/widgets/FriendListWidget";
import MyPostWidget from "scense/widgets/MyPostWidget";
import PostsWidget from "scense/widgets/PostsWidget";
import UserWidget from "scense/widgets/UserWidget";
import { useSelector } from "react-redux";

const Profile = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const getUser = async () => {
    const res = await fetch(`http://localhost:5000/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });

    const data = await res.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  return (
    <Box>
      <Navbar />
      <Box 
      width="100%"
      padding="2rem 6%"
      display={isNonMobileScreens ? "flex" : "block"}
      gap="2rem"
      justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath}/>
          <Box m="2rem 0" />
            <FriendListWidget userId={userId}/>
        </Box>

        <Box 
        flexBasis={isNonMobileScreens ? "42%" : undefined}
        mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={user.picturePath} />
          <Box m="2rem 0" />
            <PostsWidget userId={userId} isProfile/>
          </Box>
        </Box>
      </Box>
  )
};

export default Profile;

