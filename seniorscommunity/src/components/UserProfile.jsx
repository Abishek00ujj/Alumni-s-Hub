import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { Loader2 } from "lucide-react";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [gitData, setGitData] = useState(null);

  const fetchGitHubData = async (githubUsername) => {
    try {
      const res = await axios.get(
        `https://api.github.com/users/${githubUsername}`
      );
      if (res.status === 200) {
        setGitData(res.data);
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error.message);
    }
  };

  useEffect(() => {
    try {
      if(localStorage.getItem("completeUser"))
      {
        const storedData = JSON.parse(localStorage.getItem("completeUser"));
        if (storedData) {
          setUserData(storedData.data);
          fetchGitHubData(storedData.data.Github);
        }
      }
      else
      {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      if (storedData) {
        setUserData(storedData);
        fetchGitHubData(storedData.Github);
      }
    }
    } catch (error) {
      console.error("Error retrieving user data:", error.message);
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-screen bg-black flex flex-col space-y-5">
        {gitData && (
          <div className="w-full h-auto text-white flex flex-col justify-center items-center rounded-lg border border-white bg-[#121212] mt-5 mb-2">
            <p className="w-full flex justify-center text-2xl">
              Username: {gitData.login}
            </p>
            <img
              src={gitData.avatar_url}
              className="w-[200px] h-[200px] rounded-full"
              alt={`${gitData.login}'s avatar`}
            />
            <p>{gitData.name}</p>
            <p>{gitData.bio}</p>
            <p>
              Website:{" "}
              <a href={gitData.blog} target="_blank" rel="noopener noreferrer">
                {gitData.blog}
              </a>
            </p>
          </div>
        )}
        {userData ? (
          <div className="w-full h-full flex justify-center items-center flex-col space-y-5">
            <p className="text-2xl text-white">Total problems solved!</p>
            <img
              src={`https://leetcard.jacoblin.cool/${userData.Leetcode}?theme=dark`}
              alt="Leetcode stats"
            />
            <h2 className="text-2xl text-white">GitHub stats 🎉</h2>
            <img
              src={`https://streak-stats.demolab.com/?user=${userData.Github}&count_private=true&theme=react`}
              alt="GitHub streak stats"
            />
          </div>
        ) : (
          <div className="w-screen h-screen flex justify-center items-center">
            <p className="text-white text-center mt-5 animate-spin">
              <Loader2 color="white" size={50} />
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
