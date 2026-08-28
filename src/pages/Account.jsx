import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Lock, UserRound, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useStore } from "../context/StoreContext";

export default function Account() {
  const { dark, signIn, user, signOut } = useStore();
  const [mode,setMode]=useState("signin"); const [show,setShow]=useState(false); const [submitted,setSubmitted]=useState(false);
  const submit=e=>{e.preventDefault(); const f=new FormData(e.currentTarget); signIn({name:f.get("name")||"ArtCanvas member",email:f.get("email")}); setSubmitted(true);};
  const google=()=>{signIn({name:"Google member",email:"google.member@artcanvas.local"});setSubmitted(true);};
  return <PageTransition><main className="account-page"><div className="account-wrap">
    <section className="account-intro"><p className="section-kicker">ARTCANVAS / MEMBER SPACE</p><h1>Keep your<br/><em>point of view.</em></h1><p>Save pieces, follow new collections, track your orders and message the studio from one quiet space.</p><Link to="/shop" className="account-link">Explore the collection <ArrowUpRight size={14}/></Link></section>
    <motion.section layout className={`account-panel ${dark?"account-panel--dark":""}`}>
      {user ? <div className="account-welcome"><p className="section-kicker">MEMBER</p><h2>Welcome, {user.name}.</h2><p>You are signed in as {user.email}. Your studio messages are now unlocked.</p><Link to="/" className="account-primary">Continue exploring</Link><button onClick={signOut} className="account-secondary">Sign out</button></div> : <>
        <div className="account-tabs"><button onClick={()=>{setMode("signin");setSubmitted(false)}} className={mode==="signin"?"active":""}>Sign in</button><button onClick={()=>{setMode("signup");setSubmitted(false)}} className={mode==="signup"?"active":""}>Sign up</button></div>
        <div className="account-title"><p>{mode==="signin"?"Welcome back.":"Make it yours."}</p><span>{mode==="signin"?"Enter your details to continue.":"Create an account and join the studio."}</span></div>
        <button type="button" className="google-btn" onClick={google}><span className="google-g">G</span>Continue with Google</button><div className="account-or"><span>or continue with email</span></div>
        <form onSubmit={submit} className="account-form">
          {mode==="signup"&&<label><span>Name</span><div className="input-wrap"><UserRound size={15}/><input name="name" required placeholder="Your full name"/></div></label>}
          <label><span>Email</span><div className="input-wrap"><Mail size={15}/><input name="email" required type="email" placeholder="you@example.com"/></div></label>
          <label><span>Password</span><div className="input-wrap"><Lock size={15}/><input name="password" required minLength={6} type={show?"text":"password"} placeholder="At least 6 characters"/><button type="button" onClick={()=>setShow(v=>!v)}>{show?<EyeOff size={15}/>:<Eye size={15}/>}</button></div></label>
          {mode==="signin"&&<div className="forgot-row"><button type="button">Forgot password?</button></div>}
          <button className="account-primary" type="submit">{mode==="signin"?"Sign in":"Create account"}</button>
        </form>
        {submitted&&<div className="account-success">Demo account ready. Real authentication can be connected to Firebase, Supabase or your own backend.</div>}
        <p className="account-terms">By continuing, you agree to ArtCanvas terms & privacy.</p>
      </>}
    </motion.section>
  </div></main></PageTransition>
}
