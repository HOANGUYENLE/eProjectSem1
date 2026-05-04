import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";

export default function AdminProtection({children}){
    const {user} = useContext(AuthContext);
    if(!user?.token || user.role !== "admin"){
        return <Navigate to="/" replace/>
    }
    return children;
}