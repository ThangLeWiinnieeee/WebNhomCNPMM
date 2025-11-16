import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // URL backend của bạn
  withCredentials: true, // Gửi cookie cùng với request
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;