import "./AvatarCircle.css"

function AvatarCircle({name}){

const firstLetter = name ? name.charAt(0).toUpperCase() : "?"

return(

<div className="avatarCircle">
{firstLetter}
</div>

)

}

export default AvatarCircle