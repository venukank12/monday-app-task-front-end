import axios from "axios";
import { getSessionToken } from "./mondayClient";

// create axios instance to use through whole app

const API = axios.create();

API.interceptors.request.use(
  async (config) => {
    config.baseURL = process.env.REACT_APP_BACKEND_API;
    const {data:token} = await getSessionToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers['ngrok-skip-browser-warning']='yes';
    return config;
  },
  error =>  Promise.reject(error)
);


export default API;