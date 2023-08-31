import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

    const getPosts = async () => {
      const response = await fetch("https://dream-world-media.onrender.com/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const posts = await response.json();
      dispatch(setPosts({posts}));
    };

  const getUserPosts = async () => {
    const response = await fetch(`https://dream-world-media.onrender.com/posts/${userId}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
}) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}

      {/* {posts.map((post) => (
        <PostWidget 
        key={post._id}
        postId={post._id}
        postUserId={post.userId}
        name={`${post.firstName} ${post.lastName}`}
        description={post.description}
        location={post.location}
        picturePath={post.picturePath}
        userPicturePath={post.userPicturePath}
        likes={post.likes}
        comments={post.comments}
        />
      ))} */}
    </>
  );
};

export default PostsWidget;
