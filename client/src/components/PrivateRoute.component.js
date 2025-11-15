// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useSelector((state) => state.auth);

//   if (loading) {
//     return <div>Loading...</div>; // Chờ xác thực xong
//   }

//   // Nếu đã xác thực thì cho phép truy cập, ngược lại về trang login
//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;