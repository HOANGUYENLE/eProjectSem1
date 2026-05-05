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