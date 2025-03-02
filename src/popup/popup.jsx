import React from 'react';
import google from '../assets/google.svg';
import cross from '../assets/x.svg';
import goBack from '../assets/arrow-left.svg'
import {useState} from 'react';
import {auth, provider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut,  placesApiKey} from './config';

const Popup = () => {
    const [user, setUser] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    async function getLocation(query){
        const endpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${placesApiKey}`;
        try{
            const respone = await fetch(endpoint);
            if(!respone.ok){
                throw new Error(`API error: ${respone.status}`);
            }
            const data = await respone.json();
            console.log(`The fetched suggested location data is:`, data);
            setSuggestions(data.predictions);
        }
        catch{
            console.log("Error fetching autocomplete location: ", error);
            return [];
        }
    }
    
    const googleSignIn = async () => {
        try{
            const result =  await signInWithPopup(auth, provider);
            setUser(result.user);
            console.log("User has been found: ", result.user);
        }
        catch(error){
            console.log("Error finding user: ",error);
        }
    }

    // const signup = document.getElementById('signup');
    const login = async () => {
        if (!email || !password) {
            console.log("Both email and password are required!");
            return;
        }
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            setUser(result.user);
            console.log("User authenticated:", result.user);
        } catch (error) {
            console.log("Authentication error:", error.message);
        }
    };

    const signin = async () => {
        try{
            const result = await createUserWithEmailAndPassword(auth, email, password);
            setUser(result.user);
            console.log("User has been signed up.");
        }
        catch(error){
            console.log("User could not be signed up: ",error);
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
    <div className='flex flex-col items-center p-8 gap-4 w-[396px] h-auto bg-[linear-gradient(0deg,rgba(136,92,92,0.2),rgba(136,92,92,0.2)),linear-gradient(180deg,rgba(56,179,255,0.7)_0%,rgba(206,152,152,0.238)_100%)] border-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)]'>
        {!showSignup && !showLogin && 
            <div className='flex flex-col items-center gap-2 w-full'>
                <h2 className='font-kufam font-semibold text-[23px] leading-[25px] text-center tracking-[0.1em] text-white'>
                    QuickMark
                </h2>
                <p className='font-kufam font-medium text-[16px] leading-[25px] text-center tracking-[0.04em] text-white mt-2'>
                    Fast and efficient bookmark management
                </p>
                <div className='flex flex-row items-center justify-center gap-3 mt-4 w-full'>
                        <button onClick={googleSignIn} className='flex flex-row py-[4px] px-4 rounded-full border-[1px] border-white text-white font-kufam font-normal text-[14px] leading-[25px] hover:bg-white/20 transition-colors'>
                            Continue with Google 
                            <img src={google} alt='Google-Icon' style={{height:'25px', marginLeft:'8px'}}/>
                        </button>
                </div>
                <div className='flex flex-row items-center justify-around gap-3 mt-3 w-full'>
                    <button onClick={() => setShowLogin(true)} className='w-[100px] py-[4px] px-4 rounded-full border-[1px] border-white text-white font-kufam font-normal text-[14px] leading-[25px] hover:bg-white/20 transition-colors'>
                        Log In
                    </button>
                    <button onClick={() => setShowSignup(true)} className='w-[100px] py-[4px] px-4 rounded-full border-[1px] border-white text-white font-kufam font-normal text-[14px] leading-[25px] hover:bg-white/20 transition-colors'>
                        Sign Up
                    </button>
                </div>
                {/* <div>
                    <input 
                        type='text'
                        placeholder='Type location'
                        onChange={(e) => getLocation(e.target.value)}
                        className='p-2 rounded mt-2 w-full'
                    />
                    <div className="suggestions-list bg-white rounded mt-2 w-full max-h-40 overflow-y-auto shadow">
                        {suggestions.map((suggestion, index) => (
                            <div 
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => console.log(`Selected: ${suggestion.description}`)}
                            >
                                {suggestion.description}
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        }
        {showSignup && 
        <div>
            <div className='flex flex-row justify-between w-[363px] mt-[-20px]'>
                <button onClick={() => setShowSignup(false)}>
                    <img src={goBack} alt='go-Back' className='h-[1.5rem]'/>
                </button>
                <button onClick={window.close}>
                    <img src={cross} alt='cross-icon' className='h-[1.75rem]'/>
                </button>
            </div>
            <div className='flex flex-col items-center gap-2 w-full'>
                <h2 className='font-kufam font-semibold text-[19px] leading-[25px] text-center tracking-[0.1em] text-white'>
                    SIGNUP 
                </h2>
                <div className='flex flex-col items-center justify-around gap-3 mt-3 w-full'>
                    <input 
                    type='email'
                    id='email'
                    placeholder='Enter Email'
                    value={email}
                    className='rounded w-[225px] border-[#aeaeaee0] border-[2px] p-2 bg-[#fefefe] text-[#5d5d5d] font-normal font-kufam text-[13px] tracking-[1px] outline-none'
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                    type='password'
                    id='password'
                    placeholder='Enter Password'
                    value={password}
                    className='rounded w-[225px] border-[#aeaeaee0] border-[2px] p-2 bg-[#fefefe] text-[#5d5d5d] font-normal font-kufam text-[13px] tracking-[1px] outline-none'
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <button id='signup' onClick = {signin} className='w-[100px] py-[4px] px-4 rounded-full border-[1px] border-white text-white font-kufam font-normal text-[14px] leading-[25px] hover:bg-white/20 transition-colors'>
                        Register
                    </button>
                    <p className='text-[12px] text-white'>Already have an account? <button onClick={goToLogin}>Login</button></p>
                </div>
            </div>
        </div>
        }
        {showLogin && 
        <div>
            <div className='flex flex-row justify-between w-[363px] mt-[-20px]'>
                <button onClick={() => setShowLogin(false)}>
                    <img src={goBack} alt='go-Back' className='h-[1.5rem]'/>
                </button>
                <button onClick={window.close}>
                    <img src={cross} alt='cross-icon' className='h-[1.75rem]'/>
                </button>
            </div>
            <div className='flex flex-col items-center gap-2 w-full'>
                <h2 className='font-kufam font-semibold text-[19px] leading-[25px] text-center tracking-[0.1em] text-white'>
                    LOGIN
                </h2>
                <div className='flex flex-col items-center justify-around gap-3 mt-3 w-full'>
                    <input 
                    type='email'
                    id='email'
                    placeholder='Enter Email'
                    value={email}
                    className='rounded w-[225px] border-[#aeaeaee0] border-[2px] p-2 bg-[#fefefe] text-[#5d5d5d] font-normal font-kufam text-[13px] tracking-[1px] outline-none'
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                    type='password'
                    id='password'
                    placeholder='Enter Password'
                    value={password}
                    className='rounded w-[225px] border-[#aeaeaee0] border-[2px] p-2 bg-[#fefefe] text-[#5d5d5d] font-normal font-kufam text-[13px] tracking-[1px] outline-none'
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <button id='signup' onClick = {login} className='w-[100px] py-[4px] px-4 rounded-full border-[1px] border-white text-white font-kufam font-normal text-[14px] leading-[25px] hover:bg-white/20 transition-colors'>
                        Login
                    </button>
                    <p className='text-[12px] text-white'>Don't have an account? <button onClick={goToSignup}>Signup</button></p>
                </div>
            </div>
        </div>
        }
    </div>
  )
}

export default Popup