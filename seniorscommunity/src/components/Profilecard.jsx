import { useLocation } from 'react-router-dom'
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
const shareUrl=window.location.href;
const Profilecard = () => {

    const location=useLocation();
    const {data}=location.state || {};
    // console.log(data);
    const contentRef = useRef(null);
const reactToPrintFn = useReactToPrint({ contentRef });
  const githubUrl = data ? `https://github.com/${data.userdata.Github}/` : "#";
  const leetcodeUrl = data ? `https://leetcode.com/u/${data.userdata.Leetcode}/` : "#";
  const linkedinUrl = data?.userdata.Linkedin || "#";
  return (
     <>
          <Navbar />
          <div ref={contentRef} className="w-screen bg-black flex flex-col space-y-5 pb-10 text-white">
            {data && (
              <div className="w-full h-auto text-white flex flex-col justify-center items-center rounded-lg border border-white bg-[#121212] mt-5 mb-2 space-y-3 p-4">
                <div className="w-full flex justify-between text-2xl max-2xl:flex-col">
                  <p>{data?.acadamicdata.Name}</p>
                  <p>{`${data?.acadamicdata.Year} - ${data?.acadamicdata.Department} 🎓`}</p>
                </div>
                <img
                  src={data?.githubdata.avatar_url}
                  className="w-[200px] h-[200px] rounded-full"
                  alt={`${data?.githubdata.login}'s avatar`}
                />
                <p>{data?.githubdata.name}</p>
                <p>{data?.githubdata.bio}</p>
                <p className="flex w-full justify-center max-2xl:justify-start">
                  Website:{" "}
                  <a href={data?.githubdata.blog} target="_blank" rel="noopener noreferrer">
                    {data?.githubdata.blog}
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
                    <a href={"mailto:" + data?.acadamicdata.Email} type="mailto" target="_blank">
                      <div className="w-10 h-10 bg-white flex justify-center items-center rounded-full border">
                        <Mail color="blue" fill="white" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}
            {data ? (
              <div className="w-full h-full flex justify-center items-center flex-col space-y-5">
                <p className="text-2xl text-white">Total problems solved!</p>
                <img
                  src={`https://leetcard.jacoblin.cool/${data?.userdata.Leetcode}?theme=dark&font=Nunito&ext=heatmap`}
                  alt="Leetcode stats"
                />
                <h2 className="text-2xl text-white">GitHub stats 🎉</h2>
                <div className="w-full flex justify-center items-center">
                  <iframe
                    className="max-2xl:w-[90vw] w-[500px] border rounded-md"
                    src={`https://ghchart.rshah.org/${data?.userdata.Github}`}
                    title="GitHub Heatmap"
                  />
                </div>
    
                <img
                  src={`https://streak-stats.demolab.com/?user=${data?.userdata.Github}&count_private=true&theme=react`}
                  alt="GitHub streak stats"
                />
                <img
                  src={`https://github-readme-stats.vercel.app/api?username=${data?.userdata.Github}&show_icons=true&theme=react&rank_icon=github&border_radius=10`}
                  alt="readme stats"
                />
                <img
                  src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${data?.userdata.Github}&hide=HTML&langs_count=8&layout=compact&theme=react&border_radius=10`}
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
  )
}

export default Profilecard