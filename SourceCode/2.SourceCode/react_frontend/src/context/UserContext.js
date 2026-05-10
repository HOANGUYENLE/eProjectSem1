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

    const calDayAhead = (dayofWeek, fromDate = null)=>{
        const weekDayMap = {
            Sun: 0,
            Mon: 1,
            Tue: 2,
            Wed: 3,
            Thu: 4,
            Fri: 5,
            Sat: 6
        };

        let today;

        if(fromDate === null){ 
            today = new Date();
        }
        else{ 
            today = new Date(fromDate); 
        }
        const currentDayOfWeek = today.getDay();
        let dayAhead = (weekDayMap[dayofWeek] - currentDayOfWeek + 7) % 7;
        if(dayAhead === 0){ dayAhead = 7; }
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + dayAhead);
        return nextDay.toLocaleDateString("en-US",{
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }


    const DateDistanceCal = (timeStr)=>{
        const mydate = new Date(timeStr);
        const distance = Date.now() - mydate.getTime();

        const seconds = Math.floor(distance / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours/24);
        const weeks = Math.floor(days/7);
        const months = Math.floor(weeks/4);
        const years = Math.floor(months/12);
        
        if (seconds < 60) {
            return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
        } else if (minutes < 60) {
            return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        } else if (hours < 24) {
            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else if (days < 7) {
            return `${days} day${days > 1 ? "s" : ""} ago`;
        } else if (weeks < 4) {
            return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
        } else if (months < 12) {
            return `${months} month${months > 1 ? "s" : ""} ago`;
        }
        return `${years} year${years > 1 ? "s" : ""} ago`;
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

    const RatingCal = (arrReviews) => {
        if (!arrReviews || arrReviews.length === 0) return 0;
        return (
            arrReviews.reduce((acc, currentItem)=>{
            return acc + currentItem.rating 
        }, 0) / arrReviews.length).toFixed(1);
    }

    const CountRating = (targetStar, arrReviews) =>{
        let sum = (arrReviews.reduce((acc, currentItem)=>{
            if(currentItem.rating === targetStar){
                return acc + 1;
            }
            return acc;
        }, 0));
        return {
            "percent": sum.toFixed(1) * 100/arrReviews.length,
            "sum": sum
        };
    }

    return (
        <AuthContext.Provider value={{DateDistanceCal,CountRating,RatingCal,calDayAhead,user, setUser, saveUserInfo, updateUserinfo, removeUserInfo, handleLogout, navigate, formatTime, formatDate, formatTime2, convertToDateTimeLocal}}> {children} </AuthContext.Provider>
    )
}