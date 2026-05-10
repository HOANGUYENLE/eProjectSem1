import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useEffect } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const navigate = useNavigate();
    const {user, setUser, saveUserInfo} = useContext(AuthContext);
    const [formData, setFormData] = useState({
        "email": "",
        "password": "",
    });
    const [err, setErr] = useState({})
    async function handleLogin(e){
        e.preventDefault();
        try{
            const res = await axios.post("/api/login", formData, {timeout: 10000});
            console.log("User Data: ", res.data.user, res.data.token);
            let role = res.data.user.role.RoleName;    
            let name = res.data.user.name;
            let token = res.data.token;
            await saveUserInfo(name, role, token);
            if(res.data){
                alert("Login Successfully");
                navigate("/");
            }
        }
        catch (errors){
            if(errors.response){
                alert(`Error ${errors.response.status}: ${errors.response.data.message || "Unexpected error"}`);
            }   
        }
    };

    return (<>
    <div className="container w-50 mt-5 register">
        <h1 className="text-center">Login your account</h1>
        <form className="login" onSubmit={(e)=>handleLogin(e)}>
            <div className="form-group">
                <label htmlFor="name" className="form-label fs-2">User Email address:</label>
                <input type="text" className="form-control fs-2" id="name" placeholder="Enter user email address" name="email" 
                    value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})}/>
            </div>

            <div className="form-group">
                <label htmlFor="password" className="form-label fs-2">Password:</label>
                <input type="password" className="form-control fs-2" id="password" placeholder="Enter your password" name="password"
                    value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})}/>
            </div>
            
            <div className="mt-2 mb-5">
                <a role="button" className="nav-link fs-2 text-end" onClick={()=>navigate("/signup")}>Don't have account? Let sign up</a>
            </div>
            <div className="form-group d-flex justify-content-center gap-5">
                <button type="submit" className="btn btn-primary m-1">Submit</button>
                <button type="button" className="btn btn-danger m-1" onClick={()=>navigate("/")}>Cancel</button>
            </div>
        </form>
        
    </div>
    </>)
}