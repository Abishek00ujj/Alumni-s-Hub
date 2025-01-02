import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const FollowCard = ({ data: propData }) => {
  console.log(propData);
  const [localData, setLocalData] = useState(null); 
  const [gitData, setGitData] = useState(null);
  const getData = async () => {
    const response = await axios.post('http://localhost:5000/api/v1/getData', { id: propData });
    if (response.status === 200) {
      setLocalData(response.data);
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
            console.log(gitData);
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
      <div className='w-full  bg-slate-400 text-white h-auto flex'>
        <div className='w-full flex items-center'>
          <img className='w-[50px] h-[50px] rounded-full'src={gitData ? gitData.avatar_url : ""} alt="GitHub Avatar" />
          <p>{gitData ? gitData.name : "Loading GitHub Data..."}</p>
        </div>
      </div>
    </>
  );
};

export default FollowCard;
