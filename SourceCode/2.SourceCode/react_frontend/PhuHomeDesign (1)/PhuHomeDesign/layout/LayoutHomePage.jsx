import { Outlet, Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

import "../css/home/header.css"
import "../css/home/home.css"
import "../css/home/arrivals.css"
import "../css/home/search.css"
import "../css/home/footer.css"

import Notifications from "./notification/Notifications";   // your component
import { notifications } from "../data(example)/announcements";  // your data

  // adjust path if needed


export default function LayoutHomePage() {
  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light p-3">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold" to="/">
                  <img 
                    src="/img/home/LegalEaseLogo.jpg"   // path to your logo file
                    alt="LegalEase Logo"
                    height="60"              // adjust size
                    width="70"
                    className="d-inline-block align-text-top"
                  />
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuList" aria-controls="menuList">
                    <span className="navbar-toggler-icon" />
                </button>
                    <div className="collapse navbar-collapse" id="menuList">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            
                            <li className="nav-item dropdown">
                                <button className="nav-link btn dropdown-toggle" id="searchDropdown1" data-bs-toggle="dropdown" aria-expanded="false">
                                    Search lawyer by Specialization
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="searchDropdown1">
                                    <li><a className="dropdown-item" href="#">All Specializations</a></li>
                                    <li><a className="dropdown-item" href="#">Family Law</a></li>
                                    <li><a className="dropdown-item" href="#">Corporate Law</a></li>
                                    <li><a className="dropdown-item" href="#">Criminal Law</a></li>
                                    <li><a className="dropdown-item" href="#">Litigation</a></li>
                                    <li><a className="dropdown-item" href="#">Securities Law</a></li>
                                </ul>
                            </li>

                            <li className="nav-item dropdown">
                                <button className="nav-link btn dropdown-toggle" id="searchDropdown2" data-bs-toggle="dropdown" aria-expanded="false">
                                    Search lawyer by Location
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="searchDropdown2">
                                    <li><a className="dropdown-item" href="#">All Locations</a></li>
                                    <li><a className="dropdown-item" href="#">Ho Chi Minh City</a></li>
                                    <li><a className="dropdown-item" href="#">Hà Nội</a></li>
                                    <li><a className="dropdown-item" href="#">Đà Nẵng</a></li>
                                    <li><a className="dropdown-item" href="#">Cần Thơ</a></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/">FAQ/Question</Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/">News</Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav mb-2 mb-lg-0">

                            <li className="nav-item dropdown">
                                <button className="nav-link btn" id="notificationDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                                      <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 
                                      1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.
                                      447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                                    </svg>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-lg-end notification-dropdown" aria-labelledby="notificationDropdown">
                                    <Notifications notifications={notifications} /> // Render notifications in the dropdown in React*
                                </ul>
                            </li>
                            <li className="nav-item">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#SigninBtn"
                            >
                                Signin
                            </button>

                            <div className="modal fade" tabIndex={-1} id="SigninBtn" aria-labelledby="SigninTitle">
                                <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                    <h2 id="SigninTitle" className="modal-title text-center w-100 fw-bolder">
                                        Sign in
                                    </h2>
                                    </div>
                                    <div className="modal-body">
                                    <form>
                                        <div className="mb-3 mt-3">
                                        <label htmlFor="name" className="form-label">Username:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            placeholder="Enter username"
                                            name="name"
                                        />
                                        </div>
                                        <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password:</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="Enter password"
                                            name="password"
                                        />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100">Submit</button>
                                    </form>
                                    </div>
                                    <div className="modal-footer text-center">
                                    <a href="/signup" className="nav-link text-center">Don't have account? Sign up</a>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </li>
                        </ul>
                    </div>
                </div>
        </nav>
      {/* MODAL SIGN UP*/}
      <div className="modal fade" id="signinModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title w-100 text-center">Sign in</h5>
            </div>

            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input className="form-control" type="text" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input className="form-control" type="password" />
                </div>

                <button className="btn btn-primary w-100">Submit</button>
              </form>
            </div>

            <div className="modal-footer">
              <Link to="/signup" className="w-100 text-center">
                Don't have account? Sign up
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* SWIPER */}
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

                <div className="d-flex gap-3">
                  <button className="btn btn-dark">About More</button>
                  <button className="btn btn-outline-dark">Learn More</button>
                </div>
              </div>

              <div className="col-6 text-center">
                <img src="/img/home/1.avif" alt="" className="img-fluid" />
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
                <img src="/img/home/2.jpg" alt="" className="img-fluid" />
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
                <img src="/img/home/3.webp" alt="" className="img-fluid" />
              </div>
            </div>
          </SwiperSlide>

        </Swiper>
      </div>

      {/* LAWYER ARRIVALS SECTION */}
      <section className="arrivals">
        <h1><span>lawyers</span> profile carousel</h1>

        <div className="arr-row">
          {/* Lawyer 1 */}
          <div className="arr-col">
            <div className="image">
              <img src="/img/lawyer/chris_grocock.jpg" alt="Chris Grocock" />
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
              <img src="/img/lawyer/robert_richter.png" alt="Robert Richter" />
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
              <img src="/img/lawyer/roy_black.jpeg" alt="Roy Black" />
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
              <img src="/img/lawyer/william_lerach.jpeg" alt="William Lerach" />
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

        <button className="load">Load More <i className='bx bx-sync'></i></button>
      </section>


        {/* LAWYER SEARCH SECTION */}
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

      {/* ANNOUNCEMENTS & LEGAL UPDATES */}
      {/* <section className="announcements p-4 bg-light mt-4">
        <h3>📢 Announcements & Legal Updates</h3>
        <div className="list-group">
          {announcements.length === 0 ? (
            <p>No announcements available.</p>
          ) : (
            announcements.map(item => (
              <div key={item.id} className="list-group-item">
                <h5>{item.title}</h5>
                <small className="text-muted">
                  {new Date(item.date).toLocaleDateString()} — {item.author}
                </small>
                <p>{item.content}</p>
              </div>
            ))
          )}
        </div>
      </section> */}
      {/* NOTIFICATIONS SECTION (Example) */}
      {/* NOTIFICATIONS SECTION */}
       <Notifications notifications={notifications} />
      
      {/* FOOTER */}
      <section className="footer p-4 bg-dark text-white mt-4">
        <div className="row">
          <div className="col-md-4">
            <h5>LegalEase</h5>
            <p>Your trusted platform to find the best lawyers.</p>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <p>Email: 5t4mI@example.com</p> {/* Updated email */}
            <p>Phone: +1 (555) 123-4567</p>
          </div>
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <div className="social-icons">
              <a href="#"><i className='bx bxl-facebook'></i></a>
              <a href="#"><i className='bx bxl-twitter'></i></a>
              <a href="#"><i className='bx bxl-linkedin'></i></a>
              <a href="#"><i className='bx bxl-instagram'></i></a>
            </div>
          </div>
        </div>
        <div className="text-center mt-3">
          &copy; {new Date().getFullYear()} LegalEase. All rights reserved.
        </div>
      </section>

      {/* ROUTER CONTENT */}
      <Outlet />
    </>
  )
}