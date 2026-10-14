import { useNavigate } from "react-router-dom"
import { FaEdit, FaTrash } from "react-icons/fa"
import "./ClientCard.css"
import { clientProfilePath } from "../portalRoutes"

function ClientCard({client,onDelete,onEdit}){

const navigate = useNavigate()

return(

<div className="clientCard">

<div
className="clientMain"
onClick={()=>navigate(clientProfilePath(client.id))}
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

<div className="client-card-actions">
{onEdit && <button type="button" onClick={(event)=>{event.stopPropagation();onEdit(client)}} aria-label={`Edit ${client.name}`}><FaEdit /></button>}
{onDelete && <button type="button" className="deleteIcon" onClick={(event)=>{event.stopPropagation();onDelete(client.id)}} aria-label={`Delete ${client.name}`}><FaTrash /></button>}
</div>

</div>

)

}

export default ClientCard
