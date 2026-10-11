import { useEffect,useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import { deleteClient as removeClient, getClientById, updateClient as saveClient } from "../services/authService"
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
let active=true
getClientById(id).then(({data,error})=>{
if(!active) return
if(error){console.log(error);setLoading(false);return}
setClient(data)
setForm(data)
setLoading(false)
})
return()=>{active=false}
},[id])


async function fetchClient(){

const { data,error } = await getClientById(id)

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

const updateProjectStatus = (serviceType,status)=>{
setForm({...form,projects:(form.projects || []).map((project)=>project.service_type===serviceType ? {...project,work_status:status}:project)})
}


/* =====================
UPDATE CLIENT
===================== */

const updateClient = async ()=>{

if(!/^[0-9]{10}$/.test(form.phone || "")){
alert("Enter valid 10 digit phone number")
return
}

if(!Array.isArray(form.services) || form.services.length===0){
alert("Select at least one service")
return
}

const { error } = await saveClient(id,{
name:form.name,
phone:form.phone,
email:form.email,
address:form.address,
district:form.district,
package_amount:form.package_amount,
services:form.services,
projects:form.projects || []
})

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

const { error } = await removeClient(id)

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

if(!client){

return(

<div className="profile-loading">

Client not found

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

<div className="info-item"><span>Added on</span><p>{new Date(client.created_at).toLocaleDateString("en-IN")}</p></div>

</div>



{/* SERVICES */}

<div className="services">

<h3>Services</h3>

<div className="profile-projects">
{(editMode ? form.projects : client.projects)?.length ? (editMode ? form.projects : client.projects).map((project)=>(
<article className="profile-project" key={project.id || project.service_type}>
<div><strong>{project.service_type}</strong><span>{project.work_start_date ? `Started ${new Date(`${project.work_start_date}T00:00:00`).toLocaleDateString("en-IN")}` : "Start date not set"}</span></div>
{project.billing_type === "project" ? <p>Total: Rs {Number(project.total_amount || 0).toLocaleString("en-IN")} / Advance: Rs {Number(project.advance_amount || 0).toLocaleString("en-IN")} / Pending: Rs {Number(project.pending_amount || 0).toLocaleString("en-IN")}</p> : <p>Monthly: Rs {Number(project.monthly_package || 0).toLocaleString("en-IN")} / {(project.social_platforms || []).join(", ")}</p>}
{editMode ? <select value={project.work_status} onChange={(event)=>updateProjectStatus(project.service_type,event.target.value)}><option>Running</option><option>Paused</option><option>{project.billing_type === "project" ? "Delivered" : "Stopped"}</option></select> : <b className={`project-status ${project.work_status?.toLowerCase()}`}>{project.work_status}</b>}
</article>
)) : <p className="no-services">No structured services recorded</p>}
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
