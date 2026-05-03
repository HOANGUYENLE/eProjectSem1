import { createContext, useState } from "react";

export const AuthContext = new createContext();
export default function UserInfoProvider({children}){
    const auth = JSON.parse(localStorage.getItem('user')) || {};
    const [user, setUser] = useState({
        name: auth.name || null,
        role: auth.role || null,
        token: auth.token||null
    })

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
        <AuthContext.Provider value={{user, setUser, saveUserInfo, updateUserinfo, removeUserInfo}}> {children} </AuthContext.Provider>
    )
}