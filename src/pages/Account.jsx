import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Lock, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useStore } from "../context/StoreContext";

export default function Account() {
  const { dark } = useStore();
  const [mode, setMode] = useState("signin");
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 2800); };

  return (
    <PageTransition>
      <main className="min-h-[78vh] px-5 sm:px-8 py-14 sm:py-20 flex items-center">
        <div className="max-w-6xl w-full mx-auto grid lg:grid-cols-[1.05fr_.95fr] gap-12 lg:gap-24 items-center">
          <section>
            <p className="text-[9px] tracking-[0.28em] uppercase opacity-50 mb-5">ArtCanvas / Member space</p>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-.055em] leading-[.88]">
              Your pieces.<br/><span className="italic font-serif font-medium">Your point of view.</span>
            </h1>
            <p className="max-w-md mt-7 text-sm sm:text-base opacity-60 leading-relaxed">Save pieces, follow new collections and keep your ArtCanvas orders in one quiet place.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 mt-8 text-xs uppercase tracking-[.2em] font-semibold border-b border-current pb-2">Explore the collection <ArrowUpRight size={14}/></Link>
          </section>

          <motion.section layout className={`border ${dark ? "border-white/10 bg-white/[.03]" : "border-black/10 bg-white"} p-6 sm:p-8 rounded-[28px] shadow-sm`}>
            <div className={`flex border-b ${dark ? "border-white/10" : "border-black/10"} mb-7`}>
              <button onClick={() => setMode("signin")} className={`flex-1 pb-4 text-xs uppercase tracking-[.18em] ${mode === "signin" ? "font-bold border-b-2" : "opacity-45"}`}>Sign in</button>
              <button onClick={() => setMode("signup")} className={`flex-1 pb-4 text-xs uppercase tracking-[.18em] ${mode === "signup" ? "font-bold border-b-2" : "opacity-45"}`}>Sign up</button>
            </div>
            <div className="mb-7">
              <p className="text-2xl font-display italic font-bold">{mode === "signin" ? "Welcome back." : "Make it yours."}</p>
              <p className="text-xs opacity-50 mt-2">{mode === "signin" ? "Enter your details to continue." : "Create an account in less than a minute."}</p>
            </div>
            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && <label className="relative block"><UserRound size={15} className="absolute left-4 top-3.5 opacity-45"/><input required placeholder="Full name" className="field pl-11" /></label>}
              <label className="relative block"><Mail size={15} className="absolute left-4 top-3.5 opacity-45"/><input required type="email" placeholder="Email address" className="field pl-11" /></label>
              <label className="relative block"><Lock size={15} className="absolute left-4 top-3.5 opacity-45"/><input required type="password" minLength={6} placeholder="Password" className="field pl-11" /></label>
              {mode === "signin" && <div className="flex justify-end"><button type="button" className="text-[10px] uppercase tracking-wider opacity-50 hover:opacity-100">Forgot password?</button></div>}
              <button className={`w-full py-3.5 rounded-full text-xs uppercase tracking-[.2em] font-bold ${dark ? "bg-[#EDE7D9] text-black" : "bg-[#171715] text-white"}`}>{mode === "signin" ? "Sign in" : "Create account"}</button>
            </form>
            {submitted && <p className="mt-4 text-xs text-center opacity-60">Demo submitted — connect your authentication service here.</p>}
            <p className="mt-6 text-[10px] text-center opacity-45">By continuing, you agree to ArtCanvas terms & privacy.</p>
          </motion.section>
        </div>
      </main>
    </PageTransition>
  );
}
