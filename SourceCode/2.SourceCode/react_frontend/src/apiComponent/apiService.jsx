import { apiAuth, apiPublic } from "./apiEndPoint";

export async function fetchLawyerData(){
    const res = await apiPublic.get("/allLawyers");
    let arr = res.data.map(lawyer=>{
    return {
        id: lawyer.user_tb.id,
        name: lawyer.user_tb.name,
        email: lawyer.user_tb.email,
        address: lawyer.address,
        city: lawyer.city,
        image: lawyer.documentImage || null,
        specialization: Array.isArray(lawyer.specialization) && lawyer.specialization.length > 0 ? lawyer.specialization.map(spec=>{ return spec.name }):  null,
        status: lawyer.status,
        years: lawyer.yearExp,
        availability: Array.isArray(lawyer.availability) && lawyer.availability.length > 0 
        ? lawyer.availability.map(each=>{ 
            return {
                day_of_week: each.day_of_week,
                start_time: each.start_time,
                end_time: each.end_time,
                is_booked: each.is_booked
            } 
        }) : null,
    }});
    return arr;
}

export async function fetchSpecData(){
    const res = await apiPublic.get("/allSpecs");
    if (!res.data) {
        return []; 
    }
    return res.data
};

export async function ConfirmLawyerFile(lawyer_id, content){
    try{
        const res = await apiAuth.put(`/confirmDocument/${lawyer_id}`, content);
        if(res.data){
            return res.data.success
        }
    }
    catch (err){
        alert(err.message);
        return false
    }
}

export async function fetchUserData(){
    const res = await apiAuth.get("/allUsers");
    return res.data;
}

export async function fetchAppointmentData({queryKey}){
    const [keyName, year] = queryKey;
    const res = await apiAuth.get(`/allAppointment/${year}`)
    return res.data;
}

export async function fetchFAQ(){
    const res = await apiAuth.get("/faq");
    return res.data;
}

export async function fetchSubmitFAQ(id, content){
    try{
        const res = await apiAuth.put(`/faq/${id}`, content);
        if(res.data){
            return true;
        }
    }
    catch(err){
        console.log(err);
        alert(err.message);
    }
    return false;
}

export async function fetchDestroyFAQ(id){
    try{
        const res = await apiAuth.delete(`/faq/${id}`);
        if(res.data){ return true }
    }
    catch(err){
        console.log(err);
        alert(err.message);
    }
    return false;
}

export async function fetchSystemNotification(){
    const res = await apiPublic.get("/SysNotice");
    return res.data;
}

export async function fetchUpdateSystemNotification(postID, content){
    try{
        const res = await apiAuth.put(`/SysNotice/${postID}`, content);
        if(res.data){
            //console.log(res.data)
            alert(res.data.message);
        }
    }
    catch(err){
        console.log(err);
        alert(err.message);
    }
}

export async function fetchDeleteSystemNotification(postID){
    try{
        const res = await apiAuth.delete(`/SysNotice/${postID}`);
        if(res.data){
            return true;
        }
    }
    catch(err){
        alert(err.message);
    }
    return false;
}