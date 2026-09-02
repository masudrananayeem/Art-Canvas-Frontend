import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Lock, UserRound, Eye, EyeOff, Package, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useStore } from "../context/StoreContext";
import { api } from "../lib/api";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .myOrders()
      .then((data) => !cancelled && setOrders(data))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="text-xs opacity-60 mt-6">Loading your orders…</p>;
  if (error) return <p className="text-xs opacity-60 mt-6">Couldn't load your orders: {error}</p>;
  if (orders.length === 0) return <p className="text-xs opacity-60 mt-6">You haven't placed any orders yet.</p>;

  return (
    <div className="mt-8 space-y-4">
      <p className="section-kicker">PURCHASE HISTORY</p>
      {orders.map((o) => (
        <div key={o.id} className="border border-current/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs opacity-60 mb-3">
            <span>{new Date(o.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
            <span className="capitalize">{o.status}</span>
          </div>
          <div className="space-y-1.5">
            {o.items.map((it, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="opacity-80">{it.name} × {it.qty}</span>
                <span className="font-mono">${(it.price * it.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm font-semibold mt-3 pt-3 border-t border-current/10">
            <span>Total</span>
            <span className="font-mono">${o.total.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Account() {
  const { dark, user, isAdmin, authLoading, authError, clearAuthError, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } = useStore();
  const [mode, setMode] = useState("signin");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSubmitting(true);
    if (mode === "signin") {
      await signInWithEmail(f.get("email"), f.get("password"));
    } else {
      await signUpWithEmail(f.get("name"), f.get("email"), f.get("password"));
    }
    setSubmitting(false);
  };

  const google = async () => {
    setSubmitting(true);
    await signInWithGoogle();
    setSubmitting(false);
  };

  return (
    <PageTransition>
      <main className="account-page">
        <div className="account-wrap">
          <section className="account-intro">
            <p className="section-kicker">ARTCANVAS / MEMBER SPACE</p>
            <h1>
              Keep your
              <br />
              <em>point of view.</em>
            </h1>
            <p>Save pieces, follow new collections, track your orders and message the studio from one quiet space.</p>
            <Link to="/shop" className="account-link">
              Explore the collection <ArrowUpRight size={14} />
            </Link>
          </section>

          <motion.section layout className={`account-panel ${dark ? "account-panel--dark" : ""}`}>
            {authLoading ? (
              <p className="text-sm opacity-60">Loading…</p>
            ) : user ? (
              <div className="account-welcome">
                <p className="section-kicker">MEMBER</p>
                <h2>Welcome, {user.name}.</h2>
                <p>You are signed in as {user.email}.</p>
                {isAdmin && (
                  <Link to="/admin" className="account-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                    <ShieldCheck size={14} /> Go to admin dashboard
                  </Link>
                )}
                <Link to="/" className="account-primary">
                  Continue exploring
                </Link>
                <button onClick={signOut} className="account-secondary">
                  Sign out
                </button>
                <OrderHistory />
              </div>
            ) : (
              <>
                <div className="account-tabs">
                  <button
                    onClick={() => {
                      setMode("signin");
                      clearAuthError();
                    }}
                    className={mode === "signin" ? "active" : ""}
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      setMode("signup");
                      clearAuthError();
                    }}
                    className={mode === "signup" ? "active" : ""}
                  >
                    Sign up
                  </button>
                </div>
                <div className="account-title">
                  <p>{mode === "signin" ? "Welcome back." : "Make it yours."}</p>
                  <span>{mode === "signin" ? "Enter your details to continue." : "Create an account and join the studio."}</span>
                </div>
                <button type="button" className="google-btn" onClick={google} disabled={submitting}>
                  <span className="google-g">G</span>Continue with Google
                </button>
                <div className="account-or">
                  <span>or continue with email</span>
                </div>
                <form onSubmit={submit} className="account-form">
                  {mode === "signup" && (
                    <label>
                      <span>Name</span>
                      <div className="input-wrap">
                        <UserRound size={15} />
                        <input name="name" required placeholder="Your full name" />
                      </div>
                    </label>
                  )}
                  <label>
                    <span>Email</span>
                    <div className="input-wrap">
                      <Mail size={15} />
                      <input name="email" required type="email" placeholder="you@example.com" />
                    </div>
                  </label>
                  <label>
                    <span>Password</span>
                    <div className="input-wrap">
                      <Lock size={15} />
                      <input name="password" required minLength={6} type={show ? "text" : "password"} placeholder="At least 6 characters" />
                      <button type="button" onClick={() => setShow((v) => !v)}>
                        {show ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </label>
                  <button className="account-primary" type="submit" disabled={submitting}>
                    {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                  </button>
                </form>
                {authError && <div className="account-success" style={{ color: "#A8431E" }}>{authError}</div>}
                <p className="account-terms">By continuing, you agree to ArtCanvas terms & privacy.</p>
              </>
            )}
          </motion.section>
        </div>
      </main>
    </PageTransition>
  );
}
