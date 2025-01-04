import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';

const FollowCard = ({ data: propData }) => {
  const [localData, setLocalData] = useState(null);
  const [gitData, setGitData] = useState(null);
  const [Userdata, setUserdata] = useState(null);
  const [isFollow, setIsFollow] = useState(false);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  const sendProps = () => {
    navigate('/profilecard/', {
      state: {
        data: {
          githubdata: gitData,
          userdata: localData?.data,
          acadamicdata: Userdata,
          follow: isFollow,
        },
      },
    });
  };

  const completeUser = JSON.parse(localStorage.getItem('completeUser'));

  const getData = async () => {
    try {
      const response = await axios.post('https://alumni-s-hub.onrender.com/api/v1/getData', { id: propData });
      if (response.status === 200) {
        setLocalData(response.data);
        setUserdata(response.data.data1);
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [propData]);

  const handleFollow = async () => {
    setLoad(true);
    try {
      const response = await axios.put('https://alumni-s-hub.onrender.com/api/v1/follow', {
        userId: completeUser.data.id,
        followerId: localData.data.id,
      });
      if (response.status === 200) {
        setIsFollow(true);
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
        followerId: localData.data.id,
      });
      if (response.status === 200) {
        setIsFollow(false);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error.message);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    if (localData?.data?.Github) {
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
      fetchGitHubData(localData.data.Github);
    }

    if (completeUser && localData) {
      if (completeUser.data.Following.includes(localData.data.id)) {
        setIsFollow(true);
      }
    }
  }, [localData]);

  return (
    <>
      <div className="w-full bg-[#121212] p-2 text-white h-auto flex">
        <div className="w-full flex items-center space-x-3">
          <img
            className="w-[50px] h-[50px] rounded-full cursor-pointer"
            onClick={sendProps}
            src={gitData?.avatar_url || ''}
            alt="GitHub Avatar"
          />
          <div className="w-full flex flex-col">
            <div className="w-full flex justify-between p-2">
              <p className="cursor-pointer" onClick={sendProps}>
                {Userdata ? Userdata.Name : 'Loading GitHub Data...'}
              </p>
              <p>{Userdata ? `${Userdata.Year}-${Userdata.Department}` : 'Loading...'}</p>
            </div>
            <p>{gitData?.bio || null}</p>
          </div>
        </div>
        {completeUser.data.id !== localData?.data?.id && (
          <div className="w-auto ml-auto">
            {!isFollow ? (
              <button
                disabled={load}
                className={`w-[100px] rounded-lg h-[35px] text-white ${
                  load ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700'
                }`}
                onClick={handleFollow}
              >
                {load ? (
                  <div className="w-full flex justify-center">
                    <Loader2Icon className="animate-spin" />
                  </div>
                ) : (
                  'Follow'
                )}
              </button>
            ) : (
              <button
                disabled={load}
                className={`w-[100px] rounded-lg h-[35px] text-white ${
                  load ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#484545]'
                }`}
                onClick={handleUnFollow}
              >
                {load ? (
                  <div className="w-full flex justify-center">
                    <Loader2Icon className="animate-spin" />
                  </div>
                ) : (
                  'Un-Follow'
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FollowCard;
