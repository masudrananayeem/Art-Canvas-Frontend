import React, { useEffect, useRef, useState } from "react";
import { Trash2, Plus, ImagePlus, Loader2, PackageCheck, PackageX, ShoppingBag, Star, Home as HomeIcon, LayoutGrid, Tag, Users, MessageCircle, Send, Flame } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { GENDERS } from "../data/products";
import { useStore } from "../context/StoreContext";
import { api, uploadAdminImage } from "../lib/api";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "clothing",
  gender: "all",
  subcategory: "",
  stock: "",
  isFeatured: false,
};

function AddProductForm({ onCreated }) {
  const { categories, subcategories } = useStore();
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const pickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image is larger than 8MB — please pick a smaller file.");
      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.price) {
      setError("Name and price are required.");
      return;
    }
    setSaving(true);
    try {
      let image = "";
      let imagePublicId = "";
      if (imageFile) {
        const uploaded = await uploadAdminImage(imageFile, "product");
        image = uploaded.url;
        imagePublicId = uploaded.publicId;
      }
      await api.createProduct({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        gender: form.category === "clothing" ? form.gender : "all",
        subcategory: form.subcategory.trim(),
        stock: Number(form.stock) || 0,
        image,
        imagePublicId,
        isFeatured: form.isFeatured,
      });
      setForm(EMPTY_FORM);
      setImageFile(null);
      setImagePreview(null);
      onCreated();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const clothingSubOptions = form.category === "clothing" && form.gender !== "all" ? subcategories[form.gender] || [] : [];
  const isClothing = form.category === "clothing";

  return (
    <form onSubmit={submit} className="border border-current/10 rounded-2xl p-5 space-y-4">
      <h3 className="font-display italic text-lg font-bold">Add a new product</h3>
      <p className="text-xs opacity-50 -mt-2">Works for clothing, art, objects, accessories or gifts — pick a category below.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-xs">
          <span className="opacity-60">Name</span>
          <input value={form.name} onChange={set("name")} required className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder="Fragment Overcoat" />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="opacity-60">Price (USD)</span>
          <input value={form.price} onChange={set("price")} required type="number" min="0" step="0.01" className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder="120.00" />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="opacity-60">Category</span>
          <select value={form.category} onChange={set("category")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        {isClothing && (
          <label className="flex flex-col gap-1 text-xs">
            <span className="opacity-60">Gender</span>
            <select value={form.gender} onChange={set("gender")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm">
              {GENDERS.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </label>
        )}
        {isClothing && clothingSubOptions.length > 0 ? (
          <label className="flex flex-col gap-1 text-xs">
            <span className="opacity-60">Subcategory</span>
            <select value={form.subcategory} onChange={set("subcategory")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm">
              <option value="">—</option>
              {clothingSubOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        ) : !isClothing ? (
          <label className="flex flex-col gap-1 text-xs">
            <span className="opacity-60">{form.category === "art" ? "Medium / style" : "Subcategory"}</span>
            <input
              value={form.subcategory}
              onChange={set("subcategory")}
              className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm"
              placeholder={form.category === "art" ? "Oil on canvas, Print, Sculpture…" : "e.g. Ceramics"}
            />
          </label>
        ) : null}
        <label className="flex flex-col gap-1 text-xs">
          <span className="opacity-60">Stock quantity</span>
          <input value={form.stock} onChange={set("stock")} type="number" min="0" step="1" className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder="0" />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs">
        <span className="opacity-60">Description</span>
        <textarea value={form.description} onChange={set("description")} rows={3} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder="Short product description" />
      </label>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <label className="flex items-center gap-3 text-xs">
          <span className="opacity-60">Image</span>
          <div className="flex items-center gap-3">
            {imagePreview ? (
              <img src={imagePreview} alt="" className="w-14 h-14 object-cover rounded-lg" />
            ) : (
              <div className="w-14 h-14 rounded-lg border border-dashed border-current/25 flex items-center justify-center opacity-40">
                <ImagePlus size={18} />
              </div>
            )}
            <input type="file" accept="image/*" onChange={pickImage} className="text-xs" />
          </div>
        </label>

        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} />
          <Star size={13} /> Feature on homepage
        </label>
      </div>

      {error && <p className="text-xs text-[#A8431E]">{error}</p>}

      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-black text-white disabled:opacity-50">
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        {saving ? "Saving…" : "Add product"}
      </button>
    </form>
  );
}

function ProductRow({ p, onChanged }) {
  const [stock, setStock] = useState(p.stock ?? 0);
  const [price, setPrice] = useState(p.price);
  const [featured, setFeatured] = useState(!!p.isFeatured);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.updateProduct(p.id, { stock: Number(stock), price: Number(price), isFeatured: featured });
      onChanged();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatured = async () => {
    const next = !featured;
    setFeatured(next);
    try {
      await api.updateProduct(p.id, { isFeatured: next });
      onChanged();
    } catch (e) {
      alert(e.message);
      setFeatured(!next);
    }
  };

  const remove = async () => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await api.deleteProduct(p.id);
      onChanged();
    } catch (e) {
      alert(e.message);
    }
  };

  const dirty = Number(stock) !== p.stock || Number(price) !== p.price;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-current/10 text-sm flex-wrap">
      <img src={p.image || "https://picsum.photos/seed/" + p.seed + "/80/100"} alt="" className="w-10 h-12 object-cover rounded-md shrink-0" />
      <div className="flex-1 min-w-[120px]">
        <p className="font-medium truncate">{p.name}</p>
        <p className="text-xs opacity-50 capitalize">{p.category}{p.subcategory ? ` · ${p.subcategory}` : ""}</p>
      </div>
      {p.sold > 0 && (
        <span className="hidden sm:flex items-center gap-1 text-[10px] opacity-55 shrink-0" title="Units sold">
          <Flame size={12} /> {p.sold} sold
        </span>
      )}
      <div className="flex items-center gap-1 text-xs">
        <span className="opacity-50">$</span>
        <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" step="0.01" className="w-20 px-2 py-1 rounded-md border border-current/15 bg-transparent" />
      </div>
      <div className="flex items-center gap-1 text-xs">
        <span className="opacity-50">Stock</span>
        <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" min="0" step="1" className="w-16 px-2 py-1 rounded-md border border-current/15 bg-transparent" />
      </div>
      {p.stock > 0 ? <PackageCheck size={16} className="text-emerald-600 shrink-0" /> : <PackageX size={16} className="text-[#A8431E] shrink-0" />}
      <button onClick={toggleFeatured} aria-label="Toggle featured on homepage" className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${featured ? "border-amber-500 text-amber-500" : "border-current/15 opacity-50"}`}>
        <Star size={14} fill={featured ? "currentColor" : "none"} />
      </button>
      {dirty && (
        <button onClick={save} disabled={saving} className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase bg-black text-white disabled:opacity-50">
          {saving ? "…" : "Save"}
        </button>
      )}
      <button onClick={remove} aria-label="Delete product" className="w-8 h-8 rounded-full flex items-center justify-center border border-current/15 shrink-0">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

const ORDER_STATUSES = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"];

function OrdersPanel() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");
  const [deleting, setDeleting] = useState("");

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
        if (alive) {
          setOrders([]);
          setError(e.message || "Could not load orders.");
        }
      }
    })();
    return () => { alive = false; };
  }, []);

  const removeOrder = async (order) => {
    if (!["delivered", "cancelled"].includes(order.status)) return;
    if (!confirm(`Delete order #${order.id}? This cannot be undone.`)) return;
    setDeleting(order.id);
    setError("");
    try {
      await api.deleteOrder(order.id);
      setOrders((current) => (current || []).filter((item) => item.id !== order.id));
    } catch (e) {
      setError(e.message || "Could not delete order.");
    } finally {
      setDeleting("");
    }
  };

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

  if (orders === null) return <p className="text-xs opacity-60 mt-6">Loading orders…</p>;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display italic text-lg font-bold">Orders</h3>
          <p className="text-xs opacity-50">{orders.length} order{orders.length === 1 ? "" : "s"} · update status from here.</p>
        </div>
        <button onClick={load} className="px-3 py-1.5 rounded-full border border-current/15 text-[10px] font-semibold uppercase">Refresh</button>
      </div>
      {error && <p className="text-xs text-[#A8431E] border border-[#A8431E]/20 rounded-lg px-3 py-2">{error}</p>}
      {orders.length === 0 ? <p className="text-xs opacity-60">No orders placed yet.</p> : orders.map((o) => {
        const items = Array.isArray(o.items) ? o.items : [];
        const total = Number(o.total || 0);
        const status = ORDER_STATUSES.includes(o.status) ? o.status : "placed";
        return (
          <div key={o.id} className="border border-current/10 rounded-2xl p-4 text-sm">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-mono text-xs font-semibold">#{o.id}</p>
                <p className="text-xs opacity-55 mt-1">{o.email || "Guest email unavailable"}</p>
              </div>
              <p className="text-[10px] opacity-55">{o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}</p>
            </div>
            <p className="opacity-80">{items.map((it) => `${it?.name || "Item"} ×${Number(it?.qty || 0)}`).join(", ") || "No item details"}</p>
            {o.shipping && <p className="text-xs opacity-50 mt-2">{o.shipping.fullName || ""} · {o.shipping.phone || ""} · {o.shipping.line1 || ""}, {o.shipping.city || ""}</p>}
            <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
              <div>
                <p className="font-mono font-semibold">${total.toFixed(2)}</p>
                <p className="text-[10px] uppercase tracking-wide opacity-50 mt-1">{o.paymentMethod === "cod" ? "Cash on delivery" : `${o.paymentMethod || "payment"} · ${o.paymentRef || "—"}`}</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={status} disabled={updating === o.id || deleting === o.id} onChange={(e) => updateStatus(o, e.target.value)} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-xs capitalize">
                  {ORDER_STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
                {(["delivered", "cancelled"].includes(status)) && (
                  <button type="button" onClick={() => removeOrder(o)} disabled={deleting === o.id} className="w-9 h-9 rounded-lg border border-[#A8431E]/25 text-[#A8431E] flex items-center justify-center disabled:opacity-50" title="Delete completed order">
                    {deleting === o.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HomeContentPanel() {
  const { siteContent, refreshSiteContent } = useStore();
  const [form, setForm] = useState({ ...siteContent });
  const [imagePreview, setImagePreview] = useState(siteContent.heroImage || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { setForm({ ...siteContent }); setImagePreview(siteContent.heroImage || ""); }, [siteContent]);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const pickImage = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > 8 * 1024 * 1024) return setError("Image is larger than 8MB.");
    setUploading(true); setError(null);
    try { const uploaded = await uploadAdminImage(file, "site"); setImagePreview(uploaded.url); setForm((f) => ({ ...f, heroImage: uploaded.url })); }
    catch (e) { setError(e.message); } finally { setUploading(false); }
  };
  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError(null);
    try { await api.updateSiteContent(form); await refreshSiteContent(); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    catch (e) { setError(e.message); } finally { setSaving(false); }
  };
  const field = (label, key, placeholder = "") => <label className="flex flex-col gap-1 text-xs"><span className="opacity-60">{label}</span><input value={form[key] ?? ""} onChange={set(key)} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder={placeholder} /></label>;

  return <form onSubmit={save} className="mt-6 space-y-7 max-w-3xl">
    <div className="grid md:grid-cols-2 gap-4">
      <div className="md:col-span-2 border border-current/10 rounded-2xl p-5 space-y-4">
        <p className="text-xs tracking-widest uppercase opacity-50">Hero / main banner</p>
        <div className="flex items-center gap-4">{imagePreview ? <img src={imagePreview} alt="Hero preview" className="w-32 h-24 object-cover rounded-lg" /> : <div className="w-32 h-24 rounded-lg border border-dashed border-current/25 flex items-center justify-center opacity-40"><ImagePlus size={20}/></div>}<label className="text-xs px-3 py-2 rounded-full border border-current/15 cursor-pointer">{uploading ? "Uploading…" : "Upload hero image"}<input type="file" accept="image/*" className="hidden" onChange={pickImage} disabled={uploading}/></label></div>
        <div className="grid md:grid-cols-2 gap-4">{field("Headline", "heroHeadline", "Wear the unfamiliar.")}{field("Tagline / eyebrow", "heroTagline", "A study in everyday form")}{field("Top-left label", "heroTopLeft")}{field("Top-right label", "heroTopRight")}{field("CTA label", "heroCtaLabel")}{field("CTA link", "heroCtaLink", "/shop?category=clothing")}{field("Bottom-left label", "heroBottomLeft")}{field("Bottom-right label", "heroBottomRight")}</div>
        {field("CTA supporting text", "heroCtaNote", "Designed in small runs.\nMade to be kept.")}
      </div>
      <div className="border border-current/10 rounded-2xl p-5 space-y-4 md:col-span-2"><p className="text-xs tracking-widest uppercase opacity-50">Homepage sections</p><div className="grid md:grid-cols-2 gap-4">{field("What's New title", "whatsNewTitle", "What’s new.")}{field("What's New description", "whatsNewDescription")}</div><div className="grid md:grid-cols-3 gap-3">{[["showWhatsNew","Show What's New"],["showFilm","Show Fashion Film"],["showManifesto","Show Studio / Manifesto"]].map(([key,label])=><label key={key} className="flex items-center gap-2 text-xs border border-current/10 rounded-xl px-3 py-3"><input type="checkbox" checked={form[key] !== false} onChange={set(key)}/>{label}</label>)}</div></div>
      <div className="border border-current/10 rounded-2xl p-5 space-y-4 md:col-span-2"><p className="text-xs tracking-widest uppercase opacity-50">Fashion film</p><div className="grid md:grid-cols-2 gap-4">{field("Film title", "filmTitle", "Clothing in motion.")}{field("Video URL", "filmVideoUrl", "Leave empty for built-in film")}</div>{field("Film description", "filmDescription", "A moving study of fabric, proportion and everyday gesture.")}<p className="text-[11px] opacity-45">For now the film uses a URL. You can paste a hosted MP4 URL; the built-in video remains the fallback.</p></div>
    </div>
    {error && <p className="text-xs text-[#A8431E]">{error}</p>}
    <div className="flex items-center gap-3"><button type="submit" disabled={saving || uploading} className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase bg-black text-white disabled:opacity-50">{saving ? "Saving…" : "Save homepage settings"}</button>{saved && <span className="text-xs text-emerald-600">Saved.</span>}</div>
  </form>;
}

function CategoriesPanel() {
  const { refreshCategories } = useStore();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true); setError(null);
    try { setCategories(await api.adminCategories()); }
    catch (e) { setError(e.message || "Could not load categories."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault(); if (!name.trim()) return;
    setAdding(true); setError(null);
    try { await api.createCategory(name.trim()); setName(""); await Promise.all([load(), refreshCategories()]); }
    catch (e) { setError(e.message); } finally { setAdding(false); }
  };
  const saveEdit = async (cat) => {
    if (!editName.trim()) return;
    setBusy(`edit:${cat.id}`); setError(null);
    try { await api.updateCategory(cat.id, editName.trim()); setEditing(null); await Promise.all([load(), refreshCategories()]); }
    catch (e) { setError(e.message); } finally { setBusy(""); }
  };
  const remove = async (cat) => {
    if (!confirm(`Delete "${cat.name}" category?`)) return;
    setBusy(`del:${cat.id}`); setError(null);
    try { await api.deleteCategory(cat.id); await Promise.all([load(), refreshCategories()]); }
    catch (e) { setError(e.message); } finally { setBusy(""); }
  };
  const restore = async (cat) => {
    setBusy(`restore:${cat.id}`); setError(null);
    try { await api.createCategory(cat.originalName || cat.name); await Promise.all([load(), refreshCategories()]); }
    catch (e) { setError(e.message); } finally { setBusy(""); }
  };
  return <div className="mt-6 max-w-2xl space-y-6">
    <form onSubmit={add} className="flex items-end gap-3">
      <label className="flex flex-col gap-1 text-xs flex-1"><span className="opacity-60">Add / restore category</span><input value={name} onChange={e=>setName(e.target.value)} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder="e.g. Ceramics or Clothing to restore" /></label>
      <button disabled={adding||!name.trim()} className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase bg-black text-white disabled:opacity-50">{adding?"Saving…":"Add"}</button>
    </form>
    {error&&<p className="text-xs text-[#A8431E]">{error}</p>}
    {loading?<p className="text-xs opacity-60">Loading…</p>:<div className="space-y-2">{categories.map(c=><div key={c.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${c.hidden?"border-[#A8431E]/20 opacity-70":"border-current/10"}`}>
      {editing===c.id?<input autoFocus value={editName} onChange={e=>setEditName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveEdit(c);if(e.key==="Escape")setEditing(null)}} className="flex-1 px-2 py-1.5 rounded-lg border border-current/15 bg-transparent"/>:<div className="flex-1"><span>{c.name}</span>{c.builtin&&<span className="ml-2 text-[9px] uppercase tracking-wider opacity-40">Default</span>}{c.hidden&&<span className="ml-2 text-[9px] uppercase tracking-wider text-[#A8431E]">Deleted / hidden</span>}</div>}
      <div className="flex gap-2 items-center">{editing===c.id?<><button type="button" onClick={()=>saveEdit(c)} disabled={busy===`edit:${c.id}`} className="text-[10px] uppercase font-semibold">Save</button><button type="button" onClick={()=>setEditing(null)} className="text-[10px] uppercase opacity-50">Cancel</button></>:<>{!c.hidden&&<button type="button" onClick={()=>{setEditing(c.id);setEditName(c.name)}} className="text-[10px] uppercase font-semibold">Edit</button>}{c.hidden?<button type="button" onClick={()=>restore(c)} disabled={busy===`restore:${c.id}`} className="text-[10px] uppercase font-semibold">{busy===`restore:${c.id}`?"Restoring…":"Restore"}</button>:<button type="button" onClick={()=>remove(c)} disabled={busy===`del:${c.id}`} className="w-7 h-7 rounded-full border border-[#A8431E]/25 text-[#A8431E] flex items-center justify-center">{busy===`del:${c.id}`?<Loader2 size={12} className="animate-spin"/>:<Trash2 size={12}/>}</button>}</>}</div>
    </div>)}</div>}
    <p className="text-[11px] opacity-45">Default categories stay in the system. Delete hides them from the storefront; typing the original default name in Add restores it. You can edit, delete, add and restore defaults.</p>
  </div>;
}

const SUB_GENDERS = [
  { id: "women", label: "Women" },
  { id: "men", label: "Men" },
  { id: "kids", label: "Children" },
];

function SubcategoriesPanel() {
  const { refreshSubcategories } = useStore();
  const [detailed,setDetailed]=useState(null); const [gender,setGender]=useState("women"); const [name,setName]=useState(""); const [editing,setEditing]=useState(null); const [editName,setEditName]=useState(""); const [busy,setBusy]=useState(""); const [error,setError]=useState(null); const [loading,setLoading]=useState(true);
  const load=async()=>{setLoading(true);setError(null);try{setDetailed(await api.adminSubcategories())}catch(e){setError(e.message||"Could not load sub-categories.")}finally{setLoading(false)}};
  useEffect(()=>{load()},[]);
  const add=async(e)=>{e.preventDefault();if(!name.trim())return;setBusy("add");setError(null);try{await api.createSubcategory(gender,name.trim());setName("");await Promise.all([load(),refreshSubcategories()])}catch(e){setError(e.message)}finally{setBusy("")}};
  const save=async(s)=>{if(!editName.trim())return;setBusy(`edit:${s.originalName||s.name}`);setError(null);try{await api.updateSubcategory(gender,s.originalName||s.name,editName.trim());setEditing(null);await Promise.all([load(),refreshSubcategories()])}catch(e){setError(e.message)}finally{setBusy("")}};
  const remove=async(s)=>{if(!confirm(`Delete "${s.name}" from ${gender}?`))return;setBusy(`del:${s.originalName||s.name}`);setError(null);try{await api.deleteSubcategory(gender,s.name);await Promise.all([load(),refreshSubcategories()])}catch(e){setError(e.message)}finally{setBusy("")}};
  const restore=async(s)=>{setBusy(`restore:${s.originalName||s.name}`);setError(null);try{await api.createSubcategory(gender,s.originalName||s.name);await Promise.all([load(),refreshSubcategories()])}catch(e){setError(e.message)}finally{setBusy("")}};
  const list=detailed?.[gender]||[];
  return <div className="mt-6 max-w-2xl space-y-6"><div className="flex gap-2">{SUB_GENDERS.map(g=><button type="button" key={g.id} onClick={()=>setGender(g.id)} className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase ${gender===g.id?"bg-black text-white":"border border-current/15"}`}>{g.label}</button>)}</div>
    <form onSubmit={add} className="flex items-end gap-3"><label className="flex flex-col gap-1 text-xs flex-1"><span className="opacity-60">Add / restore {gender} sub-category</span><input value={name} onChange={e=>setName(e.target.value)} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder="e.g. Jackets or Dresses to restore"/></label><button disabled={busy==="add"||!name.trim()} className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase bg-black text-white disabled:opacity-50">{busy==="add"?"Saving…":"Add"}</button></form>
    {error&&<p className="text-xs text-[#A8431E]">{error}</p>}
    {loading?<p className="text-xs opacity-60">Loading…</p>:<div className="space-y-2">{list.map(s=>{const key=s.originalName||s.name; return <div key={`${gender}-${key}`} className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${s.hidden?"border-[#A8431E]/20 opacity-70":"border-current/10"}`}>
      {editing===key?<input autoFocus value={editName} onChange={e=>setEditName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")save(s);if(e.key==="Escape")setEditing(null)}} className="flex-1 px-2 py-1.5 rounded-lg border border-current/15 bg-transparent"/>:<div className="flex-1"><span>{s.name}</span>{s.builtin&&<span className="ml-2 text-[9px] uppercase tracking-wider opacity-40">Default</span>}{s.hidden&&<span className="ml-2 text-[9px] uppercase tracking-wider text-[#A8431E]">Deleted / hidden</span>}</div>}
      <div className="flex gap-2 items-center">{editing===key?<><button type="button" onClick={()=>save(s)} disabled={busy===`edit:${key}`} className="text-[10px] uppercase font-semibold">Save</button><button type="button" onClick={()=>setEditing(null)} className="text-[10px] uppercase opacity-50">Cancel</button></>:<>{!s.hidden&&<button type="button" onClick={()=>{setEditing(key);setEditName(s.name)}} className="text-[10px] uppercase font-semibold">Edit</button>}{s.hidden?<button type="button" onClick={()=>restore(s)} disabled={busy===`restore:${key}`} className="text-[10px] uppercase font-semibold">{busy===`restore:${key}`?"Restoring…":"Restore"}</button>:<button type="button" onClick={()=>remove(s)} disabled={busy===`del:${key}`} className="w-7 h-7 rounded-full border border-[#A8431E]/25 text-[#A8431E] flex items-center justify-center">{busy===`del:${key}`?<Loader2 size={12} className="animate-spin"/>:<Trash2 size={12}/>}</button>}</>}</div>
    </div>})}</div>}
    <p className="text-[11px] opacity-45">Default sub-categories remain available. Delete hides them; use Restore or type the original default name in Add to bring them back. Products must be moved before deleting a category that is still in use.</p></div>;
}

function MessagesPanel() {
  const [threads, setThreads] = useState(null);
  const [threadsError, setThreadsError] = useState("");
  const [email, setEmail] = useState("");
  const [looking, setLooking] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [active, setActive] = useState(null); // { uid, email, name }
  const [messages, setMessages] = useState(null);
  const [messagesError, setMessagesError] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bodyRef = useRef(null);

  const loadThreads = async () => {
    try {
      const data = await api.adminMessageThreads();
      setThreads(Array.isArray(data) ? data : []);
      setThreadsError("");
    } catch (e) {
      setThreadsError(e.message || "Could not load conversations.");
      setThreads([]);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  const loadMessages = async (uid) => {
    try {
      const data = await api.adminMessagesFor(uid);
      setMessages(Array.isArray(data) ? data : []);
      setMessagesError("");
    } catch (e) {
      setMessagesError(e.message || "Could not load this conversation.");
    }
  };

  useEffect(() => {
    if (!active) return;
    loadMessages(active.uid);
    const id = setInterval(() => loadMessages(active.uid), 4000);
    return () => clearInterval(id);
  }, [active]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages]);

  const openThread = (thread) => {
    setActive(thread);
    setMessages(null);
    setMessagesError("");
  };

  const lookup = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLooking(true);
    setLookupError("");
    try {
      const found = await api.adminLookupEmail(email.trim());
      openThread(found);
      setEmail("");
      loadThreads();
    } catch (e) {
      setLookupError(e.message || "Could not find that customer.");
    } finally {
      setLooking(false);
    }
  };

  const reply = async (e) => {
    e.preventDefault();
    if (!text.trim() || !active || sending) return;
    setSending(true);
    setMessagesError("");
    try {
      await api.adminSendMessage(active.uid, text.trim());
      setText("");
      await Promise.all([loadMessages(active.uid), loadThreads()]);
    } catch (e) {
      setMessagesError(e.message || "Could not send reply.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-6 grid md:grid-cols-[280px_1fr] gap-6">
      <div className="space-y-4">
        <form onSubmit={lookup} className="flex items-end gap-2">
          <label className="flex flex-col gap-1 text-xs flex-1">
            <span className="opacity-60">Message a client by email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="client@email.com" className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" />
          </label>
          <button type="submit" disabled={looking || !email.trim()} className="px-4 py-2.5 rounded-full text-[10px] font-semibold uppercase bg-black text-white disabled:opacity-50 shrink-0">
            {looking ? <Loader2 size={13} className="animate-spin" /> : "Open"}
          </button>
        </form>
        {lookupError && <p className="text-xs text-[#A8431E]">{lookupError}</p>}
        <p className="text-[11px] opacity-45">Works once that customer has signed in to ArtCanvas at least once.</p>

        <div className="border-t border-current/10 pt-4">
          <p className="text-xs tracking-widest uppercase opacity-50 mb-3">Conversations</p>
          {threadsError && <p className="text-xs text-[#A8431E] mb-2">{threadsError}</p>}
          {threads === null ? (
            <p className="text-xs opacity-60">Loading…</p>
          ) : threads.length === 0 ? (
            <p className="text-xs opacity-60">No conversations yet.</p>
          ) : (
            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
              {threads.map((t) => (
                <button
                  key={t.uid}
                  onClick={() => openThread(t)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition ${active?.uid === t.uid ? "border-current/60 bg-current/5" : "border-current/10 hover:bg-current/5"}`}
                >
                  <p className="font-semibold truncate">{t.email || "Unknown"}</p>
                  <p className="opacity-55 truncate mt-0.5">{t.lastFrom === "admin" ? "You: " : ""}{t.lastText}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border border-current/10 rounded-2xl flex flex-col min-h-[420px]">
        {!active ? (
          <div className="m-auto text-center px-8 py-16 opacity-50 text-sm">
            <MessageCircle size={26} className="mx-auto mb-3" />
            Pick a conversation, or add a client's email above, to start replying.
          </div>
        ) : (
          <>
            <div className="px-5 py-4 border-b border-current/10">
              <p className="font-semibold text-sm">{active.email || "Client"}</p>
              {active.name && <p className="text-xs opacity-50">{active.name}</p>}
            </div>
            <div ref={bodyRef} className="flex-1 overflow-y-auto p-5 space-y-3 max-h-[420px]">
              {messages === null ? (
                <p className="text-xs opacity-60">Loading conversation…</p>
              ) : messages.length === 0 ? (
                <p className="text-xs opacity-60">No messages yet — say hello.</p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${m.from === "admin" ? "ml-auto bg-black text-white rounded-br-sm" : "bg-current/5 rounded-bl-sm"}`}>
                    {m.text}
                  </div>
                ))
              )}
            </div>
            {messagesError && <p className="text-xs text-[#A8431E] px-5 pb-2">{messagesError}</p>}
            <form onSubmit={reply} className="p-4 border-t border-current/10 flex gap-2">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a reply…" className="flex-1 px-3 py-2.5 rounded-full border border-current/15 bg-transparent text-sm" disabled={sending} />
              <button type="submit" disabled={sending || !text.trim()} className="w-10 h-10 rounded-full flex items-center justify-center bg-black text-white disabled:opacity-50 shrink-0" aria-label="Send reply">
                {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const { dark, refreshProducts } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("products");

  // Reload both the admin's full-detail product list AND the public product
  // list used everywhere else in the app, so changes show up immediately for
  // every shopper — not just inside this dashboard.
  const load = async () => {
    setLoading(true);
    try {
      const list = await api.adminProducts();
      setProducts(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to load admin products", e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
    await refreshProducts();
  };

  useEffect(() => {
    load();
  }, []);

  const tabs = [
    { id: "products", label: "Products", icon: LayoutGrid },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "subcategories", label: "Sub-categories", icon: Users },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "home", label: "Home", icon: HomeIcon },
  ];

  return (
    <PageTransition>
      <main className="px-6 pt-10 pb-24">
        <div className="max-w-4xl mx-auto">
          <p className="section-kicker">ARTCANVAS / ADMIN</p>
          <h1 className="font-display italic text-3xl sm:text-4xl font-black tracking-tight mb-2">Studio dashboard</h1>
          <p className="text-sm opacity-60 mb-8">Add products (clothing, art, objects, accessories, gifts) with photos from your own computer, manage stock and pricing, control the homepage, review orders, and message clients directly.</p>

          <div className="flex gap-2 mb-8 flex-wrap">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-full text-xs font-semibold uppercase flex items-center gap-1.5 ${tab === t.id ? (dark ? "bg-[#EDE7D9] text-black" : "bg-black text-white") : "border border-current/15"}`}>
                  <Icon size={12} /> {t.label}
                </button>
              );
            })}
          </div>

          {tab === "products" && (
            <div className="space-y-8">
              <AddProductForm onCreated={load} />
              <div>
                <h3 className="font-display italic text-lg font-bold mb-3">{products.length} product{products.length !== 1 ? "s" : ""}</h3>
                {loading ? (
                  <p className="text-xs opacity-60">Loading…</p>
                ) : (
                  <div>
                    {products.map((p) => (
                      <ProductRow key={p.id} p={p} onChanged={load} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "categories" && <CategoriesPanel />}
          {tab === "subcategories" && <SubcategoriesPanel />}
          {tab === "orders" && <OrdersPanel />}
          {tab === "messages" && <MessagesPanel />}
          {tab === "home" && <HomeContentPanel />}
        </div>
      </main>
    </PageTransition>
  );
}
