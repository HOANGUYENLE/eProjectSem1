import { Outlet } from "react-router-dom"
import Nav from "./part/homepage/Nav"
import { Swiper, SwiperSlide } from "swiper/react"
import Footer from "./part/homepage/Footer"

import "../css/home/header.css"
import "../css/home/home.css"
import "../css/home/arrivals.css"
import "../css/home/search.css"


export default function LayoutHomePage(){
    //<News notifications={notifications} />
    
    return(
    <>
    <Nav/>
    <section className="arrivals">
    <h1>Lawyer profiles</h1>

    <div className="arr-row">
        <div className="arr-col">
        <div className="image">
            <img src="/lawyerDummyFile/chris_grocock.jpg" alt="Chris Grocock" />
        </div>
        <h5>Chris Grocock</h5>
        <div className="rating">
            <div className="star">
            <i className='bx bxs-star'></i><i className='bx bxs-star'></i>
            <i className='bx bxs-star'></i><i className='bx bxs-star'></i>
            <i className='bx bxs-star-half'></i>
            </div>
            <div className="review"><span>4.8 (1.2k Reviews)</span></div>
        </div>
        <div className="features">
            <span><i className='bx bx-briefcase'></i>Criminal Law</span>
            <span><i className='bx bx-map'></i>Ho Chi Minh City</span>
            <span><i className='bx bx-time'></i>15+ years experience</span>
            <span><i className='bx bx-check-shield'></i>Licensed</span>
            <button>View Profile</button>
        </div>
        </div>

        {/* Lawyer 2 */}
        <div className="arr-col">
        <div className="image">
            <img src="/lawyerDummyFile/robert_richter.png" alt="Robert Richter" />
        </div>
        <h5>Robert Richter</h5>
        <div className="rating">
            <div className="star">
            <i className='bx bxs-star'></i><i className='bx bxs-star'></i>
            <i className='bx bxs-star'></i><i className='bx bxs-star'></i>
            <i className='bx bxs-star-half'></i>
            </div>
            <div className="review"><span>4.9 (2.5k Reviews)</span></div>
        </div>
        <div className="features">
            <span><i className='bx bx-briefcase'></i>Corporate Law</span>
            <span><i className='bx bx-map'></i>Hà Nội</span>
            <span><i className='bx bx-time'></i>12 years experience</span>
            <span><i className='bx bx-check-shield'></i>Licensed</span>
            <button>View Profile</button>
        </div>
        </div>

        {/* Lawyer 3 */}
        <div className="arr-col">
        <div className="image">
            <img src="/lawyerDummyFile/roy_black.jpeg" alt="Roy Black" />
        </div>
        <h5>Roy Black</h5>
        <div className="rating">
            <div className="star">
            <i className='bx bxs-star'></i><i className='bx bxs-star'></i>
            <i className='bx bxs-star'></i><i className='bx bxs-star'></i>
            <i className='bx bxs-star-half'></i>
            </div>
            <div className="review"><span>4.7 (900 Reviews)</span></div>
        </div>
        <div className="features">
            <span><i className='bx bx-briefcase'></i>Litigation</span>
            <span><i className='bx bx-map'></i>Ho Chi Minh City</span>
            <span><i className='bx bx-time'></i>20+ years experience</span>
            <span><i className='bx bx-check-shield'></i>Licensed</span>
            <button>View Profile</button>
        </div>
        </div>

        {/* Lawyer 4 */}
        <div className="arr-col">
        <div className="image">
            <img src="/lawyerDummyFile/william_lerach.jpeg" alt="William Lerach" />
        </div>
        <h5>William Lerach</h5>
        <div className="rating">
            <div className="star">
            <i className='bx bxs-star'></i><i className='bx bxs-star'></i>
            <i className='bx bxs-star'></i><i className='bx bxs-star'></i>
            <i className='bx bxs-star-half'></i>
            </div>
            <div className="review"><span>4.6 (1.5k Reviews)</span></div>
        </div>
        <div className="features">
            <span><i className='bx bx-briefcase'></i>Securities Law</span>
            <span><i className='bx bx-map'></i>Hà Nội</span>
            <span><i className='bx bx-time'></i>18 years experience</span>
            <span><i className='bx bx-check-shield'></i>Licensed</span>
            <button>View Profile</button>
        </div>
        </div>
    </div>

    <button className="load mb-5">Load More <i className='bx bx-sync'></i></button>
    </section>
    <section className="search">
        <div className="find">
        <h3>Find the Lawyer You Need</h3>
        <div className="find-row">

            {/* Keyword Search */}
            <div className="find-item w-100 mb-3">
            <h4>Search by Name or Keyword*</h4>
            <input
                type="text"
                className="form-control"
                placeholder="Type lawyer name or keyword..."
            />
            </div>
            <br></br>

            <div className="find-item">
            <h4>Specialization</h4>
            <select className="form-select">
                <option value="">All Specializations</option>
                <option value="family">Family Law</option>
                <option value="corporate">Corporate Law</option>
                <option value="criminal">Criminal Law</option>
                <option value="litigation">Litigation</option>
                <option value="securities">Securities Law</option>
            </select>
            </div>
            <br></br>

            <div className="find-item">
            <h4>Location</h4>
            <select className="form-select">
                <option value="">All Locations</option>
                <option value="hcm">Ho Chi Minh City</option>
                <option value="hn">Hà Nội</option>
                <option value="dn">Đà Nẵng</option>
                <option value="ct">Cần Thơ</option>
            </select>
            </div>
            <br></br>

            <div className="find-item">
            <h4>Experience</h4>
            <select className="form-select">
                <option value="">All Levels</option>
                <option value="1-5">1–5 years</option>
                <option value="6-10">6–10 years</option>
                <option value="11-20">11–20 years</option>
                <option value="20+">20+ years</option>
            </select>
            </div>
            <br></br>

            <div className="find-item">
            <h4>Availability</h4>
            <select className="form-select">
                <option value="">All Status</option>
                <option value="immediate">Immediate</option>
                <option value="within-week">Within 1 week</option>
                <option value="within-month">Within 1 month</option>
            </select>
            </div>
            <br></br>

            <div className="find-item">
            <h4>Consultation Type</h4>
            <select className="form-select">
                <option value="">All Types</option>
                <option value="in-person">In-person</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
            </select>
            </div>
            <br></br>

            <div className="search-btn">
            <button className="btn btn-primary">
                <i className="bx bx-search"></i> Find Your Lawyer
            </button>
            </div>
        </div>
        </div>
    </section>
    <main> <Outlet/> </main>
    <Footer/>
    </>
)
}