import { auth } from "./firebase";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

async function request(path, { method = "GET", body, auth: needsAuth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (needsAuth) {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be signed in to do that.");
    const token = await user.getIdToken();
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  // public
  getProducts: () => request("/api/products"),
  getProduct: (id) => request(`/api/products/${id}`),

  // authenticated user
  me: () => request("/api/me", { auth: true }),
  placeOrder: (items, shipping) => request("/api/orders", { method: "POST", body: { items, shipping }, auth: true }),
  myOrders: () => request("/api/orders/me", { auth: true }),

  // admin
  adminProducts: () => request("/api/admin/products", { auth: true }),
  createProduct: (product) => request("/api/admin/products", { method: "POST", body: product, auth: true }),
  updateProduct: (id, patch) => request(`/api/admin/products/${id}`, { method: "PATCH", body: patch, auth: true }),
  deleteProduct: (id) => request(`/api/admin/products/${id}`, { method: "DELETE", auth: true }),
  cloudinarySignature: () => request("/api/admin/cloudinary-signature", { method: "POST", auth: true }),
  allOrders: () => request("/api/admin/orders", { auth: true }),
};

// Uploads a File directly to Cloudinary using a signature minted by the backend.
export async function uploadImageToCloudinary(file) {
  const sig = await api.cloudinarySignature();
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", sig.timestamp);
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  const res = await fetch(sig.uploadUrl, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Image upload failed");
  return { url: data.secure_url, publicId: data.public_id };
}
