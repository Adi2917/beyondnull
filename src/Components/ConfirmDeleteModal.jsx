import { supabase } from "../services/supabaseClient"
import "./ConfirmDeleteModal.css"

function ConfirmDeleteModal({clientId,close,refresh}){

const handleDelete = async ()=>{

const {error} = await supabase
.from("clients")
.delete()
.eq("id",clientId)

if(error){
alert("Delete failed")
return
}

alert("Client deleted")

refresh()
close()

}

return(

<div className="deleteOverlay">

<div className="deleteCard">

<h3>Delete Client?</h3>

<p>This action cannot be undone</p>

<div className="deleteBtns">

<button
className="deleteBtn"
onClick={handleDelete}
>
Delete
</button>

<button
className="cancelBtn"
onClick={close}
>
Cancel
</button>

</div>

</div>

</div>

)

}

export default ConfirmDeleteModal