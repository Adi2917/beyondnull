import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaBookOpen, FaBriefcase, FaEdit, FaExternalLinkAlt, FaHome, FaPlus, FaSignOutAlt, FaTrash, FaUsers } from "react-icons/fa"
import { checkAdminSession, deleteResource, getClients, getEmployees, getPublishedResources, logoutAdmin } from "../services/authService"
import ClientCard from "../Components/ClientCard"
import SearchBar from "../Components/SearchBar"
import AddClientModal from "../Components/AddClientModal"
import AddEmployeeModal from "../Components/AddEmployeeModal"
import AddResourceModal from "../Components/AddResourceModal"
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal"
import BrandLogo from "../Components/BrandLogo"
import "./AdminDashboard.css"
import { ACCESS_PATH, employeeProfilePath } from "../portalRoutes"

function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("clients")
  const [clients, setClients] = useState([])
  const [employees, setEmployees] = useState([])
  const [resources, setResources] = useState([])
  const [search, setSearch] = useState("")
  const [showAddClient, setShowAddClient] = useState(false)
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [showAddResource, setShowAddResource] = useState(false)
  const [editClient, setEditClient] = useState(null)
  const [editEmployee, setEditEmployee] = useState(null)
  const [editResource, setEditResource] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [backendErrors, setBackendErrors] = useState({})

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    const [clientResult, employeeResult, resourceResult] = await Promise.all([getClients(), getEmployees(), getPublishedResources()])
    setClients(clientResult.data || [])
    setEmployees(employeeResult.data || [])
    setResources(resourceResult.data || [])
    setBackendErrors({ clients: clientResult.error, employees: employeeResult.error, resources: resourceResult.error })
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!checkAdminSession()) return navigate(ACCESS_PATH)
    let active = true
    Promise.all([getClients(), getEmployees(), getPublishedResources()]).then(([clientResult, employeeResult, resourceResult]) => {
      if (!active) return
      setClients(clientResult.data || [])
      setEmployees(employeeResult.data || [])
      setResources(resourceResult.data || [])
      setBackendErrors({ clients: clientResult.error, employees: employeeResult.error, resources: resourceResult.error })
      setLoading(false)
    })
    return () => { active = false }
  }, [navigate])

  const filteredClients = useMemo(() => clients.filter((client) => {
    const query = search.toLowerCase()
    return [client.name, client.phone, client.district].some((value) => String(value || "").toLowerCase().includes(query))
  }), [clients, search])

  const filteredEmployees = useMemo(() => employees.filter((employee) => {
    const query = search.toLowerCase()
    return [employee.name, employee.phone, employee.job_role, employee.job_type].some((value) => String(value || "").toLowerCase().includes(query))
  }), [employees, search])

  const filteredResources = useMemo(() => resources.filter((resource) => {
    const query = search.toLowerCase()
    return [resource.title, resource.subtitle, resource.category].some((value) => String(value || "").toLowerCase().includes(query))
  }), [resources, search])

  const visibleRecords = activeTab === "clients" ? filteredClients : activeTab === "employees" ? filteredEmployees : filteredResources

  const tabCopy = {
    clients: { eyebrow: "Client records", title: "Business pipeline", action: "Add client" },
    employees: { eyebrow: "Team directory", title: "Employees & payroll", action: "Add employee" },
    resources: { eyebrow: "Published content", title: "Resource library", action: "Add resource" }
  }[activeTab]

  const openAddModal = () => {
    if (activeTab === "clients") setShowAddClient(true)
    else if (activeTab === "employees") setShowAddEmployee(true)
    else setShowAddResource(true)
  }

  const removeResource = async (resource) => {
    if (!window.confirm(`Delete "${resource.title}" from the resource library?`)) return
    const { error } = await deleteResource(resource.id)
    if (error) return alert(error.message || "Could not delete resource")
    await fetchRecords()
  }

  const logout = () => {
    logoutAdmin()
    navigate(ACCESS_PATH)
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="logoBox"><BrandLogo /><div className="dashboardTitle"><span>Secure operations</span><h1>Admin Studio</h1><p>Clients, projects, team profiles, payouts and published resources in one workspace.</p></div></div>
        <div className="headerBtns"><button onClick={() => navigate("/")}><FaHome /> <span>Website</span></button><button onClick={logout}><FaSignOutAlt /> <span>Logout</span></button></div>
      </header>

      <section className="admin-overview">
        <div><small>Total clients</small><strong>{clients.length}</strong><span>Business accounts</span></div>
        <div><small>Team members</small><strong>{employees.length}</strong><span>Employee profiles</span></div>
        <div><small>Active services</small><strong>{clients.reduce((sum, client) => sum + (client.projects?.filter((project) => project.work_status === "Running").length || 0), 0)}</strong><span>Currently running</span></div>
        <div><small>Published resources</small><strong>{resources.length}</strong><span>Managed articles</span></div>
      </section>

      <nav className="admin-tabs" aria-label="Admin sections">
        <button className={activeTab === "clients" ? "active" : ""} onClick={() => { setActiveTab("clients"); setSearch("") }}><FaBriefcase /><span>Clients</span><b>{clients.length}</b></button>
        <button className={activeTab === "employees" ? "active" : ""} onClick={() => { setActiveTab("employees"); setSearch("") }}><FaUsers /><span>Employees</span><b>{employees.length}</b></button>
        <button className={activeTab === "resources" ? "active" : ""} onClick={() => { setActiveTab("resources"); setSearch("") }}><FaBookOpen /><span>Resources</span><b>{resources.length}</b></button>
      </nav>

      <section className="records-shell">
        <div className="dashboard-top">
          <div className="sectionTitle"><span>{tabCopy.eyebrow}</span><h2>{tabCopy.title}</h2></div>
          <SearchBar search={search} setSearch={setSearch} />
          <button className="addClientBtn" onClick={openAddModal}><FaPlus /> {tabCopy.action}</button>
        </div>

        {backendErrors[activeTab] && <div className="backend-notice">{backendErrors[activeTab].message || "Records could not be loaded. Check the Google Apps Script deployment."}</div>}

        <div className={activeTab === "clients" ? "clientGrid" : activeTab === "employees" ? "employeeGrid" : "resource-admin-grid"}>
          {visibleRecords.length === 0 ? (
            <div className="empty"><strong>{loading ? "Loading records..." : `No ${activeTab} found`}</strong><span>{loading ? "Connecting to secure records" : `Create the first ${activeTab === "clients" ? "client record" : activeTab === "employees" ? "employee profile" : "published resource"}.`}</span></div>
          ) : activeTab === "clients" ? filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} onEdit={setEditClient} onDelete={(id) => setDeleteId(id)} />
          )) : activeTab === "employees" ? filteredEmployees.map((employee) => (
            <article className="employee-card" key={employee.id} onClick={() => navigate(employeeProfilePath(employee.id))}>
              <div className="employee-card-top"><div className="employee-avatar">{employee.name?.charAt(0).toUpperCase()}</div><span>{employee.job_type === "Custom" ? employee.custom_job_type : employee.job_type}</span></div>
              <h3>{employee.name}</h3><p>{employee.job_role}</p>
              <div className="employee-card-meta"><span>{employee.phone}</span><strong>Rs {Number(employee.salary || 0).toLocaleString("en-IN")}/mo</strong></div>
              <div className="employee-card-actions"><button type="button" onClick={(event) => { event.stopPropagation(); navigate(employeeProfilePath(employee.id)) }}>View profile</button><button type="button" onClick={(event) => { event.stopPropagation(); setEditEmployee(employee) }}><FaEdit /> Edit</button></div>
            </article>
          )) : filteredResources.map((resource) => (
            <article className="resource-admin-card" key={resource.id}>
              <div className="resource-admin-visual"><img src={resource.image || resource.logo || "/beyondnull-official-logo.jpg"} alt="" /><span>{resource.category}</span></div>
              <div className="resource-admin-copy"><small>{resource.readTime}</small><h3>{resource.title}</h3><p>{resource.subtitle || resource.excerpt || "Published BeyondNull resource"}</p></div>
              <div className="resource-admin-actions"><button type="button" onClick={() => navigate(`/resources/${resource.slug}`)}><FaExternalLinkAlt /> View</button><button type="button" onClick={() => setEditResource(resource)}><FaEdit /> Edit</button><button type="button" className="danger" onClick={() => removeResource(resource)}><FaTrash /> Delete</button></div>
            </article>
          ))}
        </div>
        <p className="total">Showing {visibleRecords.length} of {activeTab === "clients" ? clients.length : activeTab === "employees" ? employees.length : resources.length} {activeTab}</p>
      </section>

      {showAddClient && <AddClientModal onClose={() => setShowAddClient(false)} refreshClients={fetchRecords} />}
      {showAddEmployee && <AddEmployeeModal onClose={() => setShowAddEmployee(false)} refreshEmployees={fetchRecords} />}
      {showAddResource && <AddResourceModal onClose={() => setShowAddResource(false)} refreshResources={fetchRecords} />}
      {editClient && <AddClientModal client={editClient} onClose={() => setEditClient(null)} refreshClients={fetchRecords} />}
      {editEmployee && <AddEmployeeModal employee={editEmployee} onClose={() => setEditEmployee(null)} refreshEmployees={fetchRecords} />}
      {editResource && <AddResourceModal resource={editResource} onClose={() => setEditResource(null)} refreshResources={fetchRecords} />}
      {deleteId && <ConfirmDeleteModal clientId={deleteId} close={() => setDeleteId(null)} refresh={fetchRecords} />}
    </main>
  )
}

export default AdminDashboard
