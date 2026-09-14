import React, { useEffect, useState } from "react";
import { ChevronDown, Loader2, Trash2 } from "lucide-react";
import { api } from "../../lib/api";

const STATUSES = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");
  const [deleting, setDeleting] = useState("");
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setError("");
    try {
      const data = await api.allOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      setOrders([]);
      setError(e.message || "Could not load orders.");
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await api.allOrders();
        if (alive) setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) { setOrders([]); setError(e.message || "Could not load orders."); }
      }
    })();
    return () => { alive = false; };
  }, []);

  const updateStatus = async (order, status) => {
    if (status === order.status) return;
    if (status === "cancelled" && !confirm(`Cancel order ${order.id}? Stock will be restored.`)) return;
    setUpdating(order.id);
    setError("");
    try {
      const saved = await api.updateOrderStatus(order.id, status);
      setOrders((current) => (current || []).map((item) => item.id === order.id ? saved : item));
    } catch (e) {
      setError(e.message || "Could not update order.");
    } finally {
      setUpdating("");
    }
  };

  const remove = async (order) => {
    if (!["delivered", "cancelled"].includes(order.status)) return;
    if (!confirm(`Delete order #${order.id}? This cannot be undone.`)) return;
    setDeleting(order.id);
    try {
      await api.deleteOrder(order.id);
      setOrders((current) => (current || []).filter((item) => item.id !== order.id));
      if (expanded === order.id) setExpanded(null);
    } catch (e) {
      setError(e.message || "Could not delete order.");
    } finally {
      setDeleting("");
    }
  };

  if (orders === null) return <p className="text-xs opacity-60 mt-6">Loading orders…</p>;

  return (
    <div className="mt-2 space-y-4">
      <div className="flex items-center justify-between">
        <div><h3 className="font-display italic text-lg font-bold">Orders</h3><p className="text-xs opacity-50">{orders.length} order{orders.length === 1 ? "" : "s"}</p></div>
        <button type="button" onClick={load} className="px-3 py-1.5 rounded-full border border-current/15 text-[10px] font-semibold uppercase">Refresh</button>
      </div>
      {error && <p className="text-xs text-[#A8431E] border border-[#A8431E]/20 rounded-lg px-3 py-2">{error}</p>}
      {orders.length === 0 ? <p className="text-xs opacity-60">No orders placed yet.</p> : orders.map((order) => {
        const status = STATUSES.includes(order.status) ? order.status : "placed";
        const address = order.shipping || {};
        const isOpen = expanded === order.id;
        return (
          <article key={order.id} className="border border-current/10 rounded-2xl p-4 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><p className="font-mono text-xs font-semibold">#{order.id}</p><p className="text-xs opacity-55 mt-1 truncate">{order.email || "Customer email unavailable"}</p><p className="text-xs opacity-50 mt-1">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}</p></div>
              <div className="text-right"><p className="font-mono font-semibold">${Number(order.total || 0).toFixed(2)}</p><p className="text-[10px] uppercase opacity-50 mt-1">{order.paymentMethod || "payment"}{order.paymentRef ? ` · ${order.paymentRef}` : ""}</p></div>
            </div>

            <div className="mt-4 rounded-xl bg-current/[.025] border border-current/5 p-3">
              <div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="font-semibold text-sm truncate">{address.fullName || order.customerName || "Customer"}</p><p className="text-xs opacity-55 truncate">{address.phone || order.phone || "Phone unavailable"}</p></div><button type="button" onClick={() => setExpanded(isOpen ? null : order.id)} className="flex items-center gap-1 text-[10px] uppercase opacity-60 hover:opacity-100">Details <ChevronDown size={12} className={isOpen ? "rotate-180" : ""}/></button></div>
              <p className="text-xs opacity-55 mt-2">{address.line1 || "Address unavailable"}{address.city ? `, ${address.city}` : ""}</p>
            </div>

            <div className="mt-4 space-y-1.5">
              {(order.items || []).map((item, i) => <div key={`${order.id}-${i}`} className="flex justify-between gap-3 text-xs"><span>{item?.name || "Item"} × {Number(item?.qty || 0)}</span><span className="font-mono">${(Number(item?.price || 0) * Number(item?.qty || 0)).toFixed(2)}</span></div>)}
            </div>

            {isOpen && <div className="mt-4 pt-4 border-t border-current/10 grid sm:grid-cols-2 gap-4 text-xs">
              <div><p className="uppercase tracking-widest opacity-40 mb-1">Full delivery address</p><p>{address.fullName || "—"}</p><p className="opacity-60">{address.line1 || "—"}</p>{address.line2 && <p className="opacity-60">{address.line2}</p>}<p className="opacity-60">{[address.city, address.state, address.zip, address.country].filter(Boolean).join(", ") || "—"}</p><p className="opacity-60 mt-1">{address.phone || order.phone || "—"}</p></div>
              <div><p className="uppercase tracking-widest opacity-40 mb-1">Customer & payment</p><p>{order.email || "—"}</p><p className="opacity-60 capitalize">{order.paymentMethod === "cod" ? "Cash on delivery" : order.paymentMethod || "—"}</p>{order.paymentRef && <p className="opacity-60">Transaction ID: {order.paymentRef}</p>}<p className="font-semibold mt-2">Status: {status}</p></div>
              <div className="sm:col-span-2"><p className="uppercase tracking-widest opacity-40 mb-2">Status history</p><div className="space-y-1.5">{(order.statusHistory || [{status: order.status, at: order.createdAt}]).map((h,i)=><div key={`${h.status}-${i}`} className="flex justify-between gap-3"><span className="capitalize">{h.status}</span><span className="opacity-45">{h.at ? new Date(h.at).toLocaleString() : "—"}</span></div>)}</div></div>
            </div>}

            <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-current/10 flex-wrap"><span className="text-[10px] uppercase opacity-45">Update order status</span><div className="flex gap-2"><select value={status} disabled={updating === order.id || deleting === order.id} onChange={(e) => updateStatus(order, e.target.value)} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-xs capitalize">{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>{["delivered", "cancelled"].includes(status) && <button type="button" onClick={() => remove(order)} disabled={deleting === order.id} title="Delete order" className="w-9 h-9 rounded-lg border border-[#A8431E]/25 text-[#A8431E] flex items-center justify-center">{deleting === order.id ? <Loader2 size={13} className="animate-spin"/> : <Trash2 size={13}/>}</button>}</div></div>
          </article>
        );
      })}
    </div>
  );
}
