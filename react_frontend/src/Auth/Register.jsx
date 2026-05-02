import { useState } from "react"
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/signup.css"
import { useNavigate } from "react-router-dom";

export default function Register(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        "name": "",
        "email": "",
        "phone": "",
        "password": "",
        "password_confirmation": "",
    });
    const [err, setErr] = useState({})
    async function handleRegister(e){
        e.preventDefault();
        try{
            const res = await axios.post("/api/register", formData, {timeout: 10000});
            console.log("User Data: ", res.data, res.data.user, res.data.token);
            let role = res.data.user.role.roleNamme;
            let name = res.data.user.name;
            let token = res.data.token;
            
        }
        catch (errors){
            if(errors.response){
                if(errors.response.status === 422){
                    alert("Err " + errors.response.status + " response: " + errors.response.data.message);
                    setErr(errors.response.data.errors);
                    console.log(errors.response.data.errors)
                    console.log(err.name[0]); 
                }
                else if (err.response.status === 403){
                    alert("Err " + err.response.status + " response: This user existed");
                    setErr(err.response.data.errors);
                }
            }   
        }
    };

    return (
    <div className="container w-50 mt-5">
        <h1 className="text-center">Register Form</h1>
        <form className=" ms-auto me-auto" onSubmit={handleRegister} method="post">
            <div className="form-group">
                <label htmlFor="email">Email address: </label>
                <input type="email" className="form-control" id="email" placeholder="Enter your email address" value={formData.email} autoComplete="on"
                onChange={(e)=>setFormData({...formData, email: e.target.value})}/>
                {err.email && <div class="alert alert-danger" role="alert">{err.email[0]}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="name">Username: </label>
                <input type="text" className="form-control" id="name" placeholder="Enter name" value={formData.name} autoComplete="on"
                onChange={(e)=>setFormData({...formData, name: e.target.value})}/>
                {err.name && <div class="alert alert-danger" role="alert"> {err.name[0]}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="phone">Phone: </label>
                <input type="tel" className="form-control" id="phone" placeholder="Enter name" value={formData.phone} autoComplete="on"
                onChange={(e)=>setFormData({...formData, phone: e.target.value})}/>
                {err.phone && <div class="alert alert-danger" role="alert"> {err.phone}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password" value={formData.password}
                onChange={(e)=>setFormData({...formData, password: e.target.value})}/>
            </div>

            <div className="form-group">
                <label htmlFor="password_confirmation">Password confirmation</label>
                <input type="password" className="form-control" id="password_confirmation" placeholder="Password comfirmation" value={formData.password_confirmation}
                onChange={(e)=>setFormData({...formData, password_confirmation: e.target.value})}/>
                {err.password &&  <div class="alert alert-danger" role="alert"> {err.password}</div>}
            </div>
            <div className="form-group d-flex justify-content-center gap-5">
                <button type="submit" className="btn btn-primary m-1">Submit</button>
                <button type="button" className="btn btn-danger m-1" onClick={()=>navigate("/")}>Cancel</button>
            </div>
        </form>
    </div>
)}