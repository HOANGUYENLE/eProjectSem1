import "../css/admin/userTable.css"
import "../css/searchBar.css"
import { AuthContext } from "../context/UserContext";
import { useContext, useEffect } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchUserData } from "../apiComponent/apiService";

export default function AdminUserManagement() {
  const {user} = useContext(AuthContext);
  const [chooseRole, setRole] = useState(null);
  const [search, setSearch] = useState("");

  const queriesResults = useQueries({
        queries:[
          { queryKey: ["users"],
            queryFn: fetchUserData,
            refetchInterval: 1000 * 60,
          },]});
  const UsersData = queriesResults[0];

  useEffect(()=>{
    if (UsersData.data){
      //console.log(UsersData.data);
    }
  }, [UsersData.data]);
  
  const users = [
    { id: 1, name: "Alice Nguyen", email: "alice@example.com", role_id: "admin", phone: "0901234567" },
    { id: 2, name: "Bob Tran", email: "bob@example.com", role_id: "lawyer", phone: "0912345678" },
    { id: 3, name: "Charlie Pham", email: "charlie@example.com", role_id: "customer", phone: null },
  ];
  return (
    <div className="ContentBodyDashboard">
      <h1 className="fs-1 fw-bolder text-center">User Management</h1>
      <div className="SearchBar">
        <div className="SearchBar d-flex align-items-center gap-3">
            <form method="get" className="navbar-form flex-grow-1">
                <div className="input-group">
                <input
                    type="text"
                    className="form-control" value={search} onChange={(e)=>setSearch(e.target.value)}
                    placeholder="Search user by email"
                />
                <button className="btn btn-secondary">
                    <i className="fa fa-search"></i>
                </button>
                </div>
            </form>

            <div className="input-group" style={{ maxWidth: "200px" }}>
                <select className="form-select" id="dropdownCity" name="dropdownCity" value={chooseRole?chooseRole:"default"} onChange={(e)=>setRole(e.target.value)}>
                    <option value="default">Choose Role...</option>
                    <option value="admin">Admin</option>
                    <option value="lawyer">Lawyer</option>
                    <option value="customer">Customer</option>
                </select>
            </div>

            <div className="dropdown">
                <button
                className="btn btn-outline-primary dropdown-toggle"
                type="button"
                id="filterDropdown"
                data-bs-toggle="dropdown"> Filter </button>
                <ul className="dropdown-menu p-3 mt-1 fs-2">
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
      {UsersData.isLoading? 
      <div className="spinner-border"></div>: 
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
          {UsersData.data.map(user => (
            <tr key={user.id} className="fs-2">
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`role ${user.role.RoleName} fs-2`}>{user.role.RoleName}</span>
              </td>
              <td>{user.phone || "—"}</td>
              <td>
                <div className="actions justify-content-start d-flex">
                  <button className="editBtn">Edit</button>
                  <button className="delBtn">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>}
      
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
