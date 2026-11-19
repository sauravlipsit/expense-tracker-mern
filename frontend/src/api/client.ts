import axios from 'axios';
const API_Base_URL = import.meta.env.VITE_API_URL
export const api = axios.create({
  baseURL: API_Base_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});