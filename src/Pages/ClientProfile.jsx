import { useEffect,useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import { supabase } from "../services/supabaseClient"
import { FaEdit,FaTrash } from "react-icons/fa"

import "./ClientProfile.css"

function ClientProfile(){

const { id } = useParams()

const navigate = useNavigate()

const [client,setClient] = useState(null)
const [loading,setLoading] = useState(true)
const [editMode,setEditMode] = useState(false)

const [form,setForm] = useState({})


/* =====================
FETCH CLIENT
===================== */

useEffect(()=>{

fetchClient()

},[])


const fetchClient = async ()=>{

const { data,error } = await supabase
.from("clients")
.select("*")
.eq("id",id)
.single()

if(error){

console.log(error)

setLoading(false)

return

}

setClient(data)

setForm(data)

setLoading(false)

}


/* =====================
HANDLE CHANGE
===================== */

const handleChange = (e)=>{

setForm({...form,[e.target.name]:e.target.value})

}


/* =====================
UPDATE CLIENT
===================== */

const updateClient = async ()=>{

const { error } = await supabase
.from("clients")
.update({
name:form.name,
phone:form.phone,
email:form.email,
address:form.address,
district:form.district,
package_amount:form.package_amount
})
.eq("id",id)

if(error){

alert("Update failed")

return

}

alert("Client Updated")

setEditMode(false)

fetchClient()

}


/* =====================
DELETE CLIENT
===================== */

const deleteClient = async ()=>{

const confirmDelete = window.confirm("Delete this client?")

if(!confirmDelete) return

const { error } = await supabase
.from("clients")
.delete()
.eq("id",id)

if(error){

alert("Delete failed")

return

}

alert("Client deleted")

navigate(-1)

}


/* =====================
LOADING
===================== */

if(loading){

return(

<div className="profile-loading">

Loading client...

</div>

)

}


/* =====================
UI
===================== */

return(

<div className="client-profile">

<div className="profile-card">

{/* HEADER */}

<div className="profile-header">

<div className="avatar">

{client.name?.charAt(0).toUpperCase()}

</div>

<div>

{editMode ? (

<input
name="name"
value={form.name}
onChange={handleChange}
/>

):( 

<h2>{client.name}</h2>

)}

<p className="district">{client.district}</p>

</div>

<div className="profile-icons">

<FaEdit onClick={()=>setEditMode(true)}/>

<FaTrash onClick={deleteClient}/>

</div>

</div>



{/* INFO GRID */}

<div className="info-grid">

<div className="info-item">

<span>Phone</span>

{editMode ? (

<input
name="phone"
value={form.phone}
onChange={handleChange}
/>

):( 

<p>{client.phone}</p>

)}

</div>

<div className="info-item">

<span>Email</span>

{editMode ? (

<input
name="email"
value={form.email}
onChange={handleChange}
/>

):( 

<p>{client.email || "Not provided"}</p>

)}

</div>

<div className="info-item">

<span>Address</span>

{editMode ? (

<input
name="address"
value={form.address}
onChange={handleChange}
/>

):( 

<p>{client.address || "Not provided"}</p>

)}

</div>

<div className="info-item">

<span>Package</span>

{editMode ? (

<input
name="package_amount"
value={form.package_amount}
onChange={handleChange}
/>

):( 

<p>₹ {client.package_amount}</p>

)}

</div>

</div>



{/* SERVICES */}

<div className="services">

<h3>Services</h3>

<div className="service-badges">

{client.services?.map((service,i)=>(

<span key={i} className="badge">

{service}

</span>

))}

</div>

</div>



{/* ACTIONS */}

<div className="profile-actions">

<a
href={`tel:${client.phone}`}
className="call-btn"
>
Call
</a>

<a
href={`https://wa.me/91${client.phone}`}
target="_blank"
className="whatsapp-btn"
>
WhatsApp
</a>

{editMode && (

<button
className="save-btn"
onClick={updateClient}
>
Save
</button>

)}

<button
className="back-btn"
onClick={()=>navigate(-1)}
>
Back
</button>

</div>

</div>

</div>

)

}

export default ClientProfile