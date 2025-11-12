import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/login';
import PrivateRoute from './components/PrivateRoute.component';
import { verifyToken } from './stores/Slice/authSlice';
import './App.css'

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  // Gọi verifyToken khi App tải lần đầu
  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);

  // Hiển thị loading nếu đang xác thực token
  if (loading) {
    return <div>Đang tải, vui lòng chờ...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Route được bảo vệ */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <div>
              <h1>Dashboard</h1>
              <p>Chào mừng đến với Dashboard!</p>
            </div>
          </PrivateRoute>
        }
      />

      {/* Chuyển hướng về trang login nếu vào trang chủ */}
      <Route path="/" element={<Login />} /> 
    </Routes>
  );
}

export default App;
