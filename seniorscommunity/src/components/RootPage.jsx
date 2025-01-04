import React, { useEffect, useRef, useState } from 'react'
import { Navbar } from './Navbar'
import Abi from '../assets/abi.png'
import Otpbox from './Otpbox'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';

const RootPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [hide1, setHide1] = useState(true);
  const [color, setColor] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [email1, setEmail] = useState(false);
  const [userdata, setUserdata] = useState(false);
  const emailref = useRef(null);
  const [Redirect,SetRedirect]=useState(false);
  const [datu,setdatu]=useState(null);
  const [correct,Setcorrect]=useState(false);
  const handleChangeOTP = (newOTP) => {
    // console.log(datu);
    setOtp(newOTP);
    if (newOTP === generatedOtp) {
      // console.log("Correct OTP!");
      const sendData=async(datu)=>{
        try {
          const res1= await axios.post('https://alumni-s-hub.onrender.com/api/v1/addUser',datu);
          if(res1.status==201)
          {
           const notify = () => toast('Signed up successfully!');
           notify();
           setTimeout(()=>{
            SetRedirect(true);
            Setcorrect(true);
           },1000);
          }
        } catch (error) {
          console.log(datu);
          const notify = () => toast('error!');
          notify();
        }
      }
      sendData(datu);
    } else {
      console.log("Incorrect OTP.");
    }
  };

  const handleCheckemail = async() => {
    setLoading(true);
    setUserdata(null);
    const email = emailref.current.value;
    let year = "";
    let emailBack = "@srishakthi.ac.in";
    let dummy = "";
    let Name = "";
    let Department = "";
    let f = 0;
    let f1 = 0;
    let f2 = 0;
    for (let i = 0; i < email.length; i++) {
      if (email.charAt(i) === '@') {
        f = 1;
      }
      if (email.charAt(i) >= 0 && email.charAt(i) <= 9) {
        f1 = 1;
        year = year + email.charAt(i);
      }
      if (f1 === 0) {
        Name += email.charAt(i);
      }
      if (f === 1) {
        dummy += email.charAt(i);
      }
    }
    let t=0;
         let fx=0;
         for(let i=0;i<email.length;i++)
         {
            if(email.charAt(i)>='0' && email.charAt(i)<='9')
            {
               t++;
            }
               if(t==2)
                {
                  Department+=email.charAt(i+1);
                  if(email.charAt(i+2)=='@')
                    {
                      break;
                    }
                }
         }
    if (year.length === 2 && dummy === emailBack) {
      setEmail(false);
    } else {
      setEmail(true);
      return;
    }
    let x1 = Name.charAt(Name.length - 1);
    Name = Name.slice(0, -1) + " " + x1;

  const userData = {
      Name: Name.toUpperCase(),
      Email: email,
      Year: year,
      Department: Department.toUpperCase(),
    };
    // console.log(userData);
    setdatu(userData);
    localStorage.setItem('data',JSON.stringify(userData));
    // console.log(JSON.parse(localStorage.getItem('data')));
    setUserdata(userData);
    sendMail(email,Name);
  };
  const sendMail = async (email,Name) => {
    try {
      const response = await fetch("https://alumni-s-hub.onrender.com/generate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email,Name }),
      });

      const result = await response.json();
      if (response.ok) {
        setGeneratedOtp(result.otp);
        // console.log("Generated OTP:", result.otp);
        setEmail(false);
      } else {
        // console.error("Error generating OTP:", result.message);
        setEmail(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setEmail(true);
    }
  };

  const handleConfirm = async () => {
    if (hide1) {
      setHide1(false);
    } else {
      setHide1(true);
    }
  };

  useEffect(() => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    console.log("Generated OTP:", otp);
    // setTimeout(() => setScroll(true), 5000);
    const scrollTimeout = setTimeout(() => {
      const bottomElement = document.getElementById("bottom");
      if (bottomElement) {
        bottomElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 5000);
  }, []);

  let c = 0;
  if (userdata && c === 0)
  {
    setTimeout(() => setLoading(false), 2000);
    const bottomElement1 = document.getElementById("bottom1");
    if (bottomElement1) {
      bottomElement1.scrollIntoView({ behavior: "smooth" });
    }
  }
  if(Redirect)
    {
      navigate('/profile');
    }
    if(localStorage.getItem('completeUser'))
      {
          navigate('/home');
      }
  return (
    <>
     <Toaster />
      <Navbar />
      <div className='w-screen h-screen justify-center items-center flex min-2xl:flex max-lg:flex-col max-2xl:justify-between'>
        <div className=' bg-violet-600 w-full min-h-screen flex flex-col space-y-5 justify-center items-center'>
          <div className='text-5xl text-white font-bold '>
            <p className='hover:text-orange-400'>{color ? (<span className='text-orange-500'>A</span>) : (<span className='text-green-500'>A</span>)}LUMNIS-HUB</p>
          </div>
          <div className='w-[400px] h-[350px] border border-slate-50 rounded-lg bg-slate-200/20 backdrop-blur-3xl flex flex-col justify-center items-center text-center'>
            <div className='text-3xl text-white font-bold'>OUR MOTO</div>
            <div className='text-lg text-white w-[90%]'>
              Empowering connections, bridging experience with curiosity. A hub for shared aspirations and achievements. Where knowledge flows from mentors to eager learners. Celebrating the journeys of our alumni and juniors alike. Together, we build a stronger, united future.
            </div>
            <div className='w-full flex justify-end items-center space-x-2'>
              <img src={Abi} alt="" className='w-[60px] h-[60px] rounded-full' />
              <div className='p-2 flex flex-col'>
                <p className='text-white'>ABISHEK</p>
                <p className='font-bold text-white'></p>
                <p className='text-white'>Mission Possible pvt lmt</p>
              </div>
            </div>
          </div>
        </div>

        <div id='bottom' className='w-full  flex justify-center items-center'>
          <div className='w-[400px] h-auto border border-black rounded-lg  flex flex-col items-center justify-center space-y-5 mt-14 '>
            {hide1 ? (
              <>
                <div className='text-2xl font-bold  text-center'>
                  Join Now!
                </div>
                <div className=''>
                  <input type="text" ref={emailref} className='w-full h-10 border border-black pl-8 pr-8 pt-3 pb-3' placeholder='Official Email Address' />
                  <div className=''>eg.abisheks22it@srishakthi.ac.in</div>
                </div>
                <div><button className='bg-orange-400 text-white p-3 rounded-lg' onClick={handleCheckemail}>Join the community!</button></div>
                <div className='font-bold text-red-500'>{email1 && ("Please enter a valid college email!")}</div>
                <div>
                  {userdata && (
                    !Loading ? (
                      <>
                        <div className='w-full h-full p-5' id='bottom1'>
                          <p className='text-2xl font-bold'>Please confirm your details✅</p>
                          <p>Name: {userdata.Name}</p>
                          <p>Department: {userdata.Department}</p>
                          <p>Email: {userdata.Email}</p>
                          <p>Acadamic year: {`20${userdata.Year}-20${parseInt(userdata.Year) + 4}`}</p>
                          <div className='w-full justify-end flex' onClick={handleConfirm}><button className='bg-green-400 text-white p-2 rounded-lg cursor-pointer'>CONFIRM</button></div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className='w-full h-full justify-center items-center flex'>
                          <div className='w-[50px] h-[50px] bg-orange-400 rounded-full animate-spin'>
                            <div className='w-[40px] h-[40px] bg-[#f8f8f8] rounded-full'></div>
                          </div>
                        </div>
                      </>
                    )
                  )}
                </div>
              </>
            ) : (
              <>
                <div className='w-full flex justify-center flex-col items-center space-y-5 p-10'>
                  <p className=''>OTP is sent to <span className='text-green-500 font-bold'>{userdata.Email}</span></p>
                  <Otpbox length={4} onChangeOTP={handleChangeOTP} Correct={correct} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RootPage;
