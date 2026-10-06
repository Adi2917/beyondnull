import { BrowserRouter, Routes, Route } from "react-router-dom"

import ScrollToTop from "./ScrollToTop"

import Home from "./Pages/Home"
import About from "./Pages/About"
import Services from "./Pages/Service"
import Contact from "./Pages/Contact"
import Results from "./Pages/Results"
import Resources from "./Pages/Resources"

import AdminLogin from "./Pages/AdminLogin"
import AdminDashboard from "./Pages/AdminDashboard"
import ClientProfile from "./Pages/ClientProfile"

import ProtectedRoute from "./Components/ProtectedRoute"
import SeoManager from "./Components/SeoManager"
import DiscoveryCallModal from "./Components/DiscoveryCallModal"

function App(){

return(

<BrowserRouter>

<ScrollToTop/>
<SeoManager/>
<DiscoveryCallModal/>

<Routes>

<Route path="/" element={<Home/>}/>
<Route path="/about" element={<About/>}/>
<Route path="/services" element={<Services/>}/>
<Route path="/results" element={<Results/>}/>
<Route path="/resources" element={<Resources/>}/>
<Route path="/resources/:slug" element={<Resources/>}/>
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
