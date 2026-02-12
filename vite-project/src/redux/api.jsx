import React from 'react'
import axios from "axios";
const api = axios.create({
    baseURL: "http://localhost:5000/api/auth", // change if needed
    withCredentials: true
});
export default api;
