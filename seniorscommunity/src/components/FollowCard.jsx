import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const FollowCard = ({ data: propData }) => {
  // console.log(propData);
  const [localData, setLocalData] = useState(null); 
  const [gitData, setGitData] = useState(null);
  const [Userdata,setUserdata]=useState(null);
  const getData = async () => {
    const response = await axios.post('https://alumni-s-hub.onrender.com/api/v1/getData', { id: propData });
    if (response.status === 200) 
    {
      setLocalData(response.data);
      setUserdata(response.data.data1);
      // console.log(response.data.data1)
    }
  };
  useEffect(() => {
    getData();
  }, [propData]); 

  useEffect(() => {

    if (localData && localData.data && localData.data.Github) {
      const fetchGitHubData = async (githubUsername) => {
        try {
          const res = await axios.get(`https://api.github.com/users/${githubUsername}`);
          if (res.status === 200) {
            setGitData(res.data);
            // console.log(gitData);
          }
        } catch (error) {
          console.error("Error fetching GitHub data:", error.message);
        }
      };
      fetchGitHubData(localData.data.Github);
    }
  }, [localData]);

  return (
    <>
      <div className='w-full  bg-[#121212] p-2 text-white h-auto flex'>
        <div className='w-full flex items-center space-x-3'>
          <img className='w-[50px] h-[50px] rounded-full'src={gitData ? gitData.avatar_url : ""} alt="GitHub Avatar" />
          <div className='w-full flex flex-col'>
         <div className='w-full flex justify-between p-2'>
         <p>{Userdata ? Userdata.Name : "Loading GitHub Data..."}</p>
         <p>{Userdata? Userdata.Year+"-"+Userdata.Department : "Loading.."}</p>
         </div>
          <p>{gitData ? gitData.bio:"loading.."}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FollowCard;
