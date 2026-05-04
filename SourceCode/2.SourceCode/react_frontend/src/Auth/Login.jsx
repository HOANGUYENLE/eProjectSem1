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
        "name": "",
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
            saveUserInfo(name, role, token);
            console.log(role, name, token);
        }
        catch (errors){
            if(errors.response){
                console.log(errors.response.data);
            }   
        }
    };

    return (<>
    <form className="login" onSubmit={(e)=>handleLogin(e)}>
        <div className="mb-3 mt-3 fs-1">
            <label htmlFor="name" className="form-label fs-2">Username:</label>
            <input type="text" className="form-control fs-2" id="name" placeholder="Enter username" name="name" 
                value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})}/>
        </div>

        <div className="mb-3 fs-1">
            <label htmlFor="password" className="form-label fs-2">Password:</label>
            <input type="password" className="form-control fs-2" id="password" placeholder="Enter password" name="password"
                value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})}/>
        </div>
        <button type="submit" className="btn btn-primary w-100 d-block mt-4 mb-4" data-bs-toggle="modal" data-bs-target="#SigninBtn" onClick={()=>navigate("/")}>Submit</button>
    </form>
    </>)
}