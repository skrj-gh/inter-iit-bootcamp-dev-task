import React, { useContext, useEffect, useState } from 'react'
import "./sidebar.css"
import { assets } from '../../assets/assets'
import { Context } from '../../context/context'
import axios from "axios"

const Sidebar = () => {

    const [extended, setExtended] = useState(false);
    const {onSent, prevPrompts, setRecentPrompt, newChat, email, setPrevPrompts} = useContext(Context)
    const [history, setHistory] = useState(false);

    useEffect(() => {
        const loadActivity = async () => {
            if(history){
                try{
                    // https://lazarusai.onrender.com
                    const response = await axios.get(`https://lazarusai.onrender.com/history?email=${email}`);
                    // console.log(response.data)
                    setPrevPrompts( prev => [...prev, ...response.data])
                    // prevPrompts.append(response.data)
                    // return response.data;
                }
                catch(error){
                    console.error("Eror:", error);
                    throw error;
                }
            }
        }
        loadActivity();
    }, [history]);
        
    const help = () => {
        window.location.href = 'https://ai.google.dev/gemini-api/docs/';
    }

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt)
        await onSent(prompt)
    }

  return (
    <div className='sidebar'>
        <div className="top">
            <img className='menu' src={assets.menu_icon} alt="" onClick={() => {setExtended(!extended)} } />
            <div className='new-chat' onClick={() => newChat()}>
                <img src={assets.plus_icon} alt="" />
                {extended ? <p>New Chat</p> : null}
            </div>
            {extended ? 
                <div className="recent">
                    <p className='recent-title'>Recent</p>
                    {prevPrompts.slice().reverse().map((item, index) => {
                        return (
                            <div key={index} onClick={() => loadPrompt(item)} className='recent-entry'>
                                <img src={assets.message_icon} alt="" />
                                <p>{item.slice(0,18)}...</p>
                            </div>
                        );
                    })}
                </div>
            : null
            }
        </div>
        <div className="bottom">
            <div className="bottom-item recent-entry" onClick={() => help()}>
                <img src={assets.question_icon} alt="" />
                {extended ? <p>Help</p> : null}
            </div>
            <div className="bottom-item recent-entry" onClick={() => setHistory(true)}>
                <img src={assets.history_icon} alt="" />
                {extended ? <p>Activity</p> : null}
            </div>
            <div className="bottom-item recent-entry">
                <img src={assets.setting_icon} alt="" />
                {extended ? <p>Settings</p> : null}
            </div>
        </div>
    </div>
  )
}


export default Sidebar