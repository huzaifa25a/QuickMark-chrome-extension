import React from 'react';
import {useState, useEffect} from 'react';
import {auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from '../config';
import Bookmark from './bookmark';
import bookmarkIcon from '../assets/bookmark.svg'
import loader from '../assets/bouncing-circles.svg'

const Popup = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showBookmark, setShowBookmark] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        const checkUser = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setShowBookmark(true);
                setLoading(false);
                setShowSignup(false);
                setShowLogin(false);
            } else {
                setUser(null);
                setLoading(false);
                setShowLogin(true);
                setShowBookmark(false);
            }
        });
        return () => checkUser();
    }, []);

    const login = async () => {
        if (!email || !password) {
            console.log("Both email and password are required!");
            return;
        }
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            chrome.storage.local.set({user: result.user.email});
            console.log("Email is: ", result.user.email);
            console.log("User Id is: ", result.user.uid);
            chrome.storage.local.set({userId: result.user.uid});
            if(result){
                setShowLogin(false);
                setShowSignup(false);
                setLoading(false);
                setShowBookmark(true);
            }
            console.log("User authenticated:", result.user);
        } catch (error) {
            console.log("Authentication error:", error.message);
        }
    };

    const signin = async () => {
        if (!email || !password) {
            console.log("Both email and password are required!");
            return;
        }
        try{
            const result = await createUserWithEmailAndPassword(auth, email, password);
            setLoading(true);
            if(result){
                setLoading(false);
                setShowLogin(false);
                setShowSignup(false);
                setShowBookmark(true);
            }
            console.log("User has been signed up.");
        }
        catch (error) {
            // Handle errors
            if (error.code === "auth/email-already-in-use") {
              console.error("This account is already in use.");
              return;
            } else {
              throw error;
            }
          }
    }

    async function goToLogin(){
        setShowSignup(false);
        setShowLogin(true);
    }

    async function goToSignup(){
        setShowLogin(false);
        setShowSignup(true);
    }

  return (
    <>
        {showSignup && 
        <div className='flex flex-col items-center w-[347px] h-auto bg-[#FFFBEF] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]'>
        <div id='header' className='flex flex-row justify-center items-center bg-[#5591D7] w-[347px] h-[41px]'>
            <h1 className='flex text-[16px] font-semibold tracking-[1px] text-white'>
                <img src={bookmarkIcon} alt='bookmark-icon'/>
                Quickmark AI Bookmark Manager
            </h1>
        </div>
            <div className='p-3'>
                <div className='flex flex-col items-center p-4 w-[320px] bg-[white] rounded-lg shadow-md border-[#f0f0f0] border-[1px]'>
                    <h2 className='font-kufam font-semibold text-[16px] leading-[25px] text-center tracking-[0.1em] text-black'>
                        Signup 
                    </h2>
                    <div className='flex flex-col items-center justify-around gap-3 mt-3 w-full'>
                        <div className='flex flex-col items-start'>
                            <label htmlFor='email' className='font-normal text-[12px] tracking-widest'>Email</label>
                            <input 
                            type='email'
                            id='email'
                            placeholder='Enter Email'
                            value={email}
                            className='rounded w-[225px] border-[#aeaeaee0] border-[2px] p-2 bg-[#fefefe] text-[#5d5d5d] font-normal font-kufam text-[13px] tracking-[1px] outline-none'
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col items-start'>
                            <label htmlFor='password' className='font-normal text-[12px] tracking-widest'>Password</label>
                            <input 
                            type='password'
                            id='password'
                            placeholder='Enter Password'
                            value={password}
                            className='rounded w-[225px] border-[#aeaeaee0] border-[2px] p-2 bg-[#fefefe] text-[#5d5d5d] font-normal font-kufam text-[13px] tracking-[1px] outline-none'
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button id='signup' onClick = {signin} className='w-[225px] bg-[#5591D7] py-[4px] px-4 rounded border-[1px] border-white text-white font-kufam font-normal text-[14px] leading-[25px] hover:bg-[#3f85d5] transition-colors shadow-sm'>
                            Sign Up
                        </button>
                        <p className='text-[12px] text-black'>Already have an account? <button className='text-[#498fff] hover:text-[#0b57d0]' onClick={goToLogin}>Login</button></p>
                    </div>
                </div>
            </div>
        </div>
        }
        {showLogin && 
        <div className='flex flex-col items-center w-[347px] h-auto bg-[#FFFBEF] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]'>
        <div id='header' className='flex flex-row justify-center items-center bg-[#5591D7] w-[347px] h-[41px]'>
            <h1 className='flex text-[16px] font-semibold tracking-[1px] text-white'>
                <img src={bookmarkIcon} alt='bookmark-icon'/>
                Quickmark AI Bookmark Manager
            </h1>
        </div>
        <div className='p-3'>
            <div className='flex flex-col items-center p-4 w-[320px] bg-[white] rounded-lg shadow-md border-[#f0f0f0] border-[1px]'>
                <h2 className='font-kufam font-semibold text-[16px] leading-[25px] text-center tracking-[0.1em] text-black'>
                    Login
                </h2>
                <div className='flex flex-col items-center justify-around gap-3 mt-3 w-full'>
                    <div className='flex flex-col items-start'>
                        <label htmlFor='email' className='font-normal text-[12px] tracking-widest'>Email</label>
                        <input 
                        type='email'
                        id='email'
                        placeholder='Enter Email'
                        value={email}
                        className='rounded w-[225px] border-[#aeaeaee0] border-[2px] p-2 bg-[#fefefe] text-[#5d5d5d] font-normal font-kufam text-[13px] tracking-[1px] outline-none'
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col items-start'>
                        <label htmlFor='password' className='font-normal text-[12px] tracking-widest'>Password</label>
                        <input 
                        type='password'
                        id='password'
                        placeholder='Enter Password'
                        value={password}
                        className='rounded w-[225px] border-[#aeaeaee0] border-[2px] p-2 bg-[#fefefe] text-[#5d5d5d] font-normal font-kufam text-[13px] tracking-[1px] outline-none'
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button id='signup' onClick = {login} className='w-[225px] bg-[#5591D7] py-[4px] px-4 rounded border-[1px] border-white text-white font-kufam font-normal text-[14px] leading-[25px] hover:bg-[#3f85d5] transition-colors shadow-sm'>
                        Login
                    </button>
                    <p className='text-[12px] text-black'>Don't have an account? <button className='text-[#498fff] hover:text-[#0b57d0]' onClick={goToSignup}>Signup</button></p>
                </div>
            </div>
        </div>
        </div>
        }    
        {showBookmark && 
        <Bookmark user={setUser} bookmark={setShowBookmark} login={setShowLogin}/>
        }
        {loading && 
        <div className='w-[347px] h-[137px] flex items-center justify-center'>
            <div className='flex items-end gap-[1px]'>
                <span className='text-[16px] font-semibold tracking-[1px]'>Please wait</span>
                <img src={loader} alt='Loading' className='h-[16px]'/>
            </div>
        </div>
        }
    </>
  )
}

export default Popup