import { useState } from "react"
import { FaTimes } from "react-icons/fa"
import { supabase } from "../services/supabaseClient"
import "./AddClientModal.css"

function AddClientModal({ onClose, refreshClients }) {

const [form,setForm] = useState({
name:"",
phone:"",
email:"",
address:"",
district:"",
amount:""
})

const [services,setServices] = useState([])

const serviceList = [
"Web Development",
"App Development",
"Social Media Marketing",
"Social Media Management"
]

const handleService = (service)=>{

if(services.includes(service)){
setServices(services.filter(s=>s!==service))
}else{
setServices([...services,service])
}

}

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value})
}

const handleSubmit = async (e)=>{

e.preventDefault()

if(services.length===0){
alert("Select at least one service")
return
}

const { error } = await supabase
.from("clients")
.insert([{
name:form.name,
phone:form.phone,
email:form.email,
address:form.address,
district:form.district,
package_amount:form.amount,
services:services
}])

if(error){
alert("Error adding client")
console.log(error)
return
}

refreshClients()
onClose()

}

return(

<div className="modal-overlay">

<div className="modal-box">

<div className="modal-header">

<h2>Add Client</h2>

<button className="close-btn" onClick={onClose}>
<FaTimes/>
</button>

</div>

<form onSubmit={handleSubmit} className="modal-form">

<input name="name" placeholder="Client Name" required onChange={handleChange}/>
<input name="phone" placeholder="Phone (10 digit)" maxLength="10" required onChange={handleChange}/>
<input name="email" placeholder="Email" onChange={handleChange}/>
<input name="address" placeholder="Address" onChange={handleChange}/>
<input name="district" placeholder="District" onChange={handleChange}/>

<p className="service-title">Select Services</p>

<div className="service-grid">

{serviceList.map((service)=>(

<div
key={service}
className={`service-card ${services.includes(service) ? "active":""}`}
onClick={()=>handleService(service)}
>
{service}
</div>

))}

</div>

<input name="amount" placeholder="Package Amount" onChange={handleChange}/>

<div className="modal-actions">

<button className="add-btn" type="submit">
Add Client
</button>

<button type="button" className="cancel-btn" onClick={onClose}>
Cancel
</button>

</div>

</form>

</div>

</div>

)

}

export default AddClientModal