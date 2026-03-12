import { Navigate } from "react-router-dom"

function ProtectedRoute({children}) {

const isLogged = localStorage.getItem("adminLogged")

if(!isLogged){

return <Navigate to="/admin"/>

}

return children

}

export default ProtectedRoute