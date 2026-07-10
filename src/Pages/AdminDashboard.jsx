import { useEffect,useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaPlus,FaSignOutAlt,FaHome,FaUsers,FaSearch,FaCalendarAlt } from "react-icons/fa"
import { checkAdminSession, getClients, logoutAdmin } from "../services/authService"

import ClientCard from "../Components/ClientCard"
import SearchBar from "../Components/SearchBar"
import AddClientModal from "../Components/AddClientModal"
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal"

import BrandLogo from "../Components/BrandLogo"

import "./AdminDashboard.css"

function AdminDashboard(){

const navigate = useNavigate()

const [clients,setClients] = useState([])
const [search,setSearch] = useState("")
const [showAdd,setShowAdd] = useState(false)
const [deleteId,setDeleteId] = useState(null)
const [loading,setLoading] = useState(true)

useEffect(()=>{

if(!checkAdminSession()){
navigate("/admin")
return
}

fetchClients()

},[])

async function fetchClients(){

setLoading(true)

const {data,error} = await getClients()

if(error){
console.log("Client fetch error:", error)
setClients([])
}else{
setClients(data || [])
}

setLoading(false)

}

const logout = ()=>{

logoutAdmin()
navigate("/admin")

}

const filtered = clients.filter(c =>
(c.name || "").toLowerCase().includes(search.toLowerCase()) ||
(c.phone || "").includes(search) ||
(c.district || "").toLowerCase().includes(search.toLowerCase())
)

return(

<div className="dashboard">

{/* HEADER */}

<div className="dashboard-header">

<div className="logoBox">

<BrandLogo />

<div className="dashboardTitle">
<span>Admin Control Center</span>
<h2>Admin Studio</h2>
<p>Manage clients, project records, service details, and follow-ups.</p>
</div>

</div>

<div className="headerBtns">

<button onClick={()=>navigate("/")}>
<FaHome/> <span>Exit</span>
</button>

<button onClick={logout}>
<FaSignOutAlt/> <span>Logout</span>
</button>

</div>

</div>


{/* STATS */}

<div className="statsGrid">

<div className="statCard">

<FaUsers/>

<div>

<h3>{clients.length}</h3>

<p>Total Clients</p>

</div>

</div>

<div className="statCard">

<FaSearch/>

<div>

<h3>{filtered.length}</h3>

<p>Search Result</p>

</div>

</div>

<div className="statCard">

<FaCalendarAlt/>

<div>

<h3>{new Date().getFullYear()}</h3>

<p>Active Year</p>

</div>

</div>

</div>


{/* SEARCH + ADD */}

<div className="dashboard-top">

<div className="sectionTitle">
<span>Client Records</span>
<h3>Business Pipeline</h3>
</div>

<SearchBar
search={search}
setSearch={setSearch}
/>

<button
className="addClientBtn"
onClick={()=>setShowAdd(true)}
>
<FaPlus/> Add Client
</button>

</div>


{/* CLIENT GRID */}

<div className="clientGrid">

{filtered.length === 0 ?

<div className="empty">
<strong>{loading ? "Loading clients..." : "No clients found"}</strong>
<span>{loading ? "Connecting to backend records" : "Add your first client to test the full CRUD flow"}</span>
</div>

:

filtered.map(client=>(
<ClientCard
key={client.id}
client={client}
onDelete={(id)=>setDeleteId(id)}
/>
))

}

</div>

<p className="total">
Showing {filtered.length} of {clients.length} clients
</p>


{showAdd &&
<AddClientModal
onClose={()=>setShowAdd(false)}
refreshClients={fetchClients}
/>
}

{deleteId &&
<ConfirmDeleteModal
clientId={deleteId}
close={()=>setDeleteId(null)}
refresh={fetchClients}
/>
}

</div>

)

}

export default AdminDashboard
