import "../css/admin/userTable.css"
import "../css/searchBar.css"
import { AuthContext } from "../context/UserContext";
import { useContext, useEffect } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchUserData } from "../apiComponent/apiService";
import MyPaginate from "../Component/pagination";

export default function AdminUserManagement() {
  const {user} = useContext(AuthContext);
  
  const [chooseRole, setRole] = useState(null);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [CopyUserData, setCopyUserData] = useState(null);
  const perPage = 7;
  const queriesResults = useQueries({
        queries:[
          { queryKey: ["users", page],
            queryFn: () => fetchUserData(page, perPage),
            keepPreviousData: true,
            refetchInterval: 1000 * 60,
          },
        ]});

  const UsersData = queriesResults[0];

  useEffect(()=>{
    if (UsersData?.data){
      setCopyUserData(UsersData.data.data);
      console.log(UsersData.data.data);
    }
  }, [UsersData.data]);
  
  const SearchFunc = (e)=>{
    e.preventDefault();
    if(search !== ""){
      let temp = UsersData?.data.data;
      temp = temp.filter(each=>{
        return each.email.includes(search);
      })
      setCopyUserData(temp);
    }
    else{
      if (UsersData?.data){
        setCopyUserData(UsersData.data.data);
      }
    }
  }

  useEffect(()=>{
    if (!UsersData?.data?.data) return;
    let priority;

  if (chooseRole === "default" || chooseRole === "") {
    setCopyUserData(UsersData.data.data);
    return;
  }

  if (chooseRole === "admin") {
    priority = { admin: 0, lawyer: 1, customer: 2 };
  } else if (chooseRole === "lawyer") {
    priority = { lawyer: 0, admin: 1, customer: 2 };
  } else if (chooseRole === "customer") {
    priority = { customer: 0, admin: 1, lawyer: 2 };
  }

  if (priority) {
    const temp = [...UsersData.data.data];
    temp.sort((a, b) => {
      const roleA = priority[a.role.RoleName.toLowerCase()] ?? 99;
      const roleB = priority[b.role.RoleName.toLowerCase()] ?? 99;
      return roleA - roleB;
    });
    setCopyUserData(temp);
  }
  }, [chooseRole, page])
    

  return (
    <div className="ContentBodyDashboard">
      <h1 className="fs-1 fw-bolder text-center">User Management</h1>
      <div className="SearchBar">
        <div className="SearchBar d-flex justify-content-center align-items-end gap-3">
            <form method="get" className="navbar-form flex-grow-1" onSubmit={(e)=>SearchFunc(e)}>
                <div className="input-group">
                <input
                    type="text"
                    className="form-control p-3" value={search} onChange={(e)=>setSearch(e.target.value)}
                    placeholder="Search user by email"
                />
                <button className="btn btn-secondary">
                    <i className="fa fa-search"></i>
                </button>
                </div>
            </form>
            <div className="input-group" style={{ maxWidth: "200px", }}>
                <select className="form-select fs-3 p-3" id="dropdownRole" name="dropdownRole" value={chooseRole?chooseRole:"default"} onChange={(e)=>setRole(e.target.value)}>
                    <option value="default">Choose Role...</option>
                    <option value="admin">Admin</option>
                    <option value="lawyer">Lawyer</option>
                    <option value="customer">Customer</option>
                </select>
            </div>
            
          </div>
      </div>
      {UsersData.isLoading? 
      <div className="spinner-border"></div>: 
      <>
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              {/*<th>Action</th>*/}
            </tr>
          </thead>
          <tbody>
            {CopyUserData?.map(user => (
              <tr key={user.id} className="fs-2">
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role ${user.role.RoleName} fs-2`}>{user.role.RoleName}</span>
                </td>
                <td>{user.phone || "—"}</td>
                {/** <td>
                  <div className="actions justify-content-start d-flex">
                    <button className="delBtn">Delete</button>
                  </div>
                </td>*/}
                
              </tr>
            ))}
          </tbody>
        </table>
        <MyPaginate page={page} setPage={setPage} lastPage={UsersData.data.last_page}/>
      </>}

      
      
    </div>
  );
}
