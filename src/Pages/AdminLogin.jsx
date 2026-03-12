import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaEye,FaEyeSlash } from "react-icons/fa"
import logo from "../assets/logo.png"
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

const {data,error} = await supabase
.from("admins")
.select("*")
.eq("phone",phone)
.eq("pin",pin)
.single()

if(error){
alert("Invalid phone or PIN")
return
}

localStorage.setItem("adminLogged","true")

navigate("/admin-dashboard")

}

return(

<div className="adminLogin">

<div className="loginCard">

<img src={logo} alt="logo"/>

<h2>Admin Login</h2>

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