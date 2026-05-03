import "../css/searchBar.css"
import "../css/admin/userTable.css"
import "../css/supportTable.css"

export default function SystemNotification(){
const contents = [
    {
      id: 1,
      title: "System Maintenance Notice",
      content: "We will perform scheduled maintenance on May 5th.",
      author_name: "System Admin",
      status: "published",
      created_at: "2026-05-01 09:30:00",
      expired_at: "2026-05-10 09:30:00",
      type: "system"
    },
    {
      id: 2,
      title: "Reminder: Submit Documents",
      content: "Please submit your case documents before May 7th.",
      author_name: "Alice Nguyen",
      status: "expired",
      created_at: "2026-04-20 08:45:00",
      expired_at: "2026-04-30 08:45:00",
      type: "reminder"
    }
  ];

  return (
    <div className="ContentBodyDashboard">
      <h2>Content Management</h2>
              <div className="SearchBar">
          <div className="SearchBar d-flex align-items-center gap-3">
              <div className="input-group" style={{ maxWidth: "250px" }}>
                  <select className="form-select" id="dropdownStatus" name="dropdownStatus">
                      <option defaultValue>Choose Status</option>
                      <option value="published">Published</option>
                      <option value="expired">Expired</option>
                  </select>
              </div>

              <div className="input-group" style={{ maxWidth: "250px" }}>
                  <select className="form-select" id="dropdownType" name="dropdownType">
                      <option defaultValue>Choose Type</option>
                      <option value="system">System</option>
                      <option value="reminder">Reminder</option>
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
                          <label className="form-check-label" htmlFor="sortName">Sort ASC</label>
                          </div>
                          <div className="form-check">
                          <input className="form-check-input" type="radio" name="sortOption" id="sortNameDesc" />
                          <label className="form-check-label" htmlFor="sortName">Sort DESC</label>
                          </div>
                      </li>
                      <li>
                          <div className="form-check">
                          <input className="form-check-input" type="radio" name="sortOption" id="sortExpAsc" />
                          <label className="form-check-label" htmlFor="sortExpAsc">Sort by Date (ASC) </label>
                          </div>
                      </li>
                      <li>
                          <div className="form-check">
                          <input className="form-check-input" type="radio" name="sortOption" id="sortExpDesc" />
                          <label className="form-check-label" htmlFor="sortExpDesc">Sort by Date (DESC)</label>
                          </div>
                      </li>
                  </ul>
              </div>
            </div>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>Author</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Expired At</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contents.map(item => (
            <tr key={item.id}>
              <td>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="delChoose" value={item.id}/>
                </div>
              </td>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.content}</td>
              <td>{item.author_name}</td>
              <td>
                <span className={`status ${item.status}`}>{item.status}</span>
              </td>
              <td>{item.created_at}</td>
              <td>{item.expired_at}</td>
              <td>{item.type}</td>
              <td>
                <div className="actions">
                  <button className="editBtn">Edit</button>
                  <button className="delBtn">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bulk-actions">
        <button className="delAllBtn">Delete All</button>
      </div>
    </div>
  );
}