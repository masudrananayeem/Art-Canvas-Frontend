import React, { useState } from "react";
import { MessageCircle, X, Send, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function ChatWidget(){
  const { dark, isAuthenticated, chatMessages, sendMessage } = useStore();
  const [open,setOpen]=useState(false);
  const [text,setText]=useState("");
  const navigate=useNavigate();
  const submit=(e)=>{e.preventDefault(); if(!text.trim()) return; sendMessage(text.trim()); setText("");};
  return <>
    <button className={`chat-launch ${dark?"chat-launch--dark":""}`} onClick={()=>setOpen(v=>!v)} aria-label="Open messages">
      {open?<X size={18}/>:<MessageCircle size={18}/>}<span>Message</span>
    </button>
    <AnimatePresence>
      {open && <motion.aside initial={{opacity:0,y:18,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:18,scale:.97}} className={`chat-panel ${dark?"chat-panel--dark":""}`}>
        <div className="chat-head"><div><span>ARTCANVAS / MESSAGES</span><strong>Studio chat</strong></div><button onClick={()=>setOpen(false)}><X size={16}/></button></div>
        {!isAuthenticated ? <div className="chat-locked"><div className="chat-lock-icon"><Lock size={17}/></div><strong>Sign in to message us.</strong><p>Ask about pieces, sizing, orders or anything in the studio.</p><button onClick={()=>navigate("/account")}>Sign in / Sign up</button></div> : <>
          <div className="chat-body">{chatMessages.length===0 && <div className="chat-empty"><MessageCircle size={22}/><p>Start a conversation with ArtCanvas.</p></div>}{chatMessages.map((m,i)=><div key={i} className={`chat-bubble ${m.from==="user"?"chat-bubble--user":""}`}>{m.text}<small>{m.from==="user"?"You":"Studio"}</small></div>)}</div>
          <form className="chat-form" onSubmit={submit}><input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a message…"/><button aria-label="Send"><Send size={16}/></button></form>
        </>}
      </motion.aside>}
    </AnimatePresence>
  </>
}
