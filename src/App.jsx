import { BrowserRouter, Routes, Route } from "react-router-dom"

import ScrollToTop from "./ScrollToTop"

import Home from "./Pages/Home"
import About from "./Pages/About"
import Services from "./Pages/Service"
import Contact from "./Pages/Contact"

import AdminLogin from "./Pages/AdminLogin"
import AdminDashboard from "./Pages/AdminDashboard"
import ClientProfile from "./Pages/ClientProfile"

import ProtectedRoute from "./Components/ProtectedRoute"

function App(){

return(

<BrowserRouter>

<ScrollToTop/>

<Routes>

<Route path="/" element={<Home/>}/>
<Route path="/about" element={<About/>}/>
<Route path="/services" element={<Services/>}/>
<Route path="/contact" element={<Contact/>}/>

<Route path="/admin" element={<AdminLogin/>}/>

<Route
path="/admin-dashboard"
element={
<ProtectedRoute>
<AdminDashboard/>
</ProtectedRoute>
}
/>

<Route
path="/client/:id"
element={
<ProtectedRoute>
<ClientProfile/>
</ProtectedRoute>
}
/>

</Routes>

</BrowserRouter>

)

}

export default App