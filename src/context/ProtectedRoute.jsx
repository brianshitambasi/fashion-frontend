import { useContext } from "react"
import { AuthContext } from "./AuthContext"
import { Navigate, replace } from "react-router-dom"

const ProtectedRoute=({children,allowedRoles})=>{
    const {user}=useContext(AuthContext)
    // check if there is a user/if the user logged in
    if (!user) {
        // incase there is no user we are taken to login
        return <Navigate to='/login' replace/>        
    }
    if (!allowedRoles.includes(user.role)) {
        // Not not allowed
        // incase the logged in user has not role that has been predefined
        return <Navigate to='/not-authorized' replace/>
    }
    return  children
}
export default ProtectedRoute