import { Link, useNavigate } from "react-router-dom"

const PageNotFound = () => {
    const navigate=useNavigate()
  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light text-center p-3">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <p className="lead mt-2 mb-4 text-muted">Oops The Page you are looking for doesn't  exist</p>
        <div className="d-flex gap-3 flex-wrap">
            <button className="btn btn-outline-primary btn-sm d-flex align-items-center"
            onClick={()=>navigate(-1)}
            >
                <i className="bi bi-arrow-left me-1">Go Back</i>
            </button>
            <Link to={'/'} className='btn btn-primary btn-sm align-items-center'>
            <i className="bi bi-house-door">Home</i>
            </Link>
        </div>
    </div>
  )
}

export default PageNotFound;