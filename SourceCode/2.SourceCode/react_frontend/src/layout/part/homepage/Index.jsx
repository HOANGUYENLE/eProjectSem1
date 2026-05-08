
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import RatingStar from "./rating"

import { useContext } from "react"
import { AuthContext } from "../../../context/UserContext"
import { useQueries} from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { fetchCityData, fetchLawyerData } from "../../../apiComponent/apiService"


export default function HomepageIndex(){
    const {user, navigate, RatingCal} = useContext(AuthContext);
    const queriesResults = useQueries({
          queries:[
            { queryKey: ["City"],
              queryFn: fetchCityData,
              refetchInterval: 1000 * 60,
            },
            { queryKey: ["lawyer"],
              queryFn: fetchLawyerData,
              refetchInterval: 1000 * 60,
            },
          ]
        });
    const CityData = queriesResults[0];
    const LawyersData = queriesResults[1];
    if(LawyersData.data){
      //console.log(LawyersData.data);
    }

    const starRatingCal = (ratingVal) =>{
      const full = Math.floor(ratingVal);
      const half = ratingVal % 1 >= 0.5;
      const empty = (5 - full - (half ? 1 : 0));
      return [full, half, empty];
    }
    return (<>
        <div className="home">
        <Swiper
          modules={[Navigation]}
          navigation
          loop={true}
          className="myHome"
        >
          {/* SLIDE 1 */}
          <SwiperSlide>
            <div className="slide slide-one d-flex align-items-center">
              <div className="col-6">
                <h4>Welcome to LegalEase!</h4>
                <h1>
                  Best way to find your <span>trusted</span> lawyer
                </h1>
                <p>
                  Find your dream lawyer by comparing profiles, exploring expertise,
                  and choosing what fits your needs.
                </p>
              </div>

              <div className="col-6 text-center">
                <img src="/homepage/1.avif" alt="" className="img-fluid" />
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 2 */}
          <SwiperSlide>
            <div className="slide slide-two d-flex align-items-center">
              <div className="col-6">
                <h4>Welcome to LegalEase!</h4>
                <h1>
                  Discover your <span>perfect</span> lawyer
                </h1>
                <p>
                  Explore trusted lawyers and connect with the best legal professionals for your needs.
                </p>
              </div>

              <div className="col-6 text-center">
                <img src="/homepage/2.jpg" alt="" className="img-fluid" />
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 3 */}
          <SwiperSlide>
            <div className="slide slide-three d-flex align-items-center">
              <div className="col-6">
                <h4>Welcome to LegalEase!</h4>
                <h1>
                  Drive your <span>passion</span>
                </h1>
                <p>
                  Choose the best lawyer that matches your needs and budget.
                </p>
              </div>

              <div className="col-6 text-center">
                <img src="/homepage/3.webp" alt="" className="img-fluid" />
              </div>
            </div>
          </SwiperSlide>

        </Swiper>
      </div>
        <section className="arrivals p-3">
        <h1>LegalEase's Lawyers</h1>

        <div className="arr-row">
            {LawyersData.isLoading? <div className="spinner-border"></div>:
              LawyersData.data.filter(each => each.status === "approve" && each.specialization?.length > 0).slice(0,4).map((each)=>{
                  return (
                    <div className="arr-col" key={each.id}>
                    <div className="image">
                      <img src={each.image} alt="image doc" />
                    </div>
                    <h5>{each.name}</h5>
                    <div className="rating">
                      <RatingStar ratingStar={RatingCal(each.reviews)}/>
                      <div className="review"><span>
                        {`${RatingCal(each.reviews)}`}
                        ({each.reviews.length} reviews)</span></div>
                    </div>
                    <div className="features">
                        <span><i className='bx bx-briefcase'></i>{each.specialization[0]}</span>
                        <span><i className='bx bx-map'></i>{each.city.cityName}</span>
                        <span><i className='bx bx-time'></i>{each.years} years experience</span>
                        <span><i className='bx bx-check-shield'></i>Licensed</span>
                        <button><Link to={`/lawyerProfile/${each.id}`} className="nav-link fs-4 text-white">View Profile</Link></button>
                    </div>
                  </div>)
              })
            }
        </div>

        </section>
    
    </>)
}