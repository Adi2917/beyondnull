import { Navigate } from "react-router-dom"
import { checkAdminSession } from "../services/authService"

function ProtectedRoute({children}) {

const isLogged = checkAdminSession()

if(!isLogged){

return <Navigate to="/admin"/>

}

return children

}

export default ProtectedRoute
