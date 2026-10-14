import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"

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
import EmployeeProfile from "./Pages/EmployeeProfile"

import ProtectedRoute from "./Components/ProtectedRoute"
import SeoManager from "./Components/SeoManager"
import DiscoveryCallModal from "./Components/DiscoveryCallModal"
import { ACCESS_PATH, WORKSPACE_PATH } from "./portalRoutes"

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

<Route path={ACCESS_PATH} element={<AdminLogin/>}/>

<Route
path={WORKSPACE_PATH}
element={
<ProtectedRoute>
<AdminDashboard/>
</ProtectedRoute>
}
/>

<Route
path={`${WORKSPACE_PATH}/client/:id`}
element={
<ProtectedRoute>
<ClientProfile/>
</ProtectedRoute>
}
/>

<Route
path={`${WORKSPACE_PATH}/employee/:id`}
element={
<ProtectedRoute>
<EmployeeProfile/>
</ProtectedRoute>
}
/>

<Route path="*" element={<Navigate to="/" replace />}/>

</Routes>

</BrowserRouter>

)

}

export default App
