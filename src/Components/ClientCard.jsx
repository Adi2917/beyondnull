import { useNavigate } from "react-router-dom"
import { FaTrash } from "react-icons/fa"
import "./ClientCard.css"

function ClientCard({client,onDelete}){

const navigate = useNavigate()

return(

<div className="clientCard">

<div
className="clientMain"
onClick={()=>navigate(`/client/${client.id}`)}
>

<div className="avatar">
{client.name.charAt(0).toUpperCase()}
</div>

<div className="clientInfo">

<h4>{client.name}</h4>

<p>{client.phone}</p>

<span>{client.district}</span>

</div>

</div>

<FaTrash
className="deleteIcon"
onClick={()=>onDelete(client.id)}
/>

</div>

)

}

export default ClientCard