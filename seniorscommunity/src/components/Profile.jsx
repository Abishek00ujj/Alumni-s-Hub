import React, { useEffect, useRef } from 'react'
import Navbar from './Navbar';
import { useState } from 'react'
// import Navbar from './Navbar'
import Stdimg from '../assets/clgstd.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { SetcompleteUser } from '../store';
const Profile = () => {
    const navigate = useNavigate();
    const [Loading, setLoading] = useState(false);
    const [darkmode, setDarkmode] = useState(true);
    const [Hide, setHide] = useState(true);
    const [Mail, setMail] = useState(false);
    const HandleMonkey = () => {
        setHide(false);
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
    }
    const HandleDarkmode = () => {
        if (darkmode) {
            setDarkmode(false);
        }
        else {
            setDarkmode(true);
        }
    }
    let UserData = localStorage.getItem('data');
    const linkedinRef = useRef(null);
    const githubRef = useRef(null);
    const leetcodeRef = useRef(null);
    const HandleSubmit = async () => {
        try {
            const obj = {
                id: UserData.Email,
                Linkedin: linkedinRef.current.value,
                Github: githubRef.current.value,
                Leetcode: leetcodeRef.current.value
            }
            const res=await axios.post('https://alumni-s-hub.onrender.com/api/v1/addData',obj);
            if (res.status === 200) {
                localStorage.setItem('userData', JSON.stringify(obj));
                console.log("UserData", JSON.parse(localStorage.getItem('userData')));
                if (localStorage.getItem('data')) {
                    console.log("Data", localStorage.getItem('data'));
                } else {
                    console.log("No data found in localStorage for 'data'");
                }
                if (res.status === 200)
                    {
                        navigate('/userprofile');
                        localStorage.setItem('completeUser',res.data);
                   }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const res = await axios.post('https://alumni-s-hub.onrender.com/api/v1/getData', { id: UserData.Email });
                    console.log(res.status);
                    if (res.status === 200)
                    {
                        navigate('/userprofile');
                        localStorage.setItem('completeUser',res.data);
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }, []);
    return (
        <>
            {
                UserData ? (
                    <>
                        <Navbar />
                        <div className={darkmode ? ("w-screen h-screen bg-black  justify-center items-center flex flex-row-reverse min-2xl:flex max-lg:flex-col p-5 max-2xl:justify-between") : ("w-screen h-screen bg-[#f8f8f8]  justify-center items-center flex flex-row-reverse min-2xl:flex max-lg:flex-col p-5 max-2xl:justify-between p-5")}>
                            <div className='w-[400px] h-[380px] bg-slate-50 rounded-xl flex flex-col space-y-5 justify-center items-center border border-black m-10 p-5'>
                                {
                                    Hide ? (
                                        <>
                                            <div className='text-4xl font-bold' onClick={HandleDarkmode}>Profile creation🤩</div>
                                            <div> <span className='font-bold'>Students & Alumni</span> (SIET)</div>
                                            {/* <div>Please select your year of passing to sign in.</div> */}
                                            <div>
                                                <button className='bg-blue-950 text-white p-3 rounded-xl' onClick={HandleMonkey}>Create profile!</button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className='w-full h-full flex flex-col justify-around items-center space-y-5'>
                                            {
                                                Loading ? (
                                                    <div className='w-[400px] h-[380px] justify-center items-center flex'>
                                                        <div className='w-[50px] h-[50px] bg-orange-400 rounded-full animate-spin'>
                                                            <div className='w-[40px] h-[40px] bg-[#f8f8f8] rounded-full'></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className='text-2xl font-bold font-sans'>
                                                            Your Profile details!🤩
                                                        </div>
                                                        <div>
                                                            <input ref={linkedinRef} type="text" className='border border-black pl-8 pr-8 pt-3 pb-3 rounded-lg w-full' placeholder='Linkedin Profile Link*' />
                                                        </div>
                                                        <div>
                                                            <input ref={leetcodeRef} type="text" className='border border-black pl-8 pr-8 pt-3 pb-3 rounded-lg w-full' placeholder='Leetcode username*' />
                                                        </div>
                                                        <div>
                                                            <input ref={githubRef} type="text" name="" id="" className='border border-black pl-8 pr-8 pt-3 pb-3 rounded-lg w-full' placeholder='Github username*' />
                                                        </div>
                                                        <div>
                                                            <button onClick={HandleSubmit} className='bg-blue-950 p-3 rounded-lg text-white'>Show my profile🎉</button>
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </div>
                                    )
                                }
                            </div>
                            <div className=' max-xl:w-[50%] max-sm:w-screen h-auto'>
                                <img src={Stdimg} alt="" className='w-[500px] h-[400px]' />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Navbar />
                    </>
                )
            }
        </>
    )
}

export default Profile