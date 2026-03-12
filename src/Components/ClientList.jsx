import { useEffect,useState } from "react"
import ClientCard from "./ClientCard"
import "./ClientList.css"

function ClientList(){

const [clients,setClients] = useState([])

useEffect(()=>{

// SUPABASE DATA FETCH YAHAN LAGEGA

},[])

return(

<div className="clientList">

{clients.length === 0 ?

<p className="empty">No Clients Yet</p>

:

clients.map(client => (

<ClientCard key={client.id} client={client}/>

))

}

</div>

)

}

export default ClientList