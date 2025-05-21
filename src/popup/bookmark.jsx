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
import arrowUp from '../assets/arrow-up.png'
import arrowDown from '../assets/arrow-down.png'
import searchIcon from '../assets/search-icon.png'
import cancel from '../assets/cancel.svg'
import slider from '../assets/slider.png'
import sort_desc from '../assets/sort-desc.png'
import sort_asc from '../assets/sort-asc.png'
import calendar from '../assets/calendar.png'

const Bookmark = (props) => {
    const [userId, setUserId] = useState(null);
    const [title, setTitle] = useState(null);
    const [url, setUrl] = useState(null);
    const [tags, setTags] = useState(null);
    const [favIcon, setFavIcon] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);
    const [saveClicked, setSaveClicked] = useState(chrome.storage.local.get('dropDown', (result) => {
        console.log('Retrieved dropdown state:', result.dropDown);
        setSaveClicked(result.dropDown);
    }));
    const [showSearch, setShowSearch] = useState(false);
    const [showSearchResult, setShowSearchResult] = useState(false);
    const [showSearchedBookmarks, setShowSearchedBookmarks] = useState([]);
    const [filterClick, setFilterClick] = useState(false);
    const [sort, setSort] = useState(false);
    const [showSortedBookmarks, setShowSortedBookmarks] = useState([]);
    const [activeButton, setActiveButton] = useState('');

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
                const favIcon = activeTab.favIconUrl;
                setFavIcon(favIcon);
                console.log("URL:", pageUrl);
                console.log("Title:", pageTitle);
                console.log('FavIcon: ', favIcon);
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
            favIcon,
            date: new Date().toLocaleString()
        }

        try{
            await addDoc(collection(db, "Bookmarks"), bookmark);
            setTitle(null);
            document.getElementById('title').value='';
            setUrl(null);
            document.getElementById('url').value='';
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

    const findBookmark = (searchString) => {
        const searchItem = searchString.toLowerCase();
        const list = bookmarks.filter((bookmark) => {
            return(
                bookmark.title?.toLowerCase().includes(searchItem) ||
                bookmark.tags?.some(tag => tag.toLowerCase().includes(searchItem))
            );
        });
        console.log("Filtered List: ", list);
        setShowSearchedBookmarks(list);
        setShowSearchResult(true);
    };

    function bookmarkSort(e){
        const list = [...bookmarks];
        const buttonType = e.currentTarget.id;
        console.log("Button clicked: ", buttonType);

        if(buttonType === 'A-Z'){
            setActiveButton('A-Z');
            list.sort((a, b) => 
                a.title.toLowerCase().localeCompare(b.title.toLowerCase())
            );
        }

        else if(buttonType === 'Z-A'){
            setActiveButton('Z-A');
            list.sort((a, b) => 
                b.title.toLowerCase().localeCompare(a.title.toLowerCase())
            );
        }

        else if(buttonType === 'byDate'){
            setActiveButton('byDate');
            list.sort((a, b) => 
                new Date(a.date) - new Date(b.date)
            );
        }

        console.log('The sorted list is: ', list);
        setShowSortedBookmarks(list);
        setSort(true);
    }
    
      
  return (
    <div className='flex flex-col items-center w-[347px] h-auto max-h-[608px] bg-[#FFFBEF] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] overflow-hidden'>
        <div id='header' className='flex flex-row justify-around items-center bg-[#5591D7] w-[347px] min-h-[41px]'>
            <h1 className='flex text-[16px] font-semibold tracking-[1px] text-white'>
                <img src={bookmarkIcon} alt='bookmark-icon' className='h-[20px] mr-[2px]'/>
                Quickmark Bookmark Manager
            </h1>
            <button onClick={() => window.close()}>
                <img src={cancelIcon} alt='close-window' className='h-[24px]'/>
            </button>
        </div>
        <div id='body' className='max-h-[520px]'>
            <div className='w-full flex justify-start'>
                <button className='flex items-center gap-1 mt-2' 
                onClick={() => {
                    const newState = !saveClicked;
                    chrome.storage.local.set({ dropDown: newState }, () => {
                        console.log('Dropdown state saved:', newState);
                        chrome.storage.local.get('dropDown', (result) => {
                            console.log('Retrieved dropdown state:', result.dropDown);
                            setSaveClicked(result.dropDown);
                        });
                    });
                }}>
                    <span className='text-[16px] font-normal tracking-[1px] border-transparent border-b-2 hover:border-black'>Save a Bookmark</span>
                    {saveClicked? <img src={arrowDown} className='h-[16px] mb-[3px]'/> : <img src={arrowUp} className='h-[16px] mb-[3px]'/>}
                </button>
            </div>
            {saveClicked && 
                <div className='mb-2 flex flex-col items-center p-2 w-[320px] bg-[white] rounded-lg shadow-sm border-[#f0f0f0] border-[1px]'>
                    <div className='flex flex-col items-center justify-around gap-1 p-2 w-full'>
                        <div className='flex flex-col items-start'>
                            <label htmlFor='title' className='flex gap-1 items-center mb-1 text-end font-normal text-[16px] tracking-widest'>
                                <img src={titleIcon} alt="Enter title"/>
                                Title
                            </label>
                            <input 
                            type='text'
                            id='title'
                            value={title}
                            placeholder='Quickmark Bookmark Manager'
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
                            type='text'
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
                            type='text'
                            id='tags'
                            placeholder='Tech, AI, Software development'
                            className='rounded w-[265px] border-[#aeaeaee0] border-[2px] p-2 bg-[#fefefe] text-[#5d5d5d] font-normal font-kufam text-[13px] tracking-[1px] outline-none'
                            onChange={(e) => {
                                const input = e.target.value;
                                const tagList = input.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                                setTags(tagList);
                            }}
                            />
                        </div>
                        <button onClick={handleSave} className='w-[225px] mt-[15px] bg-[#5591D7] py-[4px] px-4 rounded-lg border-[1px] border-white text-white font-kufam font-normal text-[14px] leading-[25px] hover:bg-[#3f85d5] transition-colors shadow-sm'>
                            Save Bookmark
                        </button>
                    </div>
                </div> 
            }
            <div className={`pb-3 mt-1 ${saveClicked ? 'max-h-[174px]' : 'max-h-[484px]'}`}>
                <div className='flex flex-col p-2 w-[320px] bg-[white] rounded-lg shadow-sm border-[#f0f0f0] border-[1px]'>
                    <div className='flex justify-between items-center min-h-[28px]'>
                        {showSearch && !filterClick ? (
                            <input
                                className='w-full rounded-md py-1 px-2 border-1 border-[#e0e0e0] bg-[#f2f1f1] transition-all duration-300 outline-none'
                                type='text'
                                placeholder='Find bookmark by name or tags...'
                                onChange={(e) => findBookmark(e.target.value)}
                            />
                            ): filterClick && !showSearch ? (
                                <div className='flex items-center justify-between w-full gap-1'>
                                    <div className='flex justify-around w-full gap-2 p-1 rounded-md bg-[#f2f1f1]'>
                                        <button id='A-Z' onClick={bookmarkSort} className={`flex gap-0.5 items-center bg-white p-1 rounded-md transition-all duration-200 hover:bg-[#dcdcdc] ${activeButton==='A-Z' ? 'bg-[#dcdcdc]' : ''}`}>
                                            <img src={sort_desc} alt='sort by A-Z' className='h-[24px]'/>
                                            <span>Sort A-Z</span>
                                        </button>
                                        <button id='Z-A' onClick={bookmarkSort} className={`flex gap-0.5 items-center bg-white p-1 rounded-md transition-all duration-200 hover:bg-[#dcdcdc] ${activeButton==='Z-A' ? 'bg-[#dcdcdc]' : ''}`}>
                                            <img src={sort_asc} alt='sort by Z-A' className='h-[24px]'/>
                                            <span>Sort Z-A</span>
                                        </button>
                                        <button id='byDate' onClick={bookmarkSort} className={`flex gap-0.5 items-center bg-white p-1 rounded-md transition-all duration-200 hover:bg-[#dcdcdc] ${activeButton==='byDate' ? 'bg-[#dcdcdc]' : ''}`}>
                                            <img src={calendar} alt='sort by date added' className='h-[24px]'/>
                                            <span>Sort by first added</span>
                                        </button>
                                    </div>
                                    <button onClick={() => { setFilterClick(false); setSort(false); setShowSortedBookmarks([]); setActiveButton('') }} className='transition-all duration-200 hover:bg-[#f1f1f1] rounded-md p-1'>
                                        <span>Clear filter</span>
                                    </button>
                                </div>
                            ) : (
                                <div className='flex flex-row items-start gap-2'>
                                    <img src={savedIcon} alt="Saved bookmarks"/>
                                    <span className='font-normal text-[16px] tracking-widest'>Saved Bookmarks</span>
                                </div>
                            )
                        }
                        {!showSearch && !filterClick? (
                            <div className='flex gap-1 items-start'>
                                <button onClick={() => setShowSearch(true)}>
                                    <img src={searchIcon} alt='search' className='h-[18px] transition-transform duration-200 hover:scale-110'/>
                                </button>
                                <button onClick={() => setFilterClick(true)}>
                                    <img src={slider} alt='filter' className='h-[20px] ml-[4px] transition-transform duration-200 hover:scale-110'/>
                                </button>
                            </div>
                            ) : !filterClick && (
                            <button onClick={() =>{ setShowSearch(false); setShowSearchResult(false); setShowSearchedBookmarks([]);}}>
                                <img src={cancel} alt='cancel' className='h-[20px] ml-[4px] transition-transform duration-200 hover:scale-110'/>
                            </button>
                            )
                        }
                    </div><hr className='mt-[2px] ml-[-9px] w-[320px]'/>
                    <div className={`flex flex-col items-center justify-around gap-3 p-2 w-full ${saveClicked? 'max-h-[120px]' : 'max-h-[320px]'} overflow-y-auto`}>
                    {showSearchResult ? 
                    showSearchedBookmarks.map((bookmark) => (
                        <div className='bg-white w-[290px] py-2 px-1.5 border-[rgba(0,0,0,0.14)] border-[1px] rounded-[10px] flex flex-row items-center justify-between shadow-sm'>
                            <div className='flex flex-col gap-1'>
                                <a href={bookmark.url} target='_blank' className='flex gap-1.5 items-center'>
                                    <img src={bookmark.favIcon} alt='favIcon' className='h-[16px] mb-[3px]'/>
                                    <span key={bookmark.id} className='text-[14px] w-auto max-w-[215px] truncate tracking-wider font-semibold' title={bookmark.title}>
                                        {bookmark.title}    
                                    </span>
                                    <img src={gotoIcon} alt='external link' className='h-[12px] transition-all hover:scale-110 duration-200 mb-[3px]'/>
                                </a>    
                                <span key={bookmark.id} className='flex gap-1 text-[12px] tracking-[4%]'><span className='font-semibold'>Tags: </span>{bookmark.tags ? bookmark.tags.join(", ") : ""}</span>  
                            </div>
                            <button onClick={() => removeBookmark(bookmark.id)} className='cursor-pointer'>
                                <img src={deleteIcon} alt='bookmark Icon' className='h-[16px] transition-transform duration-200 hover:scale-125'/>
                            </button>
                        </div>
                    ))
                    : sort ? showSortedBookmarks.map((bookmark) => (
                        <div className='bg-white w-[290px] py-2 px-1.5 border-[rgba(0,0,0,0.14)] border-[1px] rounded-[10px] flex flex-row items-center justify-between shadow-sm'>
                            <div className='flex flex-col gap-1'>
                                <a href={bookmark.url} target='_blank' className='flex gap-1.5 items-center'>
                                    <img src={bookmark.favIcon} alt='favIcon' className='h-[16px] mb-[3px]'/>
                                    <span key={bookmark.id} className='text-[14px] w-auto max-w-[215px] truncate tracking-wider font-semibold' title={bookmark.title}>
                                        {bookmark.title}    
                                    </span>
                                    <img src={gotoIcon} alt='external link' className='h-[12px] transition-all hover:scale-110 duration-200 mb-[3px]'/>
                                </a>    
                                <span key={bookmark.id} className='flex gap-1 text-[12px] tracking-[4%]'><span className='font-semibold'>Tags: </span>{bookmark.tags ? bookmark.tags.join(", ") : ""}</span>  
                            </div>
                            <button onClick={() => removeBookmark(bookmark.id)} className='cursor-pointer'>
                                <img src={deleteIcon} alt='bookmark Icon' className='h-[16px] transition-transform duration-200 hover:scale-125'/>
                            </button>
                        </div>
                    )) :
                    bookmarks.sort((a, b) => 
                        new Date(b.date) - new Date(a.date)
                    ).map((bookmark) => (
                        <div className='bg-white w-[290px] py-2 px-1.5 border-[rgba(0,0,0,0.14)] border-[1px] rounded-[10px] flex flex-row items-center justify-between shadow-sm'>
                            <div className='flex flex-col gap-1'>
                                <a href={bookmark.url} target='_blank' className='flex gap-1.5 items-center'>
                                    <img src={bookmark.favIcon} alt='favIcon' className='h-[16px] mb-[3px]'/>
                                    <span key={bookmark.id} className='text-[14px] w-auto max-w-[215px] truncate tracking-wider font-semibold' title={bookmark.title}>
                                        {bookmark.title}    
                                    </span>
                                    <img src={gotoIcon} alt='external link' className='h-[12px] transition-all hover:scale-110 duration-200 mb-[3px]'/>
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
        </div>    
        <div id='footer' className='flex flex-row p-4 justify-between items-center bg-[#5591D7] w-[347px] max-h-[41px]'>
            <div className='flex gap-1 items-start'>
                <button className='cursor-not-allowed'>
                    <img src={settingsIcon} alt='bookmark-icon' className='h-[20px] mr-[2px] transition-tranform hover:scale-110 duration-200'/>
                </button>
                <span className='text-[16px] font-normal tracking-[1px] text-white'>Settings</span>
            </div>
            <div className='flex gap-1 cursor-pointer items-start' onClick={handleLogout}>
                <button>
                    <img src={logoutIcon} alt='bookmark-icon' className='h-[20px] mr-[2px] transition-all hover:scale-110 duration-200'/>
                </button>
                <span className='pb-[1px] text-[16px] font-normal tracking-[1px] text-white border-b-2 border-transparent hover:border-white'>Logout</span>
            </div>
        </div>    
    </div>
  )
}

export default Bookmark