import React, { useEffect, useState } from "react";
import { Trash2, Plus, ImagePlus, Loader2, PackageCheck, PackageX, ShoppingBag, Star, Home as HomeIcon, LayoutGrid } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { CATEGORIES, GENDERS, SUBCATEGORIES } from "../data/products";
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
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const pickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
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

  const clothingSubOptions = form.category === "clothing" && form.gender !== "all" ? SUBCATEGORIES[form.gender] || [] : [];
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
            {CATEGORIES.map((c) => (
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

function OrdersPanel() {
  const [orders, setOrders] = useState(null);
  useEffect(() => {
    api.allOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  if (orders === null) return <p className="text-xs opacity-60 mt-6">Loading orders…</p>;
  if (orders.length === 0) return <p className="text-xs opacity-60 mt-6">No orders placed yet.</p>;

  return (
    <div className="mt-6 space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="border border-current/10 rounded-xl p-4 text-sm">
          <div className="flex items-center justify-between text-xs opacity-60 mb-2">
            <span>{o.email}</span>
            <span>{new Date(o.createdAt).toLocaleString()}</span>
          </div>
          <p className="opacity-80">{o.items.map((it) => `${it.name} ×${it.qty}`).join(", ")}</p>
          {o.shipping && (
            <p className="text-xs opacity-50 mt-1">
              {o.shipping.fullName} · {o.shipping.phone} · {o.shipping.line1}, {o.shipping.city}
            </p>
          )}
          <div className="flex items-center justify-between mt-1">
            <p className="font-mono font-semibold">${o.total.toFixed(2)}</p>
            <span className="text-xs uppercase tracking-wide opacity-60">
              {o.paymentMethod === "cod" ? "Cash on delivery" : `${o.paymentMethod} · ${o.paymentRef || "—"}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function HomeContentPanel() {
  const { siteContent, refreshSiteContent } = useStore();
  const [form, setForm] = useState({ heroHeadline: siteContent.heroHeadline, heroTagline: siteContent.heroTagline });
  const [imagePreview, setImagePreview] = useState(siteContent.heroImage);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setForm({ heroHeadline: siteContent.heroHeadline, heroTagline: siteContent.heroTagline });
    setImagePreview(siteContent.heroImage);
  }, [siteContent]);

  const pickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded = await uploadAdminImage(file, "site");
      setImagePreview(uploaded.url);
      await api.updateSiteContent({ heroImage: uploaded.url });
      await refreshSiteContent();
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.updateSiteContent(form);
      await refreshSiteContent();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="mt-6 space-y-5 max-w-xl">
      <div>
        <p className="text-xs tracking-widest uppercase opacity-50 mb-3">Homepage hero image</p>
        <div className="flex items-center gap-4">
          {imagePreview ? (
            <img src={imagePreview} alt="" className="w-28 h-20 object-cover rounded-lg" />
          ) : (
            <div className="w-28 h-20 rounded-lg border border-dashed border-current/25 flex items-center justify-center opacity-40">
              <ImagePlus size={20} />
            </div>
          )}
          <label className="text-xs px-3 py-2 rounded-full border border-current/15 cursor-pointer">
            {uploading ? "Uploading…" : "Upload image"}
            <input type="file" accept="image/*" className="hidden" onChange={pickImage} disabled={uploading} />
          </label>
        </div>
        <p className="text-[11px] opacity-45 mt-2">Leave empty to keep the default editorial hero.</p>
      </div>

      <label className="flex flex-col gap-1 text-xs">
        <span className="opacity-60">Headline</span>
        <input value={form.heroHeadline} onChange={(e) => setForm((f) => ({ ...f, heroHeadline: e.target.value }))} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder="e.g. Wearable Art, Made Slowly" />
      </label>
      <label className="flex flex-col gap-1 text-xs">
        <span className="opacity-60">Tagline</span>
        <textarea value={form.heroTagline} onChange={(e) => setForm((f) => ({ ...f, heroTagline: e.target.value }))} rows={2} className="px-3 py-2 rounded-lg border border-current/15 bg-transparent text-sm" placeholder="A short line under the headline" />
      </label>

      {error && <p className="text-xs text-[#A8431E]">{error}</p>}

      <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase bg-black text-white disabled:opacity-50">
        {saving ? "Saving…" : "Save homepage content"}
      </button>
      {saved && <span className="text-xs text-emerald-600 ml-3">Saved.</span>}

      <div className="pt-4 border-t border-current/10">
        <p className="text-xs opacity-50">
          The homepage's featured product rail shows any products marked with the <Star size={11} className="inline -mt-0.5" fill="currentColor" /> star on the Products tab. Mark a few pieces as
          featured to control what shows there.
        </p>
      </div>
    </form>
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
  const load = () => {
    setLoading(true);
    api
      .adminProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
    refreshProducts();
  };

  useEffect(load, []);

  const tabs = [
    { id: "products", label: "Products", icon: LayoutGrid },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "home", label: "Home", icon: HomeIcon },
  ];

  return (
    <PageTransition>
      <main className="px-6 pt-10 pb-24">
        <div className="max-w-4xl mx-auto">
          <p className="section-kicker">ARTCANVAS / ADMIN</p>
          <h1 className="font-display italic text-3xl sm:text-4xl font-black tracking-tight mb-2">Studio dashboard</h1>
          <p className="text-sm opacity-60 mb-8">Add products (clothing, art, objects, accessories, gifts), manage stock and pricing, control the homepage, and review orders.</p>

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

          {tab === "orders" && <OrdersPanel />}
          {tab === "home" && <HomeContentPanel />}
        </div>
      </main>
    </PageTransition>
  );
}
