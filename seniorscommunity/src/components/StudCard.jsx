import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import profile from '../assets/profile.png'
const StudCard = (props) => {
    const navigate=useNavigate();
  const [gitData, setGitData] = useState(null);
  const [data, setData] = useState(null);
  // console.log(props);
  const sendProps=()=>{
    navigate('/profilecard/',{state:{data:{
        githubdata:gitData,
        userdata:data,
        acadamicdata:props.props
    }}})
  }
  const fetchGitHubData = async (githubUsername) => {
    try {
      const res = await axios.get(`https://api.github.com/users/${githubUsername}`);
      if (res.status === 200) {
        setGitData(res.data);
      }
    } catch (error) {
      console.error('Error fetching GitHub data:', error.message);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('https://alumni-s-hub.onrender.com/api/v1/getData', { id: props.props.Email });
        if (response.status === 200) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [props.props.Email]);
  useEffect(() => {
    if (data && data.Github) {
      fetchGitHubData(data.Github);
    }
  }, [data]);

  return (
    <div className="w-[400px] h-[300px] bg-slate-400/20 backdrop-blur-3xl rounded-lg flex flex-col justify-center mt-5">
      <div className="w-full flex justify-between p-2">
        <p className="text-2xl text-white">{props.props.Name}</p>
        <p className="text-2xl text-white">
          {props.props.Year}-{props.props.Department}
        </p>
      </div>
      <div className="w-full flex justify-center items-center">
        {gitData ? (
          <img
            src={gitData.avatar_url||profile}
            alt={`${data?.Github}'s Avatar`}
            className="w-40 h-40 rounded-full"
          />
        ) : (
          <p className="text-white animate-spin"><Loader2Icon/></p>
        )}
      </div>
      <div className='w-full flex justify-between p-2'>
         <button className='w-[100px] bg-blue-700 text-white rounded-lg h-[35px]'>Follow</button>
         <button className='w-[100px] bg-orange-500 text-white rounded-lg h-[35px]' onClick={sendProps}>View profile</button>
      </div>
    </div>
  );
};

export default StudCard;
