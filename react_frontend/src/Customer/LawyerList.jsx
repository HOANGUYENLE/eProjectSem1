import "../css/form.css"
import RatingStar from "../layout/part/homepage/rating"

import { useContext } from "react"
import { AuthContext } from "../context/UserContext"
import { useQueries} from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { fetchLawyerData, fetchSpecData } from "../apiComponent/apiService"
import { useParams } from "react-router-dom"
export default function LawyerList(){
    const {user, navigate, RatingCal, CountRating, DateDistanceCal} = useContext(AuthContext);
    const [currentArea, setCurrentArea] = useState("all");

    const [rawLawyers, setRawLawyers] = useState([]);
    const [displayLawyers, setDisplayLawyers] = useState([]);

    const [orderBy, setOrderBy] = useState("rating");
    const {city} = useParams();
    const queriesResults = useQueries({
        queries:[
        { queryKey: ["lawyer"],
            queryFn: fetchLawyerData,
            refetchInterval: 1000 * 60,
        },
        { queryKey: ["specs"],
            queryFn: fetchSpecData,
            refetchInterval: 1000 * 60
        },
        ]
    });
    const LawyersData = queriesResults[0];
    const SpecsData = queriesResults[1];

    useEffect(()=>{
        if(LawyersData?.data){
            let temp = filterLawyerData(currentArea, city, LawyersData.data);
            setRawLawyers(temp);
            setDisplayLawyers(sortByRatingExp(orderBy, temp));
        }
        if(SpecsData?.data){
            //console.log(SpecsData.data);
        }
    },[LawyersData.data, SpecsData.data, currentArea, city]);
    

    useEffect(() => {
        setDisplayLawyers(sortByRatingExp(orderBy, rawLawyers));
    }, [orderBy, rawLawyers]);

    const sortByRatingExp = (required, arrData) => {
        let newArrData = [];
        if (required === "rating") {
            newArrData = [...arrData].sort(
            (a, b) => RatingCal(b.reviews) - RatingCal(a.reviews)
            );
        } else if (required === "experience") {
            newArrData = [...arrData].sort((a, b) => b.years - a.years);
        }
        return newArrData;
    };

    const filterLawyerData = (area, requiredCity, data)=>{
        let temp = data || [];

        if (requiredCity && LawyersData?.data){
            temp = temp.filter(each=>{return each.city.cityName === requiredCity})
        }
        
        if (area !== "all"){
            temp = temp.filter(each=>{
                if(each.specialization){
                    return each.specialization.includes(area);
                }
                return false;
            })
        }
        return temp;
    }

    return (
    <div className="container py-5 lawyerfile">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 className="mb-1">List of Lawyer</h1>
            </div>
            <div className="d-flex align-items-center gap-3">
            <span className="text-muted fs-2">Sort by:</span>
            <select className="form-select w-auto fs-2" style={{minWidth: 180}} 
            value={`${orderBy}`} onChange={(e)=>setOrderBy(e.target.value)}>
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
            </select>
            </div>
        </div>
        
       <div className="mb-5">
            <h5 className="mb-3">Narrow Results by Practice Area</h5>
            <div className="d-flex flex-wrap gap-3" id="practiceAreas">
                {SpecsData.isLoading ? (
                <div className="spinner-border"></div>
                ) : (
                <>
                    {SpecsData.data
                    .filter(each => each.lawyers.length > 0)
                    .map(eachItem => (
                        <button
                        key={eachItem.id}
                        onClick={()=>{ 
                            setCurrentArea(eachItem.name)}}
                        className={"btn fs-3 p-3 m-3 rounded-pill shadow-sm " + (currentArea === eachItem.name?"active":"")}
                        >
                        {eachItem.name}
                        </button>
                    ))}
                    <button onClick={()=>{
                        setCurrentArea("all");
                    }}
                    className={"btn fs-3 p-3 m-3 rounded-pill shadow-sm " + (currentArea === "all"?"active":"")} >
                        All Areas
                    </button>
                </>
                )}
                
            </div>
        </div>
        {LawyersData.isLoading? <div className="spinner-border"></div>:
        <>
        <hr />
        <div className="row g-4" id="lawyerList">
            <div className="col-12">
            <div className="card h-100 shadow-sm border-0 overflow-hidden">
                <div className="card-body p-4">
                    {displayLawyers?.filter(each=>{ return each.status === "approve"; }).map((eachItem)=>{
                        return (
                            <div className="row align-items-center">
                            <div className="col-md-2 col-sm-3 text-center mb-3 mb-md-0">
                                <img src={eachItem.image} alt="Lawyer" className="rounded-circle border border-3 border-white shadow" style={{width: 130, height: 130, objectFit: 'cover'}} />
                            </div>
                        {/* Info */}
                            <div className="col-md-6 col-sm-9">
                                <h4 className="mb-1 fs-1">{eachItem.name}</h4>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <RatingStar  ratingStar={RatingCal(eachItem.reviews)}/>
                                    <span className="text-muted fs-3">{RatingCal(eachItem.reviews)} • {eachItem.reviews.length} reviews</span>
                                </div>
                                
                                <p className="mb-2 text-muted small fs-4">
                                    Licensed for {eachItem.years} years 
                                    
                                </p>
                                {eachItem.specialization?.length > 0 && 
                                <p className="mb-2 text-muted small fs-4">Practice Areas  
                                {eachItem.specialization.join(", ").length > 30 ? ": " + eachItem.specialization.join(", ").slice(0, 30) + "..." : ": " +eachItem.specialization.join(", ")}</p>}
                                <p className="text-muted mb-0 fs-5">
                                    "Don't trust your future to a general practitioner. Call an expert today."
                                </p>
                            </div>
                         <div className="col-md-4 text-end">
                            <div className="mb-3 d-flex justify-content-center gap-4">
                                <button className="btn btn-outline-primary w-50 fs-2" onClick={()=>navigate(`/registerAppointment/${eachItem.id}`)}>
                                    Make Appointment
                                </button>
                                <button className="btn btn-outline-info w-50 fs-2" onClick={()=>navigate(`/lawyerProfile/${eachItem.id}`)}>
                                    View Profile
                                </button>
                                
                            </div>
                        </div>
                    </div>
                        )
                    })}
                </div>
            </div>
            </div>
        </div>
        </>}
       
    </div>
    )   
}