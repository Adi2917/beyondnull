import { useEffect,useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaPlus,FaSignOutAlt,FaHome,FaUsers } from "react-icons/fa"
import { supabase } from "../services/supabaseClient"

import ClientCard from "../Components/ClientCard"
import SearchBar from "../Components/SearchBar"
import AddClientModal from "../Components/AddClientModal"
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal"

import logo from "../assets/logo.png"

import "./AdminDashboard.css"

function AdminDashboard(){

const navigate = useNavigate()

const [clients,setClients] = useState([])
const [search,setSearch] = useState("")
const [showAdd,setShowAdd] = useState(false)
const [deleteId,setDeleteId] = useState(null)

useEffect(()=>{

const logged = localStorage.getItem("adminLogged")

if(!logged){
navigate("/admin")
return
}

fetchClients()

},[])

const fetchClients = async ()=>{

const {data,error} = await supabase
.from("clients")
.select("*")
.order("created_at",{ascending:false})

if(!error){
setClients(data)
}

}

const logout = ()=>{

localStorage.removeItem("adminLogged")
navigate("/admin")

}

const filtered = clients.filter(c =>
c.name.toLowerCase().includes(search.toLowerCase()) ||
c.phone.includes(search)
)

return(

<div className="dashboard">

{/* HEADER */}

<div className="dashboard-header">

<div className="logoBox">

<img src={logo} alt="logo"/>

<h2>BeyondNull Admin</h2>

</div>

<div className="headerBtns">

<button onClick={()=>navigate("/")}>
<FaHome/> Exit
</button>

<button onClick={logout}>
<FaSignOutAlt/> Logout
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

<h3>{filtered.length}</h3>

<p>Search Result</p>

</div>

<div className="statCard">

<h3>{new Date().getFullYear()}</h3>

<p>Active Year</p>

</div>

</div>


{/* SEARCH + ADD */}

<div className="dashboard-top">

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

<p className="empty">No clients found</p>

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
Total Clients : {clients.length}
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