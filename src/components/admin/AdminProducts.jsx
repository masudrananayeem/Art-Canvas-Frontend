import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Edit3, Flame, ImagePlus, Loader2, PackageCheck, PackageX, Plus, Search, Star, Trash2, X } from "lucide-react";
import { GENDERS } from "../../data/products";
import { useStore } from "../../context/StoreContext";
import { api, uploadAdminImage } from "../../lib/api";

const EMPTY_FORM = { name:"", description:"", price:"", category:"clothing", gender:"all", subcategory:"", stock:"", isFeatured:false };

function ProductForm({ initial = EMPTY_FORM, productId, onSaved, onCancel }) {
  const { categories, subcategories } = useStore();
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial });
  const initialImages = Array.isArray(initial.images) && initial.images.length ? initial.images : (initial.image ? [initial.image] : []);
  const initialPublicIds = Array.isArray(initial.imagePublicIds) && initial.imagePublicIds.length ? initial.imagePublicIds : (initial.imagePublicId ? [initial.imagePublicId] : []);
  const [existingImages, setExistingImages] = useState(initialImages);
  const [existingPublicIds, setExistingPublicIds] = useState(initialPublicIds);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const isClothing = form.category === "clothing";
  const subOptions = isClothing && form.gender !== "all" ? (subcategories[form.gender] || []) : [];

  const pickImages = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    if (selected.length + existingImages.length + files.length > 8) return setError("You can keep up to 8 product photos.");
    const invalid = selected.find((f) => !f.type.startsWith("image/"));
    if (invalid) return setError("Please choose image files only.");
    const oversized = selected.find((f) => f.size > 8 * 1024 * 1024);
    if (oversized) return setError("Each image must be 8MB or smaller.");
    setError("");
    setFiles((current) => [...current, ...selected]);
    setPreviews((current) => [...current, ...selected.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removePhoto = (index) => {
    if (index < existingImages.length) {
      setExistingImages((current) => current.filter((_, i) => i !== index));
      setExistingPublicIds((current) => current.filter((_, i) => i !== index));
      return;
    }
    const fileIndex = index - existingImages.length;
    setFiles((current) => current.filter((_, i) => i !== fileIndex));
    setPreviews((current) => current.filter((_, i) => i !== fileIndex));
  };

  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      let images = existingImages.slice(0, 8);
      let imagePublicIds = existingPublicIds.slice(0, 8);
      if (files.length) {
        const uploaded = [];
        for (const file of files) uploaded.push(await uploadAdminImage(file, "product"));
        images = [...images, ...uploaded.map((item) => item.url)].slice(0, 8);
        imagePublicIds = [...imagePublicIds, ...uploaded.map((item) => item.publicId)].slice(0, 8);
      }
      const image = images[0] || "";
      const imagePublicId = imagePublicIds[0] || "";
      const payload = {
        name: form.name.trim(), description: form.description.trim(), price: Number(form.price), category: form.category,
        gender: isClothing ? form.gender : "all", subcategory: form.subcategory.trim(), stock: Number(form.stock) || 0,
        image, imagePublicId, images, imagePublicIds, isFeatured: !!form.isFeatured,
      };
      if (!payload.name || !Number.isFinite(payload.price)) throw new Error("Name and price are required.");
      if (productId) await api.updateProduct(productId, payload); else await api.createProduct(payload);
      onSaved();
    } catch (e) { setError(e.message || "Could not save product."); }
    finally { setSaving(false); }
  };

  return <form onSubmit={submit} className="border border-current/10 rounded-2xl p-5 space-y-4 bg-current/[.015]">
    <div className="flex items-center justify-between gap-3"><div><h3 className="font-display italic text-lg font-bold">{productId ? "Edit product" : "Add a new product"}</h3><p className="text-xs opacity-50">Manage all product fields from one place.</p></div>{onCancel && <button type="button" onClick={onCancel} className="w-8 h-8 rounded-full border border-current/15 flex items-center justify-center"><X size={14}/></button>}</div>
    <div className="grid sm:grid-cols-2 gap-4">
      {[["Name","name","Fragment Overcoat"],["Price (USD)","price","120.00"],["Stock quantity","stock","0"]].map(([label,key,placeholder])=><label key={key} className="flex flex-col gap-1 text-xs"><span className="opacity-60">{label}</span><input value={form[key] ?? ""} onChange={set(key)} type={key === "name" ? "text" : "number"} min={key === "stock" ? 0 : 0} step={key === "price" ? "0.01" : "1"} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder={placeholder}/></label>)}
      <label className="flex flex-col gap-1 text-xs"><span className="opacity-60">Category</span><select value={form.category} onChange={set("category")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm">{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      {isClothing && <label className="flex flex-col gap-1 text-xs"><span className="opacity-60">Gender</span><select value={form.gender} onChange={set("gender")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm">{GENDERS.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></label>}
      {isClothing && form.gender !== "all" && <label className="flex flex-col gap-1 text-xs"><span className="opacity-60">Subcategory</span><select value={form.subcategory} onChange={set("subcategory")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm"><option value="">—</option>{subOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></label>}
      {!isClothing && <label className="flex flex-col gap-1 text-xs"><span className="opacity-60">Subcategory / style</span><input value={form.subcategory ?? ""} onChange={set("subcategory")} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder="e.g. Ceramics, Print, Sculpture"/></label>}
    </div>
    <label className="flex flex-col gap-1 text-xs"><span className="opacity-60">Description</span><textarea value={form.description ?? ""} onChange={set("description")} rows={4} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder="Short product description"/></label>
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <label className="flex flex-col gap-2 text-xs">
          <span className="opacity-60">Product photos <b className="font-normal opacity-70">(up to 8 angles)</b></span>
          <input type="file" accept="image/*" multiple onChange={pickImages} className="text-xs"/>
        </label>
        <label className="flex items-center gap-2 text-xs cursor-pointer"><input type="checkbox" checked={!!form.isFeatured} onChange={set("isFeatured")}/><Star size={13}/> Feature on homepage</label>
      </div>
      {(existingImages.length + previews.length) > 0 && <div className="flex flex-wrap gap-2">{[...existingImages, ...previews].map((src, i) => <div key={`${src}-${i}`} className="relative group"><img src={src} alt={`Product angle ${i + 1}`} className="w-16 h-16 rounded-lg object-cover border border-current/10"/><span className="absolute left-1 bottom-1 rounded bg-black/70 px-1.5 py-0.5 text-[8px] text-white">{i + 1}</span><button type="button" onClick={() => removePhoto(i)} className="absolute -right-1.5 -top-1.5 w-5 h-5 rounded-full bg-white text-black shadow text-[11px]">×</button></div>)}</div>}
      <p className="text-[10px] opacity-45">The first photo is the main product image. The rest are shown as alternate angles on the product page.</p>
    </div>
    {error && <p className="text-xs text-[#A8431E]">{error}</p>}
    <div className="flex gap-2"><button disabled={saving} className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase bg-black text-white disabled:opacity-50">{saving ? "Saving…" : productId ? "Save changes" : "Add product"}</button>{onCancel && <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase border border-current/15">Cancel</button>}</div>
  </form>;
}

function ProductCard({ p, onChanged }) {
  const [editing, setEditing] = useState(false); const [featured, setFeatured] = useState(!!p.isFeatured); const [deleting, setDeleting] = useState(false);
  const editInitial = useMemo(() => ({ ...p, price: p.price ?? "", stock: p.stock ?? "", gender: p.gender || "all" }), [p]);
  const toggleFeatured = async () => { const next = !featured; setFeatured(next); try { await api.updateProduct(p.id, { isFeatured: next }); onChanged(); } catch(e) { setFeatured(!next); alert(e.message); } };
  const remove = async () => { if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return; setDeleting(true); try { await api.deleteProduct(p.id); onChanged(); } catch(e) { alert(e.message); } finally { setDeleting(false); } };
  if (editing) return <ProductForm productId={p.id} initial={editInitial} onSaved={async()=>{setEditing(false); await onChanged();}} onCancel={()=>setEditing(false)} />;
  return <div className="border border-current/10 rounded-2xl p-3 sm:p-4">
    <div className="flex items-center gap-3"><img src={p.image || `https://picsum.photos/seed/${p.seed || p.id}/100/120`} alt="" className="w-14 h-16 sm:w-16 sm:h-20 object-cover rounded-lg shrink-0"/><div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{p.name}</p><p className="text-xs opacity-50 capitalize mt-1">{p.category}{p.gender && p.gender !== "all" ? ` · ${p.gender}` : ""}{p.subcategory ? ` · ${p.subcategory}` : ""}</p><div className="flex gap-3 mt-2 text-[10px] opacity-55"><span>${Number(p.price||0).toFixed(2)}</span><span>Stock {p.stock ?? 0}</span>{p.sold > 0 && <span className="flex items-center gap-1"><Flame size={10}/> {p.sold} sold</span>}</div></div><div className="flex gap-1.5 items-center"><button onClick={toggleFeatured} title="Feature on homepage" className={`w-8 h-8 rounded-full border flex items-center justify-center ${featured ? "text-amber-500 border-amber-500" : "border-current/15 opacity-50"}`}><Star size={13} fill={featured ? "currentColor" : "none"}/></button><button onClick={()=>setEditing(true)} title="Edit product" className="w-8 h-8 rounded-full border border-current/15 flex items-center justify-center"><Edit3 size={13}/></button><button onClick={remove} disabled={deleting} title="Delete product" className="w-8 h-8 rounded-full border border-[#A8431E]/25 text-[#A8431E] flex items-center justify-center">{deleting?<Loader2 size={13} className="animate-spin"/>:<Trash2 size={13}/>}</button></div></div>
  </div>;
}

export default function AdminProducts() {
  const { refreshProducts, categories } = useStore();
  const [products, setProducts] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [addOpen, setAddOpen] = useState(false); const [query, setQuery] = useState(""); const [open, setOpen] = useState({}); const addRef = useRef(null);
  const load = async () => { setLoading(true); setError(""); try { const list = await api.adminProducts(); setProducts(Array.isArray(list)?list:[]); } catch(e){setError(e.message||"Could not load products.");} finally {setLoading(false);} await refreshProducts(); };
  useEffect(()=>{load();},[]);
  const filtered = useMemo(()=>{const q=query.trim().toLowerCase(); return products.filter(p=>!q || [p.name,p.description,p.category,p.gender,p.subcategory].filter(Boolean).some(v=>String(v).toLowerCase().includes(q)));},[products,query]);
  const groups = useMemo(()=>categories.map(c=>({ ...c, items: filtered.filter(p=>p.category===c.id)})).filter(g=>g.items.length),[categories,filtered]);
  const uncategorized = filtered.filter(p=>!categories.some(c=>c.id===p.category)); if(uncategorized.length) groups.push({id:"other",name:"Other",items:uncategorized});
  const openAdd = ()=>{setAddOpen(true); setTimeout(()=>addRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),50);};
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display italic text-lg font-bold">Products</h3><p className="text-xs opacity-50">{products.length} total · grouped by category · click Edit for full control.</p></div><button type="button" onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold uppercase bg-black text-white"><Plus size={14}/> Add product</button></div>
    <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search admin products…" className="w-full pl-9 pr-9 py-2.5 rounded-full border border-current/15 bg-transparent text-sm"/>{query&&<button type="button" onClick={()=>setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50"><X size={14}/></button>}</div>
    {addOpen && <div ref={addRef}><ProductForm onSaved={async()=>{setAddOpen(false); await load();}} onCancel={()=>setAddOpen(false)}/></div>}
    {error&&<p className="text-xs text-[#A8431E]">{error}</p>}
    {loading?<p className="text-xs opacity-60">Loading products…</p>:groups.length===0?<p className="text-xs opacity-60">No products match this search.</p>:<div className="space-y-3">{groups.map(g=>{const expanded=open[g.id] !== false; return <section key={g.id} className="border border-current/10 rounded-2xl overflow-hidden"><button type="button" onClick={()=>setOpen(v=>({...v,[g.id]:!expanded}))} className="w-full flex items-center justify-between px-4 py-3.5 text-left"><span className="font-semibold text-sm">{g.name} <span className="text-[10px] opacity-45 ml-1">{g.items.length}</span></span><ChevronDown size={15} className={`transition-transform ${expanded?"rotate-180":""}`}/></button>{expanded&&<div className="px-3 pb-3 space-y-2">{g.items.map(p=><ProductCard key={p.id} p={p} onChanged={load}/>)}</div>}</section>})}</div>}
  </div>;
}
