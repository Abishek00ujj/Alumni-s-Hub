import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { Loader2, Linkedin, Github, Code, Mail } from "lucide-react";
import { Gitdata, Setgitdata } from '../store'
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import {
  WhatsappShareButton,
} from "react-share";
import {
  WhatsappIcon,
} from "react-share";
const shareUrl="https://alumni-s-hub.vercel.app";
const UserProfile = () => {
  const contentRef = useRef(null);
const reactToPrintFn = useReactToPrint({ contentRef });
  const [userData, setUserData] = useState(null);
  const [gitData, setGitData] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const fetchGitHubData = async (githubUsername) => {
    try {
      const res = await axios.get(`https://api.github.com/users/${githubUsername}`);
      if (res.status === 200) {
        setGitData(res.data);
        Setgitdata(res.data);
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error.message);
    }
  };

  useEffect(() => {
    try {
      const storedUserDetails = JSON.parse(localStorage.getItem("data"));
      setUserDetails(storedUserDetails);

      const completeUser = JSON.parse(localStorage.getItem("completeUser"));
      if (completeUser) {
        setUserData(completeUser.data);
        fetchGitHubData(completeUser.data.Github);
      } else {
        const basicUserData = JSON.parse(localStorage.getItem("userData"));
        if (basicUserData) {
          setUserData(basicUserData);
          fetchGitHubData(basicUserData.Github);
        }
      }
    } catch (error) {
      console.error("Error retrieving user data:", error.message);
    }
  }, []);

  const githubUrl = userData ? `https://github.com/${userData.Github}/` : "#";
  const leetcodeUrl = userData ? `https://leetcode.com/u/${userData.Leetcode}/` : "#";
  const linkedinUrl = userData?.Linkedin || "#";

  return (
    <>
      <Navbar />
      <div ref={contentRef} className="w-screen bg-black flex flex-col space-y-5 pb-10 text-white">
        {gitData && (
          <div className="w-full h-auto text-white flex flex-col justify-center items-center rounded-lg border border-white bg-[#121212] mt-5 mb-2 space-y-3 p-4">
            <div className="w-full flex justify-between text-2xl max-2xl:flex-col">
              <p>{userDetails?.Name}</p>
              <p>{`${userDetails?.Year} - ${userDetails?.Department} 🎓`}</p>
            </div>
            <img
              src={gitData.avatar_url}
              className="w-[200px] h-[200px] rounded-full"
              alt={`${gitData.login}'s avatar`}
            />
            <p>{gitData.name}</p>
            <p>{gitData.bio}</p>
            <p className="flex w-full justify-center max-2xl:justify-start">
              Website:{" "}
              <a href={gitData.blog} target="_blank" rel="noopener noreferrer">
                {gitData.blog}
              </a>
            </p>
            <div className="w-full flex justify-start space-x-5 ">
              <div className="w-full flex justify-start space-x-5">
                <a href={linkedinUrl} target="_blank">
                  <div className="w-10 h-10 bg-white flex justify-center items-center rounded-full border">
                    <Linkedin color="blue" fill="white" />
                  </div>
                </a>
                <a href={githubUrl} target="_blank">
                  <div className="w-10 h-10 bg-white flex justify-center items-center rounded-full border">
                    <Github color="" fill="black" />
                  </div>
                </a>
                <a href={leetcodeUrl} target="_blank">
                  <div className="w-10 h-10 bg-white flex justify-center items-center rounded-full border">
                    <Code color="orange" />
                  </div>
                </a>
              </div>
              <div>
                <a href={"mailto:" + userDetails.Email} type="mailto" target="_blank">
                  <div className="w-10 h-10 bg-white flex justify-center items-center rounded-full border">
                    <Mail color="blue" fill="white" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}
        {userData ? (
          <div className="w-full h-full flex justify-center items-center flex-col space-y-5">
            <p className="text-2xl text-white">Total problems solved!</p>
            <img
              src={`https://leetcard.jacoblin.cool/${userData.Leetcode}?theme=dark&font=Nunito&ext=heatmap`}
              alt="Leetcode stats"
            />
            <h2 className="text-2xl text-white">GitHub stats 🎉</h2>
            <div className="w-full flex justify-center items-center">
              <iframe
                className="max-2xl:w-[90vw] w-[500px] border rounded-md"
                src={`https://ghchart.rshah.org/${userData.Github}`}
                title="GitHub Heatmap"
              />
            </div>

            <img
              src={`https://streak-stats.demolab.com/?user=${userData.Github}&count_private=true&theme=react`}
              alt="GitHub streak stats"
            />
            <img
              src={`https://github-readme-stats.vercel.app/api?username=${userData.Github}&show_icons=true&theme=react&rank_icon=github&border_radius=10`}
              alt="readme stats"
            />
            <img
              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${userData.Github}&hide=HTML&langs_count=8&layout=compact&theme=react&border_radius=10`}
              alt="top languages"
            />
            <div className="w-full h-10 flex justify-center items-center max-2xl:justify-between mb-5 p-5 space-x-5">
            <button className="bg-orange-500 pl-8 pr-8 pt-2 pb-2  text-white rounded-lg" onClick={() => reactToPrintFn()}>Print</button>
            <WhatsappShareButton url={shareUrl} title={"Hey,i am using Alumnis-hub & i am now a member of alumnis-hub,why wont't you join us?"} className="flex justify-center items-center space-x-4">
            <p className=" text-2xl">Share</p><WhatsappIcon size={40} round={true}/>
            </WhatsappShareButton>
            </div>
          </div>
        ) : (
          <div className="w-screen h-screen flex justify-center items-center">
            <Loader2 className="text-white animate-spin" size={50} />
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
