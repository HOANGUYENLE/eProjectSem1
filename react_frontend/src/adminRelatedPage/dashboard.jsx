import "../css/admin/adminDashBoard.css"
import PieChart from "../chart/PieChart"
import LineChart from "../chart/LineChart"
import BarChart from "../chart/BarChart"

export default function AdminDashboard(){
    
    let lineDataset = [
            {
                label: "Completed Apointments",
                data: [12, 19, 15, 25, 22, 30, 45, 15, 9, 8, 10, 15],
                borderColor: "#0aff1e",        // Blue
                backgroundColor: "rgba(94, 255, 14, 0.09)",
                
                pointRadius: 2,
            },
            {
                label: "Canceled Appointment",
                data: [20, 15, 11, 10, 20, 16, 25, 22, 30, 15, 12, 12],
                borderColor: "#ea2608",        // Gold
                backgroundColor: "rgba(255, 28, 16, 0.08)",
                borderWidth: 1,
                pointRadius: 2,
            }]
    let barDataset = [{label:"Completed Appointment" ,data: [42, 38, 55, 48, 65, 72, 68, 80, 75, 82, 90, 95], backgroundColor: "#3B82F6", borderColor: "#2563EB", borderWidth: 1}]
    const monthlyLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <>
        <div className="TopHeaderDashboard">
            <div className="box">
                <div className="smallImage">
                    <img src="/logo/customerLogo.jpg" alt="humanLogo"/>
                </div>
                <div>
                    <p className="boxLabel">Total Customers: </p>
                    <p className="boxValue">1</p>
                </div>
            </div>

            <div className="box">
                <div className="smallImage">
                    <img src="/logo/booklawLogo.jpg" alt="humanLogo"/>
                </div>
                <div>
                    <p className="boxLabel">Total Lawyers: </p>
                    <p className="boxValue">3</p>
                </div>
            </div>

            <div className="box">
                <div className="smallImage">
                    <img src="/logo/clock2Logo.png" alt="humanLogo"/>
                </div>
                <div>
                    <p className="boxLabel">Booking this month: </p>
                    <p className="boxValue">16</p>
                </div>
            </div>
        </div>

        <div className="ContentBodyDashboard">
            <div className="chartRow-1">
                <div className="chartCard circleChart">
                    <h5 className="chartTitle">Pending Lawyer documents</h5>
                    <div style={{height: "200px", position: "relative", width:"100%" ,maxWidth: "450px"}}>
                        <PieChart label={["Approved Documents", "Pending Documents", "Rejected Documents"]} value={[45, 35, 20]}/>
                    </div>
                </div>
                <div className="chartCard lineChart">
                    <h5 className="chartTitle">Number of Appointments per Month</h5>
                    <div style={{height: "200px", width:"100%" ,maxWidth: "550px"}}>
                        <LineChart datasets={lineDataset} labels={monthlyLabels}/>
                    </div>
                </div>
            </div>
            <div className="chartRow-2 ">
                <div className="chartCard columnChart">
                    <h5 className="chartTitle">Lawyer Performance: Completed Appointments per Month</h5>
                    <div style={{height: "220px", maxWidth: "1200px"}}>
                        <BarChart datasets={barDataset} labels={monthlyLabels}/>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}