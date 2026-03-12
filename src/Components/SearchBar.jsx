import "./SearchBar.css"

function SearchBar({search,setSearch}){

return(

<input
className="searchBar"
placeholder="Search client..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

)

}

export default SearchBar