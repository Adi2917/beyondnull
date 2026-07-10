import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaEye,FaEyeSlash } from "react-icons/fa"
import BrandLogo from "../Components/BrandLogo"
import "./AdminLogin.css"

import { checkAdminSession, loginAdmin } from "../services/authService"
import ForgetPinModal from "../Components/ForgetPinModal"

function AdminLogin(){

const navigate = useNavigate()

const [email,setEmail] = useState("")
const [pin,setPin] = useState("")
const [showPin,setShowPin] = useState(false)
const [showForget,setShowForget] = useState(false)

const [loading,setLoading] = useState(false)
const [message,setMessage] = useState("")
const [mode,setMode] = useState("")

useEffect(()=>{

if(checkAdminSession()){
navigate("/admin-dashboard")
}

},[])

const handleLogin = async (e)=>{

e.preventDefault()

setMessage("")
setMode("")

setLoading(true)

const result = await loginAdmin(email,pin)

setLoading(false)

if(!result.success){
setMessage(result.error?.message || "Invalid phone or PIN")
setMode("error")
return
}

setMode(result.source === "demo" ? "demo" : "live")
setMessage(result.source === "demo"
? "Demo backend active. Supabase fallback login successful."
: "Live backend connected. Login successful."
)

navigate("/admin-dashboard")

}

return(

<div className="adminLogin">

<div className="loginCard">

<button
type="button"
className="adminExitBtn"
onClick={()=>navigate("/")}
>
Exit to Website
</button>

<BrandLogo />

<h2>Admin Control Center</h2>
<p className="loginSubtext">Manage clients, services, profiles, and business records from one secure dashboard.</p>

<form onSubmit={handleLogin}>

<input
type="email"
placeholder="Official Admin Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<div className="pinBox">

<input
type={showPin ? "text":"password"}
placeholder="6 Digit PIN"
maxLength="6"
value={pin}
onChange={(e)=>setPin(e.target.value)}
/>

<span onClick={()=>setShowPin(!showPin)}>
{showPin ? <FaEyeSlash/> : <FaEye/>}
</span>

</div>

<button type="submit" disabled={loading}>
{loading ? "Checking..." : "Login"}
</button>

</form>

<button
type="button"
className="forgotPinBtn"
onClick={()=>setShowForget(true)}
>
Forgot PIN?
</button>

{message &&
<p className={`loginMessage ${mode}`}>
{message}
</p>
}

</div>

{showForget &&
<ForgetPinModal close={()=>setShowForget(false)}/>
}

</div>

)

}

export default AdminLogin
