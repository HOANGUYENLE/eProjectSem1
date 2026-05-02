import { createContext, useState } from "react";

export const AuthContext = new createContext();
export default function UserInfoProvider({children}){
    const auth = JSON.parse(localStorage.getItem('user')) || {};
    const [user, setUser] = useState({
        name: auth.name || null,
        role: auth.role || null,
        token: auth.token||null
    })

    const saveUserInfo = (name, role, token)=>{
        localStorage.setItem('user', JSON.stringify({
            token: token,
             name: name,
             role: role
        }))
        setUser({
            name: localStorage.getItem('user').name,
            role: localStorage.getItem('user').role,
            token: localStorage.getItem('user').token
        });
    }

    return (
        <AuthContext.Provider value={{user, setUser, saveUserInfo}}> {children} </AuthContext.Provider>
    )
}