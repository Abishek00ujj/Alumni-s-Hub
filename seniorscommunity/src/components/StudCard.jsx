import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import profile from '../assets/profile.png';

const StudCard = (props) => {
  const navigate = useNavigate();
  const [gitData, setGitData] = useState(null);
  const [data, setData] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollow, setFollow] = useState(false);
  const [load, setLoad] = useState(false);
  const [loading,setLoading]=useState(true);
  const completeUser = JSON.parse(localStorage.getItem("completeUser"));

  const sendProps = () => {
    navigate('/profilecard/', {
      state: {
        data: {
          githubdata: gitData,
          userdata: data,
          acadamicdata: props.props,
          follow: isFollow,
        },
      },
    });
  };

  const fetchGitHubData = async (githubUsername) => {
    try {
      const res = await axios.get(`https://api.github.com/users/${githubUsername}`);
      if (res.status === 200) {
        setGitData(res.data);
      }
    } catch (error) {
      console.error('Error fetching GitHub data:', error.message);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          'https://alumni-s-hub.onrender.com/api/v1/getData',
          { id: props.props.Email }
        );
        if (response.status === 200) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.post(
          'https://alumni-s-hub.onrender.com/api/v1/getData',
          { id: completeUser.data.id }
        );
        if (response.status === 200) {
          setFollowers(response.data.data.Followers);
          setFollowing(response.data.data.Following);
          if (response.data.data.Following.includes(props.props.Email)) {
            setFollow(true);
          }
        }
      } catch (error) {
        console.error('Error fetching current user data:', error.message);
      }
    };
    fetchUserData();
    fetchCurrentUser();
  }, [props.props.Email, completeUser.data.id]);
  
  useEffect(() => {
    if (data && data.Github) {
      fetchGitHubData(data.Github);
    }
  }, [data]);

  const handleFollow = async () => {
    setLoad(true);
    try {
      const response = await axios.put('https://alumni-s-hub.onrender.com/api/v1/follow', {
        userId: completeUser.data.id,
        followerId: props.props.Email,
      });
      if (response.status === 200) {
        setFollow(true);
      }
    } catch (error) {
      console.error('Error following user:', error.message);
    } finally {
      setLoad(false);
    }
  };

  const handleUnFollow = async () => {
    setLoad(true);
    try {
      const response = await axios.put('https://alumni-s-hub.onrender.com/api/v1/unfollow', {
        userId: completeUser.data.id,
        followerId: props.props.Email,
      });
      if (response.status === 200) {
        setFollow(false);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error.message);
    } finally {
      setLoad(false);
    }
  };

  return (
    <>
    {
      loading?(
        <div className="w-[300px] h-[300px] bg-slate-400/20 backdrop-blur-3xl rounded-lg flex flex-col justify-start items-center mt-5 space-y-4">
          <div className='w-[80%] h-9 bg-slate-400/20 flex justify-start animate-pulse'>
 
          </div>
          <div className="w-full flex justify-center items-center">
            <div
              className="w-40 h-40 rounded-full bg-slate-400/20 animate-pulse"
            />
        </div>
        </div>
      ):(
        <div className="w-[300px] h-[300px] bg-slate-400/20 backdrop-blur-3xl rounded-lg flex flex-col justify-center mt-5">
        <div className="w-full flex justify-between p-2">
          <p className="text-2xl text-white" >{props.props.Name}</p>
          <p className="text-2xl text-white">
            {props.props.Year}-{props.props.Department}
          </p>
        </div>
        <div className="w-full flex justify-center items-center">
          {gitData ? (
            <img
              src={gitData.avatar_url || profile}
              alt={`${data?.Github}'s Avatar`}
              className="w-40 h-40 rounded-full"
            />
          ) : (
            <Loader2Icon className="text-white animate-spin" />
          )}
        </div>
        <div className="w-full flex justify-between p-2">
          {!isFollow ? (
            <button
              disabled={load}
              className={`w-[100px] rounded-lg h-[35px] text-white ${
                load ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700'
              }`}
              onClick={handleFollow}
            >
              {load ? 
              <div className='w-full flex justify-center'>
                 <Loader2Icon className="animate-spin" /> 
              </div>
              : 'Follow'}
            </button>
          ) : (
            <button
              disabled={load}
              className={`w-[100px] rounded-lg h-[35px] text-white ${
                load ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#484545]'
              }`}
              onClick={handleUnFollow}
            >
              {load ? 
              <div className='w-full flex justify-center'>
                 <Loader2Icon className="animate-spin" /> 
              </div> 
              : 'Un-Follow'}
            </button>
          )}
          <button
            className="w-[100px] bg-orange-500 text-white rounded-lg h-[35px] hover:opacity-90"
            onClick={sendProps}
          >
            View profile
          </button>
        </div>
      </div>
      )
    }
   
    </>
  );
};

export default StudCard;
