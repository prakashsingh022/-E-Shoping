import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`; // Use env var

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Configure with credentials or token if needed
api.interceptors.request.use((config) => {
  const storedUser = sessionStorage.getItem('adminUser');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

// Product Services
export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const addProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Category Services
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

// Banner Services
export const getBanners = async (admin = false) => {
  const endpoint = admin ? '/banners/admin' : '/banners';
  const response = await api.get(endpoint);
  return response.data;
};

export const createBanner = async (bannerData) => {
  const response = await api.post('/banners', bannerData);
  return response.data;
};

export const updateBanner = async (id, bannerData) => {
  const response = await api.put(`/banners/${id}`, bannerData);
  return response.data;
};

export const deleteBanner = async (id) => {
  const response = await api.delete(`/banners/${id}`);
  return response.data;
};

// Video Services
export const getVideos = async () => {
  const response = await api.get('/videos');
  return response.data;
};

export const addVideo = async (videoData) => {
  const response = await api.post('/videos', videoData);
  return response.data;
};

export const updateVideo = async (id, videoData) => {
  const response = await api.put(`/videos/${id}`, videoData);
  return response.data;
};

export const deleteVideo = async (id) => {
  const response = await api.delete(`/videos/${id}`);
  return response.data;
};

// Admin Services
export const getAdmins = async () => {
  const response = await api.get('/admin');
  return response.data;
};

// Dashboard & Analytics Services
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getRevenueAnalytics = async (days = 7) => {
  const response = await api.get(`/analytics/revenue?days=${days}`);
  return response.data;
};

export const getTopProducts = async () => {
  const response = await api.get('/analytics/top-products');
  return response.data;
};

export const getRecentOrders = async () => {
  const response = await api.get('/orders/recent');
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};
// Section APIs
export const getSections = async () => {
  const response = await api.get('/section');
  return response.data;
};

export const createSection = async (sectionData) => {
  const response = await api.post('/section/add', sectionData);
  return response.data;
};

export const updateSection = async (id, sectionData) => {
  const response = await api.put(`/section/${id}`, sectionData);
  return response.data;
};

export const deleteSection = async (id) => {
  const response = await api.delete(`/section/${id}`);
  return response.data;
};
