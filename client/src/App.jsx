import {Route, Routes } from 'react-router-dom';
import LoginPage from "./pages/login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<login />} />
      </Routes>
    </>
  );
}

export default App;
