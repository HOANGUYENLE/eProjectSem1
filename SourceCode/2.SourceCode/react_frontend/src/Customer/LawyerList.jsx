import "../css/form.css"
export default function LawyerList(){
    


    return (
    <div className="container py-5 lawyerfile">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 className="mb-1">List of Lawyer</h1>
                <p className="text-muted mb-0 fs-3">2,847 lawyers • 12,456 reviews</p>
            </div>
            <div className="d-flex align-items-center gap-3">
            <span className="text-muted fs-2">Sort by:</span>
            <select className="form-select w-auto fs-2" style={{minWidth: 180}}>
                <option value="best">Best Match</option>
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="newest">Newest</option>
            </select>
            </div>
        </div>
        <div className="mb-5">
            <h5 className="mb-3">Narrow Results by Practice Area</h5>
            <div className="d-flex flex-wrap gap-2" id="practiceAreas">

            </div>
        </div>
        <hr />
        <div className="row g-4" id="lawyerList">
            <div className="col-12">
            <div className="card h-100 shadow-sm border-0 overflow-hidden">
                <div className="card-body p-4">
                    <div className="row align-items-center">
                        <div className="col-md-2 col-sm-3 text-center mb-3 mb-md-0">
                            <img src="https://via.placeholder.com/150" alt="Lawyer" className="rounded-circle border border-3 border-white shadow" style={{width: 130, height: 130, objectFit: 'cover'}} />
                            <span className="badge bg-warning text-dark mt-2">PRO</span>
                        </div>
                        {/* Info */}
                        <div className="col-md-6 col-sm-9">
                            <h4 className="mb-1 fs-1">Richard Scott Lawson</h4>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="text-warning fs-3">★★★★★</span>
                                <span className="text-muted fs-3">5.0 • 697 reviews</span>
                            </div>
                            
                            <p className="mb-2 text-muted small fs-4">
                                Licensed for 30 years • Practice Areas: Criminal Defense, Corporate Law, Family Law...
                            </p>
                            <p className="text-muted mb-0 fs-5">
                                "Don't trust your future to a general practitioner. Call an expert today."
                            </p>
                        </div>
                         <div className="col-md-4 text-end">
                            <div className="mb-3 d-flex justify-content-center gap-4">
                                <button className="btn btn-outline-primary w-50 fs-2">
                                    Make Appointment
                                </button>
                                <button className="btn btn-outline-info w-50 fs-2">
                                View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-2 col-sm-3 text-center mb-3 mb-md-0">
                            <img src="https://via.placeholder.com/150" alt="Lawyer" className="rounded-circle border border-3 border-white shadow" style={{width: 130, height: 130, objectFit: 'cover'}} />
                            <span className="badge bg-warning text-dark mt-2">PRO</span>
                        </div>
                        {/* Info */}
                        <div className="col-md-6 col-sm-9">
                            <h4 className="mb-1 fs-1">Richard Scott Lawson</h4>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="text-warning fs-3">★★★★★</span>
                                <span className="text-muted fs-3">5.0 • 697 reviews</span>
                            </div>
                            
                            <p className="mb-2 text-muted small fs-4">
                                Licensed for 30 years • Practice Areas: Criminal Defense, Corporate Law, Family Law...
                            </p>
                            <p className="text-muted mb-0 fs-5">
                                "Don't trust your future to a general practitioner. Call an expert today."
                            </p>
                        </div>
                         <div className="col-md-4 text-end">
                            <div className="mb-3 d-flex justify-content-center gap-4">
                                <button className="btn btn-outline-primary w-50 fs-2">
                                    Make Appointment
                                </button>
                                <button className="btn btn-outline-info w-50 fs-2">
                                View Profile
                                </button>
                            </div>
                        </div>

                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-2 col-sm-3 text-center mb-3 mb-md-0">
                            <img src="https://via.placeholder.com/150" alt="Lawyer" className="rounded-circle border border-3 border-white shadow" style={{width: 130, height: 130, objectFit: 'cover'}} />
                            <span className="badge bg-warning text-dark mt-2">PRO</span>
                        </div>
                        {/* Info */}
                        <div className="col-md-6 col-sm-9">
                            <h4 className="mb-1 fs-1">Richard Scott Lawson</h4>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="text-warning fs-3">★★★★★</span>
                                <span className="text-muted fs-3">5.0 • 697 reviews</span>
                            </div>
                            
                            <p className="mb-2 text-muted small fs-4">
                                Licensed for 30 years • Practice Areas: Criminal Defense, Corporate Law, Family Law...
                            </p>
                            <p className="text-muted mb-0 fs-5">
                                "Don't trust your future to a general practitioner. Call an expert today."
                            </p>
                        </div>
                        <div className="col-md-4 text-end">
                            <div className="mb-3 d-flex justify-content-center gap-4">
                                <button className="btn btn-outline-primary w-50 fs-2">
                                    Make Appointment
                                </button>
                                <button className="btn btn-outline-info w-50 fs-2">
                                View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
    )   
}