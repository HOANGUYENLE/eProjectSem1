import axios from "axios";

const apiAuth = axios.create({
    baseURL: "/api",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    }
});

apiAuth.interceptors.request.use((config)=>{
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
});

const apiPublic = axios.create({
    baseURL: "/api",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    }
});

export {apiAuth, apiPublic};