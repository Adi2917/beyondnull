import ClientCard from "./ClientCard"
import "./ClientList.css"

function ClientList({clients=[]}){

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
