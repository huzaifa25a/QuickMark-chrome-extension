import React, { useEffect, useState } from 'react'
import { auth, signOut, db } from '../config'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
import cancelIcon from '../assets/x.svg'
import bookmarkIcon from '../assets/bookmark.svg'
import titleIcon from '../assets/title.svg'
import tag from '../assets/tag.png'
import link from '../assets/link.svg'
import savedIcon from '../assets/savedIcon.svg'
import deleteIcon from '../assets/delete.svg'
import settingsIcon from '../assets/settingsIcon.svg'
import logoutIcon from '../assets/logout-icon.svg'
import gotoIcon from '../assets/external-link.png'

const Bookmark = (props) => {
    const [userId, setUserId] = useState(null);
    const [title, setTitle] = useState(null);
    const [url, setUrl] = useState(null);
    const [tags, setTags] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);

    const handleLogout = async () => {
        await signOut(auth);
        props.user(null);
        props.bookmark(false);
        props.login(true);
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);  
      
    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const activeTab = tabs[0];
                console.log("Active Tab Info:", activeTab);
                // You can access the tab's URL, title, etc.
                const pageTitle = activeTab.title;
                setTitle(pageTitle);
                const pageUrl = activeTab.url;
                setUrl(pageUrl);
                console.log("URL:", pageUrl);
                console.log("Title:", pageTitle);
            } else {
                console.log("No active tab found.");
                }
              }); 
    }, []); 

    const handleSave = async () => {
        const {userId} = await chrome.storage.local.get('userId');
        console.log("User Id is: ", userId);
        setUserId(userId);
        const bookmark = {
            user_id: userId,
            title,
            url,
            tags,
            date: new Date().toISOString()
        }

        try{
            await addDoc(collection(db, "Bookmarks"), bookmark);
            setTitle(null);
            setUrl(null);
            setTags(null);
            fetchBookmarks();
        }
        catch(error){
            console.error('Error saving bookmark', error);
            alert("Failed to save bookmark");
        }
    };

    const fetchBookmarks = async () => {
        try {
          const {userId} = await chrome.storage.local.get('userId');
          console.log("User Id is: ", userId);  
          setUserId(userId);
          const bookmarkList = await getDocs(collection(db, "Bookmarks"));
          const bookmarks = bookmarkList.docs
          .filter((doc) => doc.data().user_id === userId)
          .map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log("Bookmarks:", bookmarks);
          setBookmarks(bookmarks); // Assuming you're using useState
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        }
    };

    const removeBookmark = async (id) => {
        try{
            await deleteDoc(doc(db, "Bookmarks", id));
            fetchBookmarks();
        }
        catch(error){
            console.error("error deleting bookmark: ", error);
        }
    };
      
  return (
    <div className='flex flex-col items-center w-[347px] h-auto max-h-[598px] bg-[#FFFBEF] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] overflow-hidden'>
        <div id='header' className='flex flex-row justify-around items-center bg-[#5591D7] w-[347px] h-[41px]'>
            <h1 className='flex text-[16px] font-semibold tracking-[1px] text-white'>
                <img src={bookmarkIcon} alt='bookmark-icon' className='h-[20px] mt-[3px] mr-[2px]'/>
                Quickmark AI Bookmark Manager
            </h1>
            <button onClick={() => window.close()}>
                <img src={cancelIcon} alt='go-Back' className='h-[24px]'/>
            </button>
        </div>
            <div className='py-3'>
                <div className='flex flex-col items-center p-2 w-[320px] bg-[white] rounded-lg shadow-md border-[#f0f0f0] border-[1px]'>
                    <div className='flex flex-col items-center justify-around gap-1 p-2 w-full'>
                        <div className='flex flex-col items-start'>
                            <label htmlFor='title' className='flex gap-1 items-center mb-1 text-end font-normal text-[16px] tracking-widest'>
                                <img src={titleIcon} alt="Enter title"/>
                                Title
                            </label>
                            <input 
                            type='title'
                            id='title'
                            value={title}
                            placeholder='AI suggested name'
                            className='rounded w-[265px] border-[#aeaeaee0] border-[2px] p-2 bg-[#fefefe] text-[#5d5d5d] font-normal font-kufam text-[13px] tracking-[1px] outline-none'
                            onChange={(e) => setTitle(e.target.value)}
                            required
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
                            value={url}
                            placeholder='https://www.example.com'
                            className='rounded w-[265px] border-[#aeaeaee0] border-[2px] p-2 bg-[#fefefe] text-[#5d5d5d] font-normal font-kufam text-[13px] tracking-[1px] outline-none'
                            onChange={(e) => setUrl(e.target.value)}
                            required
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
                            onChange={(e) => {
                                const input = e.target.value;
                                const tagList = input.split(',').map(tag => tag.trim());
                                setTags(tagList);
                            }}
                            />
                        </div>
                        <button onClick={handleSave} className='w-[225px] mt-[15px] bg-[#5591D7] py-[4px] px-4 rounded-lg border-[1px] border-white text-white font-kufam font-normal text-[14px] leading-[25px] hover:bg-[#3f85d5] transition-colors shadow-sm'>
                            Save Bookmark
                        </button>
                    </div>
                </div>
            </div>
            <div className='pb-3 mt-1 max-h-[174px]'>
                <div className='flex flex-col p-2 w-[320px] bg-[white] rounded-lg shadow-md border-[#f0f0f0] border-[1px]'>
                    <div className='flex flex-row justify-start gap-2'>
                        <img src={savedIcon} alt="Saved bookmarks"/>
                        <span className='font-normal text-[16px] tracking-widest'>Saved Bookmarks</span>
                    </div><hr className='mt-[2px] ml-[-9px] w-[320px]'/>
                    <div className='flex flex-col items-center justify-around gap-3 p-2 w-full max-h-[120px] overflow-y-auto'>
                    {bookmarks.map((bookmark) => (
                        <div className='bg-white w-[290px] py-2 px-1.5 border-[rgba(0,0,0,0.14)] border-[1px] rounded-[10px] flex flex-row items-center justify-between shadow-md'>
                            <div className='flex flex-col gap-1'>
                                <a href={bookmark.url} target='_blank' className='flex gap-1.5 items-center'>
                                    <span key={bookmark.id} className='text-[14px] w-auto max-w-[215px] truncate tracking-[4%] font-semibold'>
                                        {bookmark.title}    
                                    </span>
                                    <img src={gotoIcon} alt='external link' className='h-[12px] transition-all hover:scale-110 duration-200'/>
                                </a>    
                                <span key={bookmark.id} className='flex gap-1 text-[12px] tracking-[4%]'><span className='font-semibold'>Tags: </span>{bookmark.tags ? bookmark.tags.join(", ") : ""}</span>  
                            </div>
                            <button onClick={() => removeBookmark(bookmark.id)} className='cursor-pointer'>
                                <img src={deleteIcon} alt='bookmark Icon' className='h-[16px] transition-transform duration-200 hover:scale-125'/>
                            </button>
                        </div>
                        ))}
                    </div>
                </div>
            </div>    
        <div id='footer' className='flex flex-row p-4 justify-between items-center bg-[#5591D7] w-[347px] h-[41px]'>
            <div className='flex gap-1'>
                <button className='cursor-pointer'>
                    <img src={settingsIcon} alt='bookmark-icon' className='h-[20px] mt-[3px] mr-[2px] transition-tranform hover:scale-110 duration-200'/>
                </button>
                <span className='text-[16px] font-normal tracking-[1px] text-white'>Settings</span>
            </div>
            <div className='flex gap-1 cursor-pointer' onClick={handleLogout}>
                <button>
                    <img src={logoutIcon} alt='bookmark-icon' className='h-[20px] mt-[3px] mr-[2px] transition-all hover:scale-110 duration-200'/>
                </button>
                <span className='pb-[1px] text-[16px] font-normal tracking-[1px] text-white border-b-2 border-transparent hover:border-white'>Logout</span>
            </div>
        </div>    
    </div>
  )
}

export default Bookmark