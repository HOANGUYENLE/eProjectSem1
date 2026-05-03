import "../css/admin/userTable.css"
import "../css/searchBar.css"

export default function AdminUserManagement() {
  const users = [
    { id: 1, name: "Alice Nguyen", email: "alice@example.com", role_id: "admin", phone: "0901234567" },
    { id: 2, name: "Bob Tran", email: "bob@example.com", role_id: "lawyer", phone: "0912345678" },
    { id: 3, name: "Charlie Pham", email: "charlie@example.com", role_id: "customer", phone: null },
  ];

  return (
    <div className="ContentBodyDashboard">
      <h2>User Management</h2>
      <div className="SearchBar">
        <div className="SearchBar d-flex align-items-center gap-3">
            <form method="get" className="navbar-form flex-grow-1">
                <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search user by email"
                />
                <button className="btn btn-secondary">
                    <i className="fa fa-search"></i>
                </button>
                </div>
            </form>

            <div className="input-group" style={{ maxWidth: "200px" }}>
                <select className="form-select" id="dropdownCity" name="dropdownCity">
                    <option defaultValue>Choose Role...</option>
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
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`role ${user.role_id}`}>{user.role_id}</span>
              </td>
              <td>{user.phone || "—"}</td>
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
      <div className="pagination">
            <button disabled>Previous</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>Next</button>
      </div>
    </div>
  );
}
