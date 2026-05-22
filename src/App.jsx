import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import OrderList from './pages/OrderList';
import UserList from './pages/UserList';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminManagement from './pages/AdminManagement';
import ActivityLogs from './pages/ActivityLogs';
import MediaManager from './pages/MediaManager';
import CategoryManagement from './pages/CategoryManagement';
import BannerManagement from './pages/BannerManagement';
import VideoManagement from './pages/VideoManagement';
import SectionManagement from './pages/SectionManagement';
import SuitSetEditionManagement from './pages/SuitSetEditionManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            
            <Route element={<ProtectedRoute requiredPermission="view_products" />}>
              <Route path="products" element={<ProductList />} />
              <Route path="media-manager" element={<MediaManager />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="manage_products" />}>
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="banners" element={<BannerManagement />} />
              <Route path="videos" element={<VideoManagement />} />
              <Route path="sections" element={<SectionManagement />} />
              <Route path="suit-set-edition" element={<SuitSetEditionManagement />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="view_orders" />}>
              <Route path="orders" element={<OrderList />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="view_users" />}>
              <Route path="users" element={<UserList />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="manage_admins" />}>
              <Route path="management" element={<AdminManagement />} />
            </Route>
            
            <Route path="activity-logs" element={<ActivityLogs />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
