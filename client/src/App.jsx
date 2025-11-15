import {Route, Routes } from 'react-router-dom';
import login from './pages/login/login';
import register from './pages/register/register';
import profile from './pages/profile/profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  

  return (
    <>
      <Routes>
        {/*Public Routes*/}
        <Route path="/login" element={<login />} />
        <Route path="/register" element={<register />} />
        {/*Private Routes*/}
        <Route path="/profile" element={<profile />} />
      </Routes>
    </>
  );
}

export default App;
