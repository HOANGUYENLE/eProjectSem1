import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";

export default function LawyerProtection({children}){
    const {user} = useContext(AuthContext);
    if(!user?.token || user.role !== "lawyer"){
        return <Navigate to="/" replace/>
    }
    return children;
}