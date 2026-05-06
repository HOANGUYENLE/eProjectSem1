import { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = new createContext();
export default function UserInfoProvider({children}){
    const navigate = useNavigate();
    const auth = JSON.parse(localStorage.getItem('user')) || {};
    const [user, setUser] = useState({
        name: auth.name || null,
        role: auth.role || null,
        token: auth.token||null
    })

    const formatTime = (timeStr)=>{
        const date = new Date(`1970-01-01T${timeStr}`);
        return new Intl.DateTimeFormat("vi-VN", {
            hour: "2-digit",
            minute: "2-digit"
        }).format(date);
    }

    const formatTime2 = (timeStr)=>{
        const date = new Date(timeStr);
        return date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    const formatDate = (DateTimeStr)=>{
        const date = new Date(DateTimeStr);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

    const handleLogout = async (e)=>{
        e.preventDefault();
        navigate("/");
        try{
          const res = await axios.post("/api/logout", {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
          });
        }
        catch (errors){
            if(errors.response){
                console.log(errors.response.data);
            }   
        }
        removeUserInfo();
        navigate("/");
    }

    const updateUserinfo = (name, role)=>{
        localStorage.setItem('user', JSON.stringify({
            token: user.token,
            name: name,
            role: role 
        }))
        setUser({
            name: JSON.parse(localStorage.getItem('user')).name,
            role: JSON.parse(localStorage.getItem('user')).role,
            token: JSON.parse(localStorage.getItem('user')).token
        });
    }

    const removeUserInfo = ()=>{
        localStorage.removeItem('user');
        setUser({ token: null, name: null, role: null })
    }

    const convertToDateTimeLocal = (timeStr)=>{
        let [date, time] = timeStr;
        date = date.replaceAll("/", "-");
        const [day,month,year] = date.split("-");
        return `${year}-${month}-${day}T${time}`;
      }

    const saveUserInfo = (name, role, token)=>{
        localStorage.setItem('user', JSON.stringify({
            token: token,
             name: name,
             role: role
        }))
        setUser({
            name:  JSON.parse(localStorage.getItem("user")).name,
            role:  JSON.parse(localStorage.getItem('user')).role,
            token: JSON.parse(localStorage.getItem('user')).token
        });
    }

    return (
        <AuthContext.Provider value={{user, setUser, saveUserInfo, updateUserinfo, removeUserInfo, handleLogout, navigate, formatTime, formatDate, formatTime2, convertToDateTimeLocal}}> {children} </AuthContext.Provider>
    )
}