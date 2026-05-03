import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useEffect } from "react"
import axios from "axios";

export default function Login(){
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
        }
        catch (errors){
            if(errors.response){
                console.log(errors.response.data);
            }   
        }
    };

    return (<>
    <form onSubmit={(e)=>handleLogin(e)}>
        <div className="mb-3 mt-3">
        <label htmlFor="name" className="form-label">Username:</label>
        <input type="text" className="form-control" id="name" placeholder="Enter username" name="name" 
        value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})}/>
        </div>
        <div className="mb-3">
        <label htmlFor="password" className="form-label">Password:</label>
        <input type="password" className="form-control" id="password" placeholder="Enter password" name="password"
        value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})}/>
        </div>
        <button type="submit" className="btn btn-primary w-100">Submit</button>
    </form>
    </>)
}