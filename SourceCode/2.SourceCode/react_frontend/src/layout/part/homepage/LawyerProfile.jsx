import "../../../css/lawyerprofile.css"

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { fetchDetailLawyerData, fetchSendReview} from "../../../apiComponent/apiService";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../context/UserContext";

import RatingStar from "./rating";

export default function LawyerProfile(){
    useEffect(()=>{window.scrollTo(0, 0)},[]);
    const {user, navigate, RatingCal, CountRating, DateDistanceCal, calDayAhead, formatTime} = useContext(AuthContext);
    const queryClient = useQueryClient();
    const {id} = useParams();
    const [reviewForm, setReviewForm] = useState({
        "rating": "",
        "comment": ""
    });

    const formReset = ()=>{
        setReviewForm( { rating: "", comment: "" } )
    }

    const handleSubmit = async (id)=>{
        //console.log(reviewForm);
        let response = await fetchSendReview(id, reviewForm);
        if(response){
            formReset();
            queryClient.invalidateQueries(["lawyerProfile", id]);
        }
    }
    if(!id){
        alert("You can not see a lawyer profile without let us know who is it!!!")
        navigate("/");
    }

    const queriesResults = useQueries({
        queries:[
        { queryKey: ["lawyerProfile", id],
            queryFn: fetchDetailLawyerData,
            refetchInterval: 1000 * 60,
            enabled: !!id
        }]
    });

    const Detail = queriesResults[0];

    useEffect(()=>{
        if (Detail?.data){
            console.log(Detail.data);
        }
    }, [Detail.data])

    return (
    <div className="profile">
        {!Detail.isLoading && <>
        <div className="row align-items-center mb-5 pb-5 border-bottom">
            <div className="col-md-3 col-sm-4 text-center mb-4 mb-md-0">
                <img src={Detail.data.documentImage} alt="Lawyer" className="rounded-circle border border-5 border-white shadow-lg" style={{ width: "220px", height: "220px", objectFit: "cover" }}/>
            </div>

            <div className="col-md-5 col-sm-8">
                <h1 className="display-5 fw-bold mb-2">{Detail.data.user_tb.name}</h1>
                <div className="d-flex align-items-center gap-3 mb-3">
                    <span className="text-warning fs-1"><RatingStar ratingStar={RatingCal(Detail.data.reviews)}/></span>
                    <span className="fs-4 text-muted">{RatingCal(Detail.data.reviews)} • ({Detail.data?.reviews && Detail.data.reviews.length !== 0? Detail.data.reviews.length: 0}) reviews</span>
                </div>
                <p className="text-muted fs-5 mb-2">
                    Licensed for {Detail.data.yearExp} years • {Detail.data.city.cityName}
                </p>
                <p className="text-muted fs-4">
                    Practice Areas: {Detail.data.specialization && Detail.data.specialization.length !== 0 ? 
                    Detail.data.specialization.map(each=> each.name).join(", "): "This lawyer still not register their specialization"}
                </p>
            </div>

            <div className="col-md-4 text-md-end mt-4 mt-md-0">
                <div className="d-flex flex-column gap-3">
                    <button className="btn btn-primary btn-lg p-3 fs-2" onClick={()=>navigate(`/registerAppointment/${Detail.data.lawyer_id}`)}>
                        Make Appointment
                    </button>
                </div>
            </div>
        </div>
        
        <div className="row g-5 mb-5">
            <div className="col-lg-7">
                <h4 className="fw-semibold mb-4">Specializations</h4>

                <div className="d-flex flex-wrap gap-3">
                {Detail.data.specialization && Detail.data.specialization.length !== 0?Detail.data.specialization.map((area, i) => (
                <span key={i} className="badge bg-primary fs-5 px-4 py-3 rounded-pill">
                    {area.name}
                </span>
                )):<span className="badge bg-primary fs-3 px-4 py-3 rounded-pi">Not available for now</span>}
                </div>
            </div>

            <div className="col-lg-5">
                <h4 className="fw-semibold mb-4">Working Hours</h4>
                <ul className="list-unstyled working-hours fs-3">
                    {!Detail?.data.availability || Detail?.data.availability.length === 0?<li>This Lawyer still not register their working time</li>
                    : (
                    Object.entries(
                        Detail.data.availability.reduce((acc, each) => {
                        if (!acc[each.day_of_week]) { acc[each.day_of_week] = []; }
                        acc[each.day_of_week].push( `${formatTime(each.start_time)}-${formatTime(each.end_time)}`);
                        return acc;
                        }, {})
                        ).map(([day, times]) => (
                            <li key={day}>
                            <strong>{day}:</strong> {times.join(", ")}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div></>}

        {/**Review display all section*/}
        {!Detail.isLoading? 
        <div className="reviews-section">
            <div className="reviews-section mt-5">
            <div className="bg-light rounded-4 p-4 mb-5 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                    <h5 className="mb-1 fw-semibold fs-3">Have you consulted or hired this lawyer before?</h5>
                    <p className="text-muted mb-0 fs-3">Leave a review for your experience with this lawyer.</p>
                </div>
                {/**Create new Comment button*/}
                {user.token && 
                <button className="btn btn-secondary fs-3 px-5 py-3 d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target={`#ReviewModal-${Detail.data.lawyer_id}`}>
                <i className="bi bi-pencil-square"></i>Write a Review</button>
                }
            </div>
            <div className="modal" id={`ReviewModal-${Detail.data.lawyer_id}`} tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fs-1 fw-bolder" id={`ReviewModalLabel-${Detail.data.lawyer_id}`}>Leave Your Comment here!</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" 
                            onClick={formReset}/>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="star-rating myreview mb-5">
                                    <input type="radio" id="s5" name="rate" value={5} checked={reviewForm.rating === "5"} 
                                    onChange={(e)=>setReviewForm({...reviewForm, rating: e.target.value})}/><label htmlFor="s5">★</label>
                                    <input type="radio" id="s4" name="rate" value={4} checked={reviewForm.rating === "4"} 
                                    onChange={(e)=>setReviewForm({...reviewForm, rating: e.target.value})}/><label htmlFor="s4">★</label>
                                    <input type="radio" id="s3" name="rate" value={3} checked={reviewForm.rating === "3"} 
                                    onChange={(e)=>setReviewForm({...reviewForm, rating: e.target.value})}/><label htmlFor="s3">★</label>
                                    <input type="radio" id="s2" name="rate" value={2} checked={reviewForm.rating === "2"} 
                                    onChange={(e)=>setReviewForm({...reviewForm, rating: e.target.value})}/><label htmlFor="s2">★</label>
                                    <input type="radio" id="s1" name="rate" value={1} checked={reviewForm.rating === "1"} 
                                    onChange={(e)=>setReviewForm({...reviewForm, rating: e.target.value})}/><label htmlFor="s1">★</label>
                                </div>

                                <div>
                                    <textarea rows={4} placeholder="Your Comment" name="comment" value={reviewForm.comment || ""} onChange={(e)=>{
                                    setReviewForm({...reviewForm, comment:e.target.value})}} rows={4} className=" fs-2 w-100 p-2"></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer d-flex justify-content-center">
                        
                        <button type="button" className="btn btn-success fs-2" data-bs-dismiss="modal" onClick={()=>handleSubmit(id)}>Submit</button>
                        <button type="button" className="btn btn-secondary fs-2" data-bs-dismiss="modal" onClick={formReset}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
            {/**Review display star section*/}
            <div className="row g-5 mb-5">
                <div className="col-lg-5 d-flex justify-content-center align-items-center">
                    <div className="text-center text-lg-start">
                        <h4 className="fw-semibold mb-3">Client Reviews</h4>
                        <div className="d-flex flex-column align-items-center">
                            <h3 className="display-1 fw-bold text-warning mb-0 fs-1">{`${RatingCal(Detail.data.reviews)}`}/5.0</h3>
                            <div className="d-flex flex-column justify-content-center fs-2">
                                <RatingStar ratingStar={RatingCal(Detail.data.reviews)}/>
                                <small className="text-muted text-center ">{Detail.data.reviews.length} reviews</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Rating Breakdown with Progress Bars */}
                <div className="col-lg-7">
                    <h5 className="mb-4 fs-1 text-center">Rating Breakdown</h5>
                    <div className="review-breakdown">
                        <div className="d-flex align-items-center gap-3 mb-3 fs-3">
                            <span className="text-nowrap" style={{width: "60px"}}>5 stars</span>
                            <div className="flex-grow-1">
                                <div className="progress" style={{height: "12px"}}>
                                    <div className="progress-bar bg-warning" style={{width: `${CountRating(5, Detail.data.reviews).percent}%`}}></div>
                                </div>
                            </div>
                            <span className="text-muted text-nowrap">{`${CountRating(5, Detail.data.reviews).sum}`}</span>
                        </div>

                        <div className="d-flex align-items-center gap-3 mb-3 fs-3">
                        <span className="text-nowrap" style={{width: "60px"}}>4 stars</span>
                        <div className="flex-grow-1">
                            <div className="progress" style={{height: "12px"}}>
                            <div className="progress-bar bg-warning" style={{width: `${CountRating(4, Detail.data.reviews).percent}%`}}></div>
                            </div>
                        </div>
                        <span className="text-muted text-nowrap">{`${CountRating(4, Detail.data.reviews).sum}`}</span>
                        </div>

                        <div className="d-flex align-items-center gap-3 mb-3 fs-3">
                        <span className="text-nowrap" style={{width: "60px"}}>3 stars</span>
                        <div className="flex-grow-1">
                            <div className="progress" style={{height: "12px"}}>
                            <div className="progress-bar bg-warning" style={{width: `${CountRating(3, Detail.data.reviews).percent}%`}}></div>
                            </div>
                        </div>
                        <span className="text-muted text-nowrap">{`${CountRating(3, Detail.data.reviews).sum}`}</span>
                        </div>

                        <div className="d-flex align-items-center gap-3 mb-3 fs-3">
                        <span className="text-nowrap" style={{width: "60px"}}>2 stars</span>
                        <div className="flex-grow-1">
                            <div className="progress" style={{height: "12px"}}>
                            <div className="progress-bar bg-warning" style={{width: `${CountRating(2, Detail.data.reviews).percent}%`}}></div>
                            </div>
                        </div>
                        <span className="text-muted text-nowrap">{`${CountRating(2, Detail.data.reviews).sum}`}</span>
                        </div>

                        <div className="d-flex align-items-center gap-3 fs-3">
                        <span className="text-nowrap" style={{width: "60px"}}>1 star</span>
                        <div className="flex-grow-1">
                            <div className="progress" style={{height: "12px"}}>
                            <div className="progress-bar bg-warning" style={{width: `${CountRating(1, Detail.data.reviews).percent}%`}}></div>
                            </div>
                        </div>
                        <span className="text-muted text-nowrap">{`${CountRating(1, Detail.data.reviews).sum}`}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/**Review display comment section*/}
            <div className="row g-4">
                {Detail.data.reviews.map((each)=>{
                    return (
                        <div className="col-12" key={each.id}>
                            <div className="card shadow-sm border-1">
                            <div className="card-body p-4 p-lg-5">
                                <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <strong className="fs-2">{each.user_tb.name}</strong>
                                    <small className="text-muted d-block fs-4 mt-1">{`${DateDistanceCal(each.created_at)}`}</small>
                                </div>
                                <RatingStar ratingStar={each.rating}/>
                                </div>
                                <p className="fs-1 mt-4 lh-base">
                                    {each.comment}
                                </p>
                            </div>
                            </div>
                        </div>
                    )
                })}
                
            </div>

            <div className="text-center mt-5">
                <button className="btn btn-outline-primary px-5 py-3 fs-5">Load More Reviews</button>
            </div>
        </div>
        </div>: <div className="spinner-border"></div>}
    </div>
    )}