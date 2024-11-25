import React, { useState } from 'react'

const Otpbox = ({length,onChangeOTP,Correct}) => {
    
    const [otp,setOtp]=useState(new Array(length).fill(""));
    const handleChange = (element, index) => {
        const value = element.value;
        if (value && !isNaN(value)) { 
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            onChangeOTP(newOtp.join(""));

            if (index < length - 1) {
                element.nextSibling?.focus();
            }
        }
    };
 const handleBackspace=(element,index)=>{
    const newOtp=[...otp];
    newOtp[index]="";
    setOtp(newOtp);

    if(index > 0)
    {
        element.previousSibling.focus();
    }
    onChangeOTP(newOtp.join(""));
 }
    
  return (
    <>
     <div>
        {
            otp.map((data,index)=>{
                return(
                    <input 
                    key={index}
                    type="text"
                    maxLength={1}
                    value={data}
                    className={ Correct?(`w-14 h-14 border-[3px] mr-5 text-2xl text-medium rounded-lg text-center border-green-500`):(`w-14 h-14 border-[3px] mr-5 text-2xl text-medium rounded-lg text-center`)}
                    onChange={(e)=>handleChange(e.target,index)}
                    onKeyDown={e=>{
                        if(e.key=='Backspace')
                        {
                            handleBackspace(e.target,index);
                        }
                    }
                    }
                     />
                )
            })
        }
     </div>
    </>
  )
}

export default Otpbox