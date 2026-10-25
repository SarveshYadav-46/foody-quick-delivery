import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// We can add interceptors here if needed in the future

export default API;
