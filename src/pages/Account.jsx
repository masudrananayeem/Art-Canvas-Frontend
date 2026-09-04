import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Lock, UserRound, Eye, EyeOff, ShieldCheck, Camera, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useStore } from "../context/StoreContext";
import { api, uploadProfileImage } from "../lib/api";

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
            <span className="capitalize">{o.status} · {o.paymentMethod === "cod" ? "Cash on delivery" : o.paymentMethod === "bkash" ? "bKash" : o.paymentMethod === "nagad" ? "Nagad" : ""}</span>
          </div>
          <div className="space-y-1.5">
            {o.items.map((it, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="opacity-80">{it.name} × {it.qty}</span>
                <span className="font-mono">${(it.price * it.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          {o.shipping && (
            <p className="text-xs opacity-50 mt-2">
              Shipped to: {o.shipping.fullName}, {o.shipping.line1}{o.shipping.city ? `, ${o.shipping.city}` : ""}
            </p>
          )}
          <div className="flex items-center justify-between text-sm font-semibold mt-3 pt-3 border-t border-current/10">
            <span>Total</span>
            <span className="font-mono">${o.total.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileEditor() {
  const { user, updateMyProfile } = useStore();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    line1: user?.address?.line1 || "",
    line2: user?.address?.line2 || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zip: user?.address?.zip || "",
    country: user?.address?.country || "Bangladesh",
  });
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [synced, setSynced] = useState(false);

  // Profile fields load asynchronously right after sign-in, so the form may
  // mount before they arrive — sync once when they do (but only once, so we
  // don't clobber text the person is actively editing).
  useEffect(() => {
    if (synced || !user) return;
    if (user.name || user.phone || user.address || user.photoURL) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        line1: user.address?.line1 || "",
        line2: user.address?.line2 || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zip: user.address?.zip || "",
        country: user.address?.country || "Bangladesh",
      });
      setPhotoURL(user.photoURL || "");
      setSynced(true);
    }
  }, [user, synced]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const pickPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploadingPhoto(true);
    try {
      const uploaded = await uploadProfileImage(file);
      setPhotoURL(uploaded.url);
      await updateMyProfile({ photoURL: uploaded.url });
    } catch (e) {
      setError(e.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateMyProfile({
        name: form.name,
        phone: form.phone,
        address: { fullName: form.name, phone: form.phone, line1: form.line1, line2: form.line2, city: form.city, state: form.state, zip: form.zip, country: form.country },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="mt-6 space-y-4">
      <p className="section-kicker">PROFILE</p>

      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 shrink-0">
          {photoURL ? (
            <img src={photoURL} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-current/10 flex items-center justify-center">
              <UserRound size={22} className="opacity-50" />
            </div>
          )}
          <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center cursor-pointer">
            {uploadingPhoto ? <Loader2 size={11} className="animate-spin" /> : <Camera size={11} />}
            <input type="file" accept="image/*" className="hidden" onChange={pickPhoto} disabled={uploadingPhoto} />
          </label>
        </div>
        <p className="text-xs opacity-50">Click the camera icon to change your profile photo.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs">
          <span className="opacity-60">Name</span>
          <input value={form.name} onChange={set("name")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="opacity-60">Phone</span>
          <input value={form.phone} onChange={set("phone")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder="01XXXXXXXXX" />
        </label>
        <label className="flex flex-col gap-1 text-xs sm:col-span-2">
          <span className="opacity-60">Address line 1</span>
          <input value={form.line1} onChange={set("line1")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder="House, road, area" />
        </label>
        <label className="flex flex-col gap-1 text-xs sm:col-span-2">
          <span className="opacity-60">Address line 2</span>
          <input value={form.line2} onChange={set("line2")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="opacity-60">City</span>
          <input value={form.city} onChange={set("city")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="opacity-60">District / State</span>
          <input value={form.state} onChange={set("state")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="opacity-60">ZIP / Postal code</span>
          <input value={form.zip} onChange={set("zip")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="opacity-60">Country</span>
          <input value={form.country} onChange={set("country")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" />
        </label>
      </div>

      {error && <p className="text-xs text-[#A8431E]">{error}</p>}

      <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase bg-black text-white disabled:opacity-50">
        {saving ? "Saving…" : "Save profile"}
      </button>
      {saved && <span className="text-xs text-emerald-600 ml-3">Saved.</span>}
    </form>
  );
}

export default function Account() {
  const { dark, user, isAdmin, authLoading, authError, clearAuthError, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } = useStore();
  const [mode, setMode] = useState("signin");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const next = params.get("next");

  useEffect(() => {
    if (user && next) navigate(next, { replace: true });
  }, [user, next, navigate]);

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
                <ProfileEditor />
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
