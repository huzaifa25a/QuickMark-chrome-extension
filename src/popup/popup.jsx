import React from 'react';
import google from '../assets/google.svg';
import {useState} from 'react';

const Popup = () => {
  const [opensignup, setopensignup] = useState(false);
  
  return (
    <div className='flex flex-col items-center p-8 gap-4 w-[396px] h-auto rounded-[15px] bg-[linear-gradient(0deg,rgba(136,92,92,0.2),rgba(136,92,92,0.2)),linear-gradient(180deg,rgba(56,179,255,0.7)_0%,rgba(206,152,152,0.238)_100%)] border-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)]'>
        <div className='flex flex-col items-center gap-2 w-full'>
            <h2 className='font-kufam font-semibold text-[23px] leading-[25px] text-center tracking-[0.1em] text-white'>
                QuickMark
            </h2>
            <p className='font-kufam font-medium text-[16px] leading-[25px] text-center tracking-[0.04em] text-white mt-2'>
                Fast and efficient bookmark management
            </p>
            <div className='flex flex-row items-center justify-center gap-3 mt-4 w-full'>
                    <button className='flex flex-row py-[4px] px-4 rounded-full border-[1px] border-white text-white font-kufam font-normal text-[14px] leading-[25px] hover:bg-white/20 transition-colors'>
                        Continue with Google 
                        <img src={google} alt='Google-Icon' style={{height:'25px', marginLeft:'8px'}}/>
                    </button>
            </div>
            <div className='flex flex-row items-center justify-around gap-3 mt-3 w-full'>
                <button className='w-[100px] py-[4px] px-4 rounded-full border-[1px] border-white text-white font-kufam font-normal text-[14px] leading-[25px] hover:bg-white/20 transition-colors'>
                    Log In
                </button>
                <button className='w-[100px] py-[4px] px-4 rounded-full border-[1px] border-white text-white font-kufam font-normal text-[14px] leading-[25px] hover:bg-white/20 transition-colors'>
                    Sign Up
                </button>
            </div>
        </div>
    </div>
  )
}

export default Popup