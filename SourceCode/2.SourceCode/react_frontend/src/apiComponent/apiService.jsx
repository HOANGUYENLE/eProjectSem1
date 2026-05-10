import { apiAuth, apiPublic } from "./apiEndPoint";

export async function fetchLawyerData(){
    const res = await apiPublic.get("/allLawyers");
    let arr = res.data.map(lawyer=>{
    return {
        id: lawyer.user_tb.id,
        name: lawyer.user_tb.name,
        email: lawyer.user_tb.email,
        address: lawyer.address,
        reviews: lawyer.reviews,
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

export async function fetchDetailLawyerData({queryKey}){
    const [name, lawyerId] = queryKey;
    const res = await apiPublic.get(`/lawyerProfile/${lawyerId}`);
    return res.data;
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

export async function fetchUserData(page, perPage){
    const res = await apiAuth.get("/allUsers", {
        params:{ page: page, per_page: perPage }
    });
    return res.data;
}

export async function fetchAppointmentData({queryKey}){
    const [keyName, year] = queryKey;
    const res = await apiAuth.get(`/allAppointment/${year}`)
    return res.data;
}

export async function fetchRegisterAppointment(content){
    try{
        const res = await apiAuth.post(`/booking`, content);
        if(res.data){
            console.log(res.data)
            return true;
        }
    }
    catch(err){
        console.log(err);
        alert(err.message);
    }
    return false;
}

export async function fetchTakeAppointment(){
    const res = await apiAuth.get("/booking/seeBooking");
    return res.data;
}


export async function fetchSingleAppointment(AppointmentID){
    const res = await apiAuth.get(`/booking/seeBooking/${AppointmentID}`);
    return res.data;
}

export async function fetchRegisterReschedule(status, content = {}){
    try{
        const res = await apiAuth.post(`/updateBooking/${status}`, content);
        if(res.data){
            console.log(res.data)
            return true;
        }
        return false;
    }
    catch(err){
        console.log(err);
        alert(err.message);
    }
    return false;
}

export async function fetchFAQ(){
    const res = await apiAuth.get("/faq");
    return res.data;
}

export async function fetchFAQPaginate(page, perPage){
    const res = await apiAuth.get("/faq/page", {
        params:{ page: page, per_page: perPage }
    });
    return res.data;
}

export async function fetchPostFAQ(content){
    try{
        const res = await apiAuth.post(`/faq`, content);
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

export async function fetchCreateSystemNotification(payload) {
  try {
    const res = await apiAuth.post("/SysNotice", payload);
    if (res.data) {
      return res.data;
    }
  } catch (err) {
    alert(err.message);
  }
  return false;
}

export async function fetchDeleteManySysNotification({ids}){
    try{
        const res = await apiAuth.delete("/delSysNotices", {data: {ids}});
        if (res.data){
            console.log(res.data);
            //alert(res.data.success);
            return res.data
        }
    }
    catch(err){
        alert(err.message)
    }
    return false
}

export async function fetchCityData(){
    try{
        const res = await apiPublic.get("/listCity");
        if (res.data){
            //console.log(res.data);
            return res.data;
        }
    } catch(err){
        alert(err.message);
        console.log(err);
    }
    return [];
}

export async function fetchSendReview(id, content){
    try{
        const res = await apiAuth.post(`/lawyer/${id}/reviews`,  content);
        if(res.data){
            console.log(res.data);
            return true
        }
    }
    catch(err){
        alert(err.message);
    }
    return false
}

export async function fetchReminder(){
    const res = await apiAuth.get("/callReminder");
    return res.data;
}

export async function fetchConfimRead(id){
    try{
        const res = await apiAuth.post(`/ReadCancel/${id}`);
        if(res.data){
            return res.data;
        }
    }
    catch(err){
        alert(err.message);
    }
    return false   
}
