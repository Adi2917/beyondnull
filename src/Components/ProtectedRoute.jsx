import { Navigate } from "react-router-dom"
import { checkAdminSession } from "../services/authService"
import { ACCESS_PATH } from "../portalRoutes"

function ProtectedRoute({children}) {

const isLogged = checkAdminSession()

if(!isLogged){

return <Navigate to={ACCESS_PATH}/>

}

return children

}

export default ProtectedRoute
