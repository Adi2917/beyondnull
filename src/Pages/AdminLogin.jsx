import { useState } from "react"
import "./AdminLogin.css"

function AdminLogin(){

const [mobile,setMobile] = useState("")
const [pin,setPin] = useState("")

function handleLogin(){

if(mobile === "7485875137" && pin === "112233"){

alert("Login Successful")

}else{

alert("Invalid Mobile or PIN")

}

}

return(

<div className="admin-login">

<div className="login-card">

<h2>Admin Login</h2>

<input
type="text"
placeholder="Mobile Number"
value={mobile}
onChange={(e)=>setMobile(e.target.value)}
/>

<input
type="password"
placeholder="6 Digit PIN"
value={pin}
onChange={(e)=>setPin(e.target.value)}
/>

<button onClick={handleLogin}>
Login
</button>

<p className="forget">
Forget PIN?
</p>

</div>

</div>

)

}

export default AdminLogin