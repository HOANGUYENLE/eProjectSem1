import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/UserContext"
import { useState } from "react"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export default function Profile(){
    const queryClient = useQueryClient();
    const {user, setUser, updateUserinfo} = useContext(AuthContext);
    const [UserData, setUserData] = useState({});
    const [err, setErr] = useState(null);
    const [formData, setFormData] = useState({
        "name": "",
        "email": "",
        "phone": "",
    });
    if(!user.token){ 
        navigate("/signup"); 
    }
    const navigate = useNavigate();
    
    async function fetchUserData(){
        const res = await axios.get("/api/profile", {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        });
        setFormData(res.data);
        return res.data;
    }

    async function updateUserData(e){
        e.preventDefault();
        try{
            const res = await axios.put("/api/profile/update", formData,{
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }})
            let role = res.data.user.role.RoleName;    
            let name = res.data.user.name;
            updateUserinfo(name, role);
            setFormData(res.data);
            queryClient.invalidateQueries(["profile", user?.token]);
            navigate("/");
        }
        catch (errors){
            if(errors.response){
                if(errors.response.status === 403 || errors.response.status === 422){
                    alert("Err " + errors.response.status + " response: " + errors.response.data.message);
                    console.log(errors.response.data);
                    setErr(errors.response.data.errors);
                }
                else{
                    console.log(errors.response);
                }
            }   
        }
    }

    const {data, error, isLoading } = useQuery({
        queryKey: ["profile", user?.token],
        queryFn: fetchUserData,
        enabled: !!user,
        refetchInterval: 1000 * 60
    });
    useEffect(()=>{
        if(error){
            setErr(error?.response?.data?.error || error.message);
        }
        else{
            setErr(null);
        }
    } , [error]);
    return (
        <>
        <div className="container py-5">
        
        <div className="row justify-content-center">
            <div className="col-lg-10">
                <div className="card shadow-sm">
                    
                    <div className="card-body p-4 p-md-5">
                    <form id="profileForm" onSubmit={updateUserData}>
                        <div className="row">
                            <div className="col-md-4 text-center mb-4 mb-md-0">
                                <div className="position-relative d-inline-block">
                                <img src="/logo/iconProfile.png" alt="Profile Picture" className="rounded-circle border border-3 border-dark shadow-sm" style={{width: 200, height: 200, objectFit: 'cover'}} />
                                </div>
                                <div className="mt-3">
                                <p className="btn btn-info"> Edit your profile </p>
                                </div>
                            </div>
                            {isLoading?
                            <div className="spinner-border"></div>:
                            <div className="col-md-8">
                                <h3 className="mb-4">Personal Information</h3>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Username</label>
                                        <input type="text" className="form-control" value={formData.name} 
                                        onChange={(e)=>{setFormData({...formData, name: e.target.value})}} required/>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Email</label>
                                        <input type="email" className="form-control" value={formData.email} 
                                        onChange={(e)=>{setFormData({...formData, email: e.target.value})}} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Phone</label>
                                        <input type="tel" className="form-control" value={formData.phone} 
                                        onChange={(e)=>{setFormData({...formData, phone: e.target.value})}} />
                                    </div>
                                </div>
                            </div>}
                        </div>
                        <div className="d-flex justify-content-center gap-3 mt-3">
                            <button type="submit" className="btn btn-primary px-5">Save Changes</button>
                            <button type="button" className="btn btn-secondary px-4">Cancel</button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
        </div>

        </>
    )
}