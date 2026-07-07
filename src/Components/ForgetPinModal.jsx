import { useState } from "react"
import { supabase } from "../services/supabaseClient"
import "./ForgetPinModal.css"

function ForgetPinModal({close}){

const [phone,setPhone] = useState("")
const [pin,setPin] = useState("")
const [confirm,setConfirm] = useState("")

const handleSubmit = async (e)=>{

e.preventDefault()

if(pin !== confirm){
alert("PIN not match")
return
}

if(!/^[0-9]{6}$/.test(pin)){
alert("PIN must be 6 digits")
return
}

if(!/^[0-9]{10}$/.test(phone)){
alert("Enter valid 10 digit admin phone")
return
}

const {data:admin,error:findError} = await supabase
.from("admins")
.select("id")
.eq("phone",phone)
.maybeSingle()

if(findError || !admin){
alert("Admin not found")
return
}

const {error} = await supabase
.from("admins")
.update({pin:pin})
.eq("id",admin.id)

if(error){
alert("PIN update failed")
return
}

alert("PIN Updated")

close()

}

return(

<div className="modalOverlay">

<div className="modalCard">

<h3>Reset Admin PIN</h3>

<form onSubmit={handleSubmit}>

<input
placeholder="Admin Phone"
onChange={(e)=>setPhone(e.target.value)}
required
/>

<input
placeholder="New PIN"
maxLength="6"
onChange={(e)=>setPin(e.target.value)}
required
/>

<input
placeholder="Confirm PIN"
maxLength="6"
onChange={(e)=>setConfirm(e.target.value)}
required
/>

<div className="modalActions">

<button type="submit">
Update PIN
</button>

<button
type="button"
className="cancelBtn"
onClick={close}
>
Cancel
</button>

</div>

</form>

</div>

</div>

)

}

export default ForgetPinModal
