export default function Login(){
    return (<>
    <form>
        <div className="mb-3 mt-3">
        <label htmlFor="name" className="form-label">Username:</label>
        <input type="text" className="form-control" id="name" placeholder="Enter username" name="name"/>
        </div>
        <div className="mb-3">
        <label htmlFor="password" className="form-label">Password:</label>
        <input type="password" className="form-control" id="password" placeholder="Enter password" name="password"/>
        </div>
        <button type="submit" className="btn btn-primary w-100">Submit</button>
    </form>
    </>)
}