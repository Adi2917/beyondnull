import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaEye,FaEyeSlash } from "react-icons/fa"
import BrandLogo from "../Components/BrandLogo"
import "./AdminLogin.css"

import { supabase } from "../services/supabaseClient"
import ForgetPinModal from "../Components/ForgetPinModal"

function AdminLogin(){

const navigate = useNavigate()

const [phone,setPhone] = useState("")
const [pin,setPin] = useState("")
const [showPin,setShowPin] = useState(false)

const [showForget,setShowForget] = useState(false)

useEffect(()=>{

const logged = localStorage.getItem("adminLogged")

if(logged){
navigate("/admin-dashboard")
}

},[])

const handleLogin = async (e)=>{

e.preventDefault()

const cleanPhone = phone.trim()
const cleanPin = pin.trim()

if(!/^[0-9]{10}$/.test(cleanPhone)){
alert("Enter valid 10 digit admin phone")
return
}

if(!/^[0-9]{6}$/.test(cleanPin)){
alert("Enter valid 6 digit PIN")
return
}

const {data,error} = await supabase
.from("admins")
.select("*")
.eq("phone",cleanPhone)
.eq("pin",cleanPin)
.maybeSingle()

if(error){
console.log("Admin login error:", error)
alert(`Login setup error: ${error.message}`)
return
}

if(!data){
alert("Invalid phone or PIN")
return
}

localStorage.setItem("adminLogged","true")

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
type="tel"
placeholder="Admin Phone"
maxLength="10"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
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

<button type="submit">
Login
</button>

</form>

<p
className="forgetPin"
onClick={()=>setShowForget(true)}
>
Forgot PIN?
</p>

</div>

{showForget &&
<ForgetPinModal close={()=>setShowForget(false)}/>
}

</div>

)

}

export default AdminLogin
