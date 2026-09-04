import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Truck, Wallet } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { img } from "../data/products";
import { useStore } from "../context/StoreContext";

const PAYMENT_METHODS = [
  { id: "cod", name: "Cash on Delivery", desc: "Pay in cash when your order arrives.", icon: Truck },
  { id: "bkash", name: "bKash", desc: "Send Money to our bKash number, then enter the Transaction ID.", icon: Wallet },
  { id: "nagad", name: "Nagad", desc: "Send Money to our Nagad number, then enter the Transaction ID.", icon: Wallet },
];

export default function Checkout() {
  const { dark, cart, subtotal, user, checkout } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    line1: user?.address?.line1 || "",
    line2: user?.address?.line2 || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zip: user?.address?.zip || "",
    country: user?.address?.country || "Bangladesh",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paymentRef, setPaymentRef] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  if (!user) return <Navigate to="/account?next=/checkout" replace />;
  if (cart.length === 0 && !order) return <Navigate to="/shop" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.fullName.trim() || !form.phone.trim() || !form.line1.trim() || !form.city.trim()) {
      setError("Please fill in your name, phone, address and city.");
      return;
    }
    if (paymentMethod !== "cod" && !paymentRef.trim()) {
      setError(`Please enter your ${paymentMethod === "bkash" ? "bKash" : "Nagad"} transaction ID.`);
      return;
    }
    setPlacing(true);
    try {
      const placed = await checkout(form, paymentMethod, paymentRef.trim());
      setOrder(placed);
    } catch (e) {
      setError(e.message);
    } finally {
      setPlacing(false);
    }
  };

  if (order) {
    return (
      <PageTransition>
        <main className="px-6 py-24 max-w-lg mx-auto text-center">
          <CheckCircle2 size={40} className="mx-auto mb-4 text-emerald-600" />
          <h1 className="font-display italic text-3xl font-bold mb-2">Order placed.</h1>
          <p className="text-sm opacity-60 mb-6">
            Thank you, {form.fullName.split(" ")[0]}. Your order total is <span className="font-mono font-semibold">${order.total.toFixed(2)}</span>, to be paid via{" "}
            {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod === "bkash" ? "bKash" : "Nagad"}.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/account" className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase bg-black text-white">
              View order history
            </Link>
            <Link to="/shop" className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase border border-current/15">
              Keep shopping
            </Link>
          </div>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="px-6 pt-10 pb-24">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-[1fr_360px] gap-10">
          <div>
            <p className="section-kicker">ARTCANVAS / CHECKOUT</p>
            <h1 className="font-display italic text-3xl font-bold mb-6">Shipping & payment</h1>

            <form onSubmit={submit} className="space-y-6">
              <div>
                <h3 className="text-xs tracking-widest uppercase opacity-50 mb-3">Deliver to</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 text-xs sm:col-span-2">
                    <span className="opacity-60">Full name</span>
                    <input value={form.fullName} onChange={set("fullName")} required className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="opacity-60">Phone</span>
                    <input value={form.phone} onChange={set("phone")} required className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder="01XXXXXXXXX" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="opacity-60">Country</span>
                    <input value={form.country} onChange={set("country")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs sm:col-span-2">
                    <span className="opacity-60">Address line 1</span>
                    <input value={form.line1} onChange={set("line1")} required className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder="House, road, area" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs sm:col-span-2">
                    <span className="opacity-60">Address line 2 (optional)</span>
                    <input value={form.line2} onChange={set("line2")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="opacity-60">City</span>
                    <input value={form.city} onChange={set("city")} required className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="opacity-60">District / State</span>
                    <input value={form.state} onChange={set("state")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="opacity-60">ZIP / Postal code</span>
                    <input value={form.zip} onChange={set("zip")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" />
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-xs tracking-widest uppercase opacity-50 mb-3">Payment method</h3>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((m) => {
                    const Icon = m.icon;
                    return (
                      <label
                        key={m.id}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                          paymentMethod === m.id ? (dark ? "border-[#EDE7D9] bg-white/5" : "border-black bg-black/5") : "border-current/15"
                        }`}
                      >
                        <input type="radio" name="paymentMethod" value={m.id} checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} className="mt-1" />
                        <Icon size={16} className="mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-xs opacity-60">{m.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {paymentMethod !== "cod" && (
                  <label className="flex flex-col gap-1 text-xs mt-3">
                    <span className="opacity-60">{paymentMethod === "bkash" ? "bKash" : "Nagad"} transaction ID</span>
                    <input value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} required className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder="e.g. 8N7A6QZK2L" />
                  </label>
                )}
              </div>

              {error && <p className="text-xs text-[#A8431E]">{error}</p>}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={placing}
                className={`w-full h-12 rounded-full text-xs tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-2 disabled:opacity-50 ${dark ? "bg-[#EDE7D9] text-black" : "bg-black text-white"}`}
              >
                {placing && <Loader2 size={14} className="animate-spin" />}
                {placing ? "Placing order…" : `Place order — $${subtotal.toFixed(2)}`}
              </motion.button>
            </form>
          </div>

          <aside className="border border-current/10 rounded-2xl p-5 h-fit">
            <h3 className="text-xs tracking-widest uppercase opacity-50 mb-4">Order summary</h3>
            <div className="space-y-3 mb-4">
              {cart.map((i) => (
                <div key={i.id} className="flex gap-3">
                  <img src={i.image || img(i.seed, 100, 130)} alt={i.name} className="w-12 h-14 object-cover rounded-md shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{i.name}</p>
                    <p className="text-xs opacity-50">Qty {i.qty}</p>
                  </div>
                  <span className="font-mono text-sm">${(i.price * i.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm pt-3 border-t border-current/10 font-semibold">
              <span>Subtotal</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-[11px] opacity-50 mt-2">Shipping cost is arranged with you directly after the order is placed.</p>
          </aside>
        </div>
      </main>
    </PageTransition>
  );
}
