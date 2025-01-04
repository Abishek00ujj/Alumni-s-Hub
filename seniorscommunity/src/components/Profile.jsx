import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Stdimg from "../assets/clgstd.png";
import toast, { Toaster } from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [darkmode, setDarkmode] = useState(true);
  const [hide, setHide] = useState(true);

  const linkedinRef = useRef(null);
  const githubRef = useRef(null);
  const leetcodeRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem("data"));

  const handleMonkey = () => {
    setHide(false);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleDarkmode = () => {
    setDarkmode((prev) => !prev);
  };

  const handleSubmit = async () => {
    setLoad(true);
    try {
      if (!userData?.Email) {
        throw new Error("User data is missing!");
      }
       if(!linkedinRef.current.value||!githubRef.current.value||!leetcodeRef.current.value)
       {
        const notify = () => toast('Please fill all the details');
        notify();
          return;
       }
       if(leetcodeRef.current.value.length>15)
       {
        const notify1 = () => toast('Leetcode username should be enter!');
        notify1();
          return;
       }
       if(githubRef.current.value.length>15)
        {
      const notify2 = () => toast('Github username should be enter!');
       notify2();
           return;
        }
      const obj = {
        id: userData.Email,
        Linkedin: linkedinRef.current.value,
        Github: githubRef.current.value,
        Leetcode: leetcodeRef.current.value,
      };

      const res = await axios.post(
        "https://alumni-s-hub.onrender.com/api/v1/addData",
        obj
      );

      if (res.status === 200) {
        localStorage.setItem("userData", JSON.stringify(obj));
        navigate("/home");
        localStorage.setItem("completeUser", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Error submitting profile data:", error.message);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userData?.Email) {
          throw new Error("User data is missing!");
        }

        const res = await axios.post(
          "https://alumni-s-hub.onrender.com/api/v1/getData",
          { id: userData.Email }
        );

        if (res.status === 200) {
          localStorage.setItem("completeUser", JSON.stringify(res.data));
          navigate("/home");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {userData ? (
        <>
          <Toaster />
          <Navbar />
          <div
            className={`w-screen h-screen ${
              darkmode ? "bg-black" : "bg-[#f8f8f8]"
            } justify-center items-center flex flex-row-reverse min-2xl:flex max-lg:flex-col p-5 max-2xl:justify-between`}
          >
            <div className="w-[400px] h-[380px] bg-slate-50 rounded-xl flex flex-col space-y-5 justify-center items-center border border-black m-10 p-5">
              {hide ? (
                <>
                  <div className="text-4xl font-bold" onClick={handleDarkmode}>
                    Profile creation 🤩
                  </div>
                  <div>
                    <span className="font-bold">Students & Alumni</span> (SIET)
                  </div>
                  <div>
                    <button
                      className="bg-blue-950 text-white p-3 rounded-xl"
                      onClick={handleMonkey}
                    >
                      Create profile!
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col justify-around items-center space-y-5">
                  {loading ? (
                    <div className="w-[400px] h-[380px] justify-center items-center flex">
                      <div className="w-[50px] h-[50px] bg-orange-400 rounded-full animate-spin">
                        <div className="w-[40px] h-[40px] bg-[#f8f8f8] rounded-full"></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold font-sans">
                        Your Profile details! 🤩
                      </div>
                      <input
                        ref={linkedinRef}
                        type="text"
                        className="border border-black pl-8 pr-8 pt-3 pb-3 rounded-lg w-full"
                        placeholder="LinkedIn Profile Link*"
                      />
                      <input
                        ref={leetcodeRef}
                        type="text"
                        className="border border-black pl-8 pr-8 pt-3 pb-3 rounded-lg w-full"
                        placeholder="Leetcode username*"
                      />
                      <input
                        ref={githubRef}
                        type="text"
                        className="border border-black pl-8 pr-8 pt-3 pb-3 rounded-lg w-full"
                        placeholder="GitHub username*"
                      />
                      <button
                        onClick={handleSubmit}
                        className="bg-blue-950 p-3 rounded-lg text-white"
                      >
                        {load ? (
                          <div className="animate-spin w-full h-full text-white">
                            <Loader2 size={40} />
                          </div>
                        ) : (
                          "Show my profile 🎉"
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="max-xl:w-[50%] max-sm:w-screen h-auto">
              <img
                src={Stdimg}
                alt=""
                className="w-[500px] h-[400px]"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <Navbar />
        </>
      )}
    </>
  );
};

export default Profile;
