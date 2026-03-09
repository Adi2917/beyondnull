import { BrowserRouter, Routes, Route } from "react-router-dom"
import ScrollToTop from "./ScrollToTop";

import Home from "./Pages/Home"
import About from "./Pages/About"
import Services from "./Pages/Service"
import Contact from "./Pages/Contact"
import AdminLogin from "./Pages/AdminLogin"

function App() {

return (

<BrowserRouter>
<ScrollToTop />
<Routes>

<Route path="/" element={<Home/>}/>
<Route path="/about" element={<About/>}/>
<Route path="/services" element={<Services/>}/>
<Route path="/contact" element={<Contact/>}/>
<Route path="/admin" element={<AdminLogin/>}/>

</Routes>

</BrowserRouter>

)

}

export default App