import "../css/searchBar.css"
import "../css/admin/userTable.css"
import "../css/supportTable.css"

import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { fetchSystemNotification, fetchUpdateSystemNotification, 
         fetchDeleteSystemNotification, fetchCreateSystemNotification, 
         fetchDeleteManySysNotification } from "../apiComponent/apiService";

export default function SystemNotification(){
  const queryClient = useQueryClient();

  const [currentStatus, setStatus] = useState("default");
  const [currentType, setType] = useState("all");
  const [DropDownFilter, setDropDownFilter] = useState("asc");
  const [displayData, setDisplayData] = useState(null);
  const {user, navigate, formatTime2, formatDate, convertToDateTimeLocal} = useContext(AuthContext);
  const [currentPostID, setPostID] = useState(null);
  const [formData, setFormData] = useState({
    "title": "",
    "content": "", 
    "status":"",
    "expired_at": "",
    "type": ""
  });

  const [createForm, setCreateForm] = useState({
    "title": "",
    "content": "", 
    "expired_at": "",
  });
  const queriesResults = useQueries({
        queries:[
          { queryKey: ["SysNotification"],
            queryFn: fetchSystemNotification,
            refetchInterval: 1000 * 60,
          }
        ]
  });

  const updateNotification = useMutation({
    mutationFn: ({id, content}) => fetchUpdateSystemNotification(id, content),
    onMutate: async ({id, content}) => {
      await queryClient.cancelQueries(["SysNotification"]);
      const previous = queryClient.getQueryData(["SysNotification"]);
      queryClient.setQueryData(["SysNotification"], old=>{
        if (!old) return old; // safeguard if cache is empty
        return old.map(item => item.id === id ? { ...item, ...content } : item);
      });
      return {previous: previous};
    },
    onError: (err, variable, context) =>{
      queryClient.setQueryData(["SysNotification"], context.previous)
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries(["SysNotification"]);
    }
  })

  const handleSummit = (each)=>{
    if(each.type === "reminder"){
      alert("You can only Edit system type notification");
      return;
    }

    const content = {
      "title": formData["title"] === "" ? each.title: formData["title"],
      "content": formData["content"] === "" ? each.content: formData["content"],
      "status" : formData["status"] === "" ? each.status: formData["status"],
      "expired_at": formData["expired_at"] === ""? each.expired_at: formData["expired_at"],
      "type": each.type
    }
    const postID  = each.id;
    /** 
    fetchUpdateSystemNotification(postID, content);
    queryClient.setQueryData(["SysNotification"], old => {
      return old.map(item => 
        item.id === postID 
          ? { ...item, ...content } 
          : item
      );
    setTimeout(() => {
      queryClient.invalidateQueries(["SysNotification"]);
    }, 800);
    });*/

    updateNotification.mutate({ id: postID, content });
    setFormData({
      "title": "",
      "content": "", 
      "status":"",
      "expired_at": "",
      "type": ""
    });
  }

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!createForm.title || createForm.title.length > 255) {
      alert("Title is required and must be less than 255 characters.");
      return;
    }
    if (!createForm.content) {
      alert("Content is required.");
      return;
    }
    if (!createForm.expired_at || new Date(createForm.expired_at) <= new Date()) {
      alert("Expired date must be after today.");
      return;
    }

  const success = await fetchCreateSystemNotification(createForm);
  if (success) {
    alert("Create new notification successfully")
    queryClient.invalidateQueries(["SysNotification"]);
    setCreateForm({ title: "", content: "", expired_at: "" });
  }
};

  const handleDelete = async(id)=>{
    if(window.confirm(`Do you want to delete this system notification record id: ${id}?`)){
      console.log(id);
      let response = fetchDeleteSystemNotification(id);
      response && queryClient.invalidateQueries(["SysNotification"]);
    }
  }

  const handleDeleteMany = async ()=>{
    const collectChecked = Array.from(document.querySelectorAll('input[name="delChoose"]:checked')).map(each=>each.value);
    if(collectChecked.length === 0){
      alert("No Items checking");
      return;
    }
    const response = await fetchDeleteManySysNotification({ids: collectChecked});
    response && queryClient.invalidateQueries(["SysNotification"]);
  }
  
  const SysNotificationData = queriesResults[0];
  
  


  useEffect(() => {
    if (!SysNotificationData?.data) return;

    let temp = SysNotificationData.data;
    if(currentType !== "all"){
      temp = temp.filter(each => each.type === currentType);
    }

    if (currentStatus !== "default"){
      temp = temp.filter(each => each.status === currentStatus);
    }

    temp = [...temp].sort((a, b) =>
      DropDownFilter === "asc"
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at)
    );

    setDisplayData(temp)
    }, [currentType, DropDownFilter, currentStatus, SysNotificationData.data]);


  return (
    <div className="ContentBodyDashboard">
      <h2>Content Management</h2>
              <div className="SearchBar">
          <div className="SearchBar d-flex align-items-end gap-3">
            <div className="bulk-actions w-100 d-flex justify-content-start">
                <button className="delAllBtn fs-3 p-3" onClick={()=>handleDeleteMany()}>Delete items</button>
              </div>
              <div className="input-group" style={{ maxWidth: "250px" }}>
                  <select className="form-select" id="dropdownStatus" name="dropdownStatus"
                  onChange={e=>setStatus(e.target.value)}>
                      <option value="default">Choose Status</option>
                      <option value="published">Published</option>
                      <option value="expired">Expired</option>
                  </select>
              </div>

              <div className="input-group" style={{ maxWidth: "250px" }}>
                  <select className="form-select" id="dropdownType" name="dropdownType" 
                  onChange={e=>setType(e.target.value)}>
                      <option value="all">Choose Type</option>
                      <option value="system">System</option>
                      <option value="reminder">Reminder</option>
                  </select>
              </div>

              <div className="dropdown">
                  <button
                  className="btn btn-outline-primary dropdown-toggle fs-3 p-3"
                  type="button"
                  id="filterDropdown"
                  data-bs-toggle="dropdown"> Filter </button>
                  <ul className="dropdown-menu p-3 mt-1 fs-3 ">
                      <li>
                          <div className="form-check">
                            <input className="form-check-input" type="radio" name="sortOption" id="sortNameAsc" 
                              value="asc" checked={DropDownFilter === "asc"}
                              onChange={e => setDropDownFilter(e.target.value)}/>
                              <label className="form-check-label" htmlFor="sortNameAsc">Sort by Date(ASC)</label>
                          </div>
                      </li>
                      <li>
                          <div className="form-check">
                            <input className="form-check-input" type="radio" name="sortOption" id="sortNameDesc" 
                              checked={DropDownFilter === "desc"}  value="desc"
                              onChange={e => setDropDownFilter(e.target.value)}/>
                            <label className="form-check-label" htmlFor="sortNameDesc">Sort by Date (DESC)</label>
                          </div>
                      </li>
                  </ul>
              </div>  
            </div>
      </div>
      {!SysNotificationData.isLoading?
      <table className="user-table fs-4">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>Author</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayData?.map(item => (
            <tr key={item.id}>
              <td>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="delChoose" value={item.id}/>
                </div>
              </td>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.content.length>30?item.content.slice(0, 30) + "...":item.content}</td>
              <td>{item.user_tb.name}</td>
              <td> <span className={`status ${item.status} fs-4`}>{item.status}</span> </td>
              <td>{formatDate(item.created_at)}</td>

              <td>{item.type}</td>
              <td>
                <div className="actions">
                  <button type="button" className="btn btn-info p-3 fs-2" data-bs-toggle="modal" data-bs-target={`#NoticeModal-${item.id}`} onClick={()=>console.log(formData)}>Edit</button>
                  <button className="delBtn" onClick={()=>handleDelete(item.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table> :<div className="spinner-border"></div>}
      
      {SysNotificationData?.data && SysNotificationData.data.map((value, index)=>{
          return (
              <>
              <div className="modal fade" id={`NoticeModal-${value.id}`} tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Author</label>
                                    <input type="text" className="form-control" value={value.user_tb.name} readOnly/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <textarea rows={2} className="form-control" 
                                    value={formData["title"]?formData["title"]:value.title}
                                    onChange={(e)=>setFormData({...formData, "title": e.target.value})}/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Content</label>
                                    <textarea className="form-control" id={`NoticeContent-${value.id}`} rows={4} 
                                    value={formData["content"]?formData["content"]:value.content}
                                    onChange={(e)=>setFormData({...formData, "content": e.target.value})}/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <select className="form-select form-control" value={formData["status"] === ""?value.status: formData["status"]} onChange={(e)=>setFormData({...formData, "status": e.target.value})}>
                                        <option value="published">Published</option>
                                        <option value="expired">Expired</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Created date</label>
                                    <input type="text" className="form-control" value={`${formatDate(value.created_at)}` + ` ` + `${formatTime2(value.created_at)}`} readOnly />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Expired date</label>
                                    <input type="datetime-local" className="form-control" 
                                    value={formData["expired_at"]?formData["expired_at"]:
                                    convertToDateTimeLocal(`${formatDate(value.expired_at)}T${formatTime2(value.expired_at)}`.split("T"))}
                                    onChange={(e)=>setFormData({...formData, "expired_at": e.target.value})}/>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" 
                        onClick={()=>{
                          handleSummit(value);
                        }}>Save changes</button>
                        </div>
                    </div>
                    </div>
                </div>
              </>)
        })}

        <div className="w-100 p-3 d-flex justify-content-center mt-2">
          <button type="button" className="btn btn-primary fs-2" data-bs-toggle="modal" data-bs-target="#NoticeModal">
          Make a new notification
        </button>
      
      <div className="modal fade" id="NoticeModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fs-1 fw-bolder">Create New Notification</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={()=>setCreateForm({ title: "", content: "", expired_at: "" })}
                ></button>
              </div>
              <div className="modal-body">
                <form id="createNotificationForm" onSubmit={handleCreate}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={createForm.title}
                      onChange={(e)=>setCreateForm({...createForm, [e.target.name]: e.target.value})}
                      required
                      maxLength="255"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <textarea
                      className="form-control"
                      id="content"
                      name="content"
                      value={createForm.content}
                      onChange={(e)=>setCreateForm({...createForm, [e.target.name]: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="expired_at" className="form-label">Expired At</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="expired_at"
                      name="expired_at"
                      value={createForm.expired_at}
                      onChange={(e)=>setCreateForm({...createForm, [e.target.name]: e.target.value})}
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button
                  type="submit"
                  form="createNotificationForm"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={()=>setCreateForm({ title: "", content: "", expired_at: "" })}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div></div>
          </div>
        );}