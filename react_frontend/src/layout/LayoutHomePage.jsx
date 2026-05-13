import { Outlet } from "react-router-dom"
import Nav from "./part/homepage/Nav"
import Footer from "./part/homepage/Footer"
import "../css/home/header.css"
import "../css/home/home.css"
import "../css/home/arrivals.css"
import "../css/home/search.css"
import "../css/home/footer.css"
import "../css/profile.css"

export default function LayoutHomePage(){
    //<News notifications={notifications} />
    
    return(
    <>
    <Nav/>
    <main> <Outlet/> </main>
    <div className="footer_container">
    <Footer/>
    </div>
    
    </>
)
}