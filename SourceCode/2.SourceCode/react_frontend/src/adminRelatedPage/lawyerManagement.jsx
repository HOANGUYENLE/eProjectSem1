import PieChart from "../chart/PieChart"
import LineChart from "../chart/LineChart"
import LineStackBar from "../chart/LineStackBar"
import "../css/admin/adminDashBoard.css"
import "../css/searchBar.css"

export default function AdminLawyerManagement(){
    let datasets = {
        'success': [25, 30, 28, 35, 40, 38, 23, 21, 23, 28, 35, 21],
        'cancel' : [15, 18, 22, 20, 25, 28, 30, 28, 35, 23, 21, 23],
        'total': [48, 58, 62, 70, 75, 78, 62, 70 , 58, 62, 21, 30]
    }

    let labels = {
        'success': "Successful Appointment",
        'cancel':  "Canceled Appointment",
        'total': "Total Appointment"
    }

    return (<>
    <div className="ContentBodyDashboard">
        <div className="chartRow-3">
            <div className="chartCard circleChart">
                <h5 className="chartTitle">Pending Lawyer documents</h5>
                <div style={{height: "200px", position: "relative", width:"100%" ,maxWidth: "400px"}}>
                    <PieChart label={["Approved Documents", "Pending Documents", "Rejected Documents"]} value={[45, 35, 20]}/>
                </div>
            </div>
            <div className="chartCard lineChart">
                <h5 className="chartTitle">Number of Appointments per Month</h5>
                <div style={{height: "200px", width:"100%" ,maxWidth: "600px"}}>
                    <LineStackBar datasets={datasets} labels={labels}/>
                </div>
            </div>
        </div>
        <hr />

        <div className="SearchBar d-flex align-items-center gap-3">
            <form method="get" className="navbar-form flex-grow-1">
                <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search Lawyer by Name"
                />
                <button className="btn btn-secondary">
                    <i className="fa fa-search"></i>
                </button>
                </div>
            </form>

            <div className="input-group" style={{ maxWidth: "200px" }}>
                <select className="form-select" id="dropdownCity" name="dropdownCity">
                    <option defaultValue>Choose City...</option>
                    <option value="1">HCMC</option>
                    <option value="2">Hanoi</option>
                    <option value="3">Da Nang</option>
                </select>
            </div>


            <div className="input-group" style={{ maxWidth: "220px" }}>
                <select className="form-select" id="dropdownSpecialization" name="dropdownSpecialization">
                <option defaultValue>Choose Specialization...</option>
                <option value="civil">Civil Law</option>
                <option value="criminal">Criminal Law</option>
                <option value="corporate">Corporate Law</option>
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
                        <label className="form-check-label" htmlFor="sortName">Sort by Name (ASC)</label>
                        </div>
                        <div className="form-check">
                        <input className="form-check-input" type="radio" name="sortOption" id="sortNameDesc" />
                        <label className="form-check-label" htmlFor="sortName">Sort by Name (DESC)</label>
                        </div>
                    </li>
                    <li>
                        <div className="form-check">
                        <input className="form-check-input" type="radio" name="sortOption" id="sortExpAsc" />
                        <label className="form-check-label" htmlFor="sortExpAsc">Sort by Experience (ASC)</label>
                        </div>
                    </li>
                    <li>
                        <div className="form-check">
                        <input className="form-check-input" type="radio" name="sortOption" id="sortExpDesc" />
                        <label className="form-check-label" htmlFor="sortExpDesc">Sort by Experience (DESC)</label>
                        </div>
                    </li>
                </ul>
            </div>
            </div>
        </div>
        <div className="LawyerTable">
            <table>
                <thead>
                <tr>
                    <th>Lawyer Name</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>Profile Image</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    
                    <td>John Doe</td>
                    <td>123 Main Street</td>
                    <td>HCMC</td>
                    <td>
                    <a href="/images/lawyer1.jpg" target="_blank" rel="noopener noreferrer">View image</a>
                    </td>
                    <td><span className="status pending">Pending</span></td>
                    <td>
                    <div className="actions">
                        <button className="editBtn">Edit</button>
                        <button className="delBtn">Delete</button>
                    </div>
                    </td>
                </tr>
                <tr>
                    <td>Jane Smith</td>
                    <td>456 Nguyen Trai</td>
                    <td>Hanoi</td>
                    <td>
                    <a href="/images/lawyer1.jpg" target="_blank" rel="noopener noreferrer">View image</a>
                    </td>
                    <td><span className="status approved">Approved</span></td>
                    <td>
                    <div className="actions">
                        <button className="editBtn">Edit</button>
                        <button className="delBtn">Delete</button>
                    </div>
                    </td>
                </tr>
                <tr>
                    <td>Michael Tran</td>
                    <td>789 Le Loi</td>
                    <td>Da Nang</td>
                    <td>
                        <a href="/images/lawyer1.jpg" target="_blank" rel="noopener noreferrer">View image</a>
                    </td>
                    <td><span className="status rejected">Rejected</span></td>
                    <td>
                    <div className="actions">
                        <button className="editBtn">Edit</button>
                        <button className="delBtn">Delete</button>
                    </div>
                    </td>
                </tr>
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
                <button disabled>Previous</button>
                <button className="active">1</button>
                <button>2</button>
                <button>3</button>
                <button>Next</button>
            </div>
            </div>

    </>)
}