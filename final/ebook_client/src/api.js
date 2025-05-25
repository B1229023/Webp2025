//api.js 設定axios串接API
//集中管理所有「與後端 API 溝通」的設定與請求方式（用 axios 來發送 HTTP 請求）
import axios from 'axios';

const API = axios.create({// 建立 axios 
  baseURL: 'http://localhost:8000',// Django 後端的 base URL（可改）
});

//自動加上 token（讓登入過的使用者有權限）
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
