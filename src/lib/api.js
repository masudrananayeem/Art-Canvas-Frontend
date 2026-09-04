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
  getSiteContent: () => request("/api/site-content"),

  // authenticated user
  me: () => request("/api/me", { auth: true }),
  updateMe: (patch) => request("/api/me", { method: "PATCH", body: patch, auth: true }),
  placeOrder: (items, shipping, paymentMethod, paymentRef) =>
    request("/api/orders", { method: "POST", body: { items, shipping, paymentMethod, paymentRef }, auth: true }),
  myOrders: () => request("/api/orders/me", { auth: true }),
  profileCloudinarySignature: () => request("/api/cloudinary-signature", { method: "POST", auth: true }),

  // admin
  adminProducts: () => request("/api/admin/products", { auth: true }),
  createProduct: (product) => request("/api/admin/products", { method: "POST", body: product, auth: true }),
  updateProduct: (id, patch) => request(`/api/admin/products/${id}`, { method: "PATCH", body: patch, auth: true }),
  deleteProduct: (id) => request(`/api/admin/products/${id}`, { method: "DELETE", auth: true }),
  adminCloudinarySignature: (context = "product") => request("/api/admin/cloudinary-signature", { method: "POST", body: { context }, auth: true }),
  updateSiteContent: (patch) => request("/api/admin/site-content", { method: "PATCH", body: patch, auth: true }),
  allOrders: () => request("/api/admin/orders", { auth: true }),
};

async function uploadToCloudinary(sig, file) {
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

// Admin-only: product photos or the homepage hero image.
export async function uploadAdminImage(file, context = "product") {
  const sig = await api.adminCloudinarySignature(context);
  return uploadToCloudinary(sig, file);
}

// Any signed-in user: their own profile photo.
export async function uploadProfileImage(file) {
  const sig = await api.profileCloudinarySignature();
  return uploadToCloudinary(sig, file);
}
