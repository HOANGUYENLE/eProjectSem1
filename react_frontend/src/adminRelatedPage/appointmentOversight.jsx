import "../css/admin/userTable.css"
import "../css/searchBar.css"
import BarChart from "../chart/BarChart";

export default function AdminAppointment(){
    let barDataset = [{label:"Peak Appointment in days" ,data: [42, 38, 55, 48, 65, 72, 68], backgroundColor: "#3B82F6", borderColor: "#2563EB", borderWidth: 1}]
    const DayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return(
        <div className="ContentBodyDashboard">
       <h2>Appointment Oversight</h2>
        <div className="chartRow-2 ">
            <div className="chartCard columnChart">
                <h5 className="chartTitle">Peak Appointment days in week</h5>
                <div style={{height: "220px", maxWidth: "1200px"}}>
                    <BarChart datasets={barDataset} labels={DayLabels}/>
                </div>
            </div>
        </div>
        <hr />
        <div className="SearchBar">
        <div className="SearchBar d-flex align-items-center gap-3">
            <div className="input-group" style={{ maxWidth: "250px" }}>
                <select className="form-select" id="dropdownCity" name="dropdownCity">
                    <option defaultValue>Choose type Appointment</option>
                    <option value="1">Admin</option>
                    <option value="2">Lawyer</option>
                    <option value="3">Customer</option>
                </select>
            </div>

            <div className="dropdown">
                <button
                className="btn btn-outline-primary dropdown-toggle"
                type="button"
                id="filterDropdown"
                data-bs-toggle="dropdown"> Filter </button>
                <ul className="dropdown-menu p-3 mt-1">
                    <li>
                        <div className="form-check">
                        <input className="form-check-input" type="radio" name="sortOption" id="sortNameAsc" />
                        <label className="form-check-label" htmlFor="sortName">Sort by Date(ASC)</label>
                        </div>
                        <div className="form-check">
                        <input className="form-check-input" type="radio" name="sortOption" id="sortNameDesc" />
                        <label className="form-check-label" htmlFor="sortName">Sort by Date (DESC)</label>
                        </div>
                    </li>
                    <li>
                        <div className="form-check">
                        <input className="form-check-input" type="radio" name="sortOption" id="sortExpAsc" />
                        <label className="form-check-label" htmlFor="sortExpAsc">Sort by Name Customers </label>
                        </div>
                    </li>
                    <li>
                        <div className="form-check">
                        <input className="form-check-input" type="radio" name="sortOption" id="sortExpDesc" />
                        <label className="form-check-label" htmlFor="sortExpDesc">Sort by Name Lawyers</label>
                        </div>
                    </li>
                </ul>
            </div>
            </div>
      </div>
        <table className="user-table">
            <thead>
            <tr>
                <th>Customer Name</th>
                <th>Lawyer Name</th>
                <th>Time</th>
                <th>Have Rescheduled</th>
                <th>Appointment Status</th>
            </tr>
            </thead>
             <tbody>
                <tr>
                    <td>Anna Nguyen</td>
                    <td>John Doe</td>
                    <td>Mon, 12:00-13:00</td>
                    <td>
                        <button className="reschedule-btn">No Rescheduled</button>
                    </td>
                    <td><span className="status pending">Pending</span></td>
                </tr>
                <tr>
                    <td>Michael Tran</td>
                    <td>Jane Smith</td>
                    <td>Mon, 12:00-13:00</td>
                    <td>
                        <button className="reschedule-btn">Have Reschedule. View detail</button>
                    </td>
                    <td><span className="status completed">Completed</span></td>
                </tr>
                <tr>
                    <td>Sarah Pham</td>
                    <td>David Le</td>
                    <td>Mon, 12:00-13:00</td>
                    <td>
                        <button className="reschedule-btn">Have Reschedule. View detail</button>
                    </td>
                    <td><span className="status cancel">Cancel</span></td>
                </tr>
            </tbody>
        </table>
        <div className="pagination">
            <button disabled>Previous</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>Next</button>
        </div>
        </div>
    )
}