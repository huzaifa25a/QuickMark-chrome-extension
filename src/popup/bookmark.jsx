import React from 'react'
import cancelIcon from '../assets/x.svg'
import bookmarkIcon from '../assets/bookmark.svg'
import titleIcon from '../assets/title.svg'
import tag from '../assets/tag.png'
import link from '../assets/link.svg'
import savedIcon from '../assets/savedIcon.svg'
import redBookmark from '../assets/red-bookmark.svg'
import settingsIcon from '../assets/settingsIcon.svg'
import logoutIcon from '../assets/logout-icon.svg'

const Bookmark = () => {
  return (
    <div className='flex flex-col items-center w-[347px] h-[598px] bg-[#FFFBEF] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]'>
        <div id='header' className='flex flex-row justify-around items-center bg-[#5591D7] w-[347px] h-[41px]'>
            <h1 className='flex text-[16px] font-semibold tracking-[1px] text-white'>
                <img src={bookmarkIcon} alt='bookmark-icon' className='h-[20px] mt-[3px] mr-[2px]'/>
                Quickmark AI Bookmark Manager
            </h1>
            <button onClick={() => window.close()}>
                <img src={cancelIcon} alt='go-Back' className='h-[24px]'/>
            </button>
        </div>
        <div className='overflow-auto'>
            <div className='py-3'>
                <div className='flex flex-col items-center p-2 w-[320px] bg-[white] rounded-lg shadow-md border-[#f0f0f0] border-[1px]'>
                    <div className='flex flex-col items-center justify-around gap-3 p-2 w-full'>
                        <div className='flex flex-col items-start'>
                            <label htmlFor='title' className='flex gap-1 items-center mb-1 text-end font-normal text-[16px] tracking-widest'>
                                <img src={titleIcon} alt="Enter title"/>
                                Title
                            </label>
                            <input 
                            type='title'
                            id='title'
                            placeholder='AI suggested name'
                            className='rounded w-[265px] border-[#aeaeaee0] border-[2px] p-2 bg-[#fefefe] text-[#5d5d5d] font-normal font-kufam text-[13px] tracking-[1px] outline-none'
                            // onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col items-start'>
                            <label htmlFor='url' className='flex gap-1 items-center mb-1 text-end font-normal text-[16px] tracking-widest'>
                                <img src={link} alt="Enter title"/>
                                URL
                            </label>
                            <input 
                            type='url'
                            id='url'
                            placeholder='https://www.example.com'
                            className='rounded w-[265px] border-[#aeaeaee0] border-[2px] p-2 bg-[#fefefe] text-[#5d5d5d] font-normal font-kufam text-[13px] tracking-[1px] outline-none'
                            // onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col items-start'>
                            <label htmlFor='tags' className='flex gap-1 items-center mb-1 text-end font-normal text-[16px] tracking-widest'>
                                <img src={tag} alt="Enter title" className='h-[20px]'/>
                                Tags
                            </label>
                            <input 
                            type='tags'
                            id='tags'
                            placeholder='Tech, AI, Software development'
                            className='rounded w-[265px] border-[#aeaeaee0] border-[2px] p-2 bg-[#fefefe] text-[#5d5d5d] font-normal font-kufam text-[13px] tracking-[1px] outline-none'
                            // onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button className='w-[225px] mt-[15px] bg-[#5591D7] py-[4px] px-4 rounded-lg border-[1px] border-white text-white font-kufam font-normal text-[14px] leading-[25px] hover:bg-[#3f85d5] transition-colors shadow-sm'>
                            Save Bookmark
                        </button>
                    </div>
                </div>
            </div>
            <div className='pb-3'>
                <div className='flex flex-col p-2 w-[320px] bg-[white] rounded-lg shadow-md border-[#f0f0f0] border-[1px]'>
                    <div className='flex flex-row justify-start gap-2'>
                        <img src={savedIcon} alt="Saved bookmarks"/>
                        <span className='font-normal text-[16px] tracking-widest'>Saved Bookmarks</span>
                    </div>
                    <div className='flex flex-col items-center justify-around gap-3 p-2 w-full'>
                        <div className='bg-white w-[290px] py-2 px-1.5 border-[rgba(0,0,0,0.14)] border-[1px] rounded-[10px] flex flex-row items-center justify-between shadow-md'>
                            <div className='flex flex-col gap-1'>
                                <span className='text-[14px] tracking-[4%] font-semibold'>Full-Stack developer roadmap</span>
                                <span className='flex gap-1 text-[12px] tracking-[4%]'><span className='font-semibold'>Tags: </span>Tech, AI, Web development</span>
                            </div>
                            <img src={redBookmark} alt='bookmark Icon'/>
                        </div>
                        <div className='bg-white w-[290px] py-2 px-1.5 border-[rgba(0,0,0,0.14)] border-[1px] rounded-[10px] flex flex-row items-center justify-between shadow-md'>
                            <div className='flex flex-col gap-1'>
                                <span className='text-[14px] tracking-[4%] font-semibold'>DSA Cheatsheet</span>
                                <span className='flex gap-1 text-[12px] tracking-[4%]'><span className='font-semibold'>Tags: </span>Data Structures, Algorithms</span>
                            </div>
                            <img src={redBookmark} alt='bookmark Icon'/>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
        <div id='footer' className='flex flex-row p-4 justify-between items-center bg-[#5591D7] w-[347px] h-[41px]'>
            <div className='flex gap-2'>
                <button className='cursor-pointer'>
                    <img src={settingsIcon} alt='bookmark-icon' className='h-[20px] mt-[3px] mr-[2px]'/>
                </button>
                    <span className='text-[16px] font-normal tracking-[1px] text-white'>Settings</span>
                </div>
                <div className='flex gap-2'>
                <button className='cursor-pointer'>
                    <img src={logoutIcon} alt='bookmark-icon' className='h-[20px] mt-[3px] mr-[2px]'/>
                </button>
                <span className='text-[16px] font-normal tracking-[1px] text-white'>Logout</span>
            </div>
        </div>    
    </div>
  )
}

export default Bookmark