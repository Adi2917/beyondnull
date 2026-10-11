import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaBriefcase, FaHome, FaPlus, FaSearch, FaSignOutAlt, FaUsers } from "react-icons/fa"
import { checkAdminSession, getClients, getEmployees, logoutAdmin } from "../services/authService"
import ClientCard from "../Components/ClientCard"
import SearchBar from "../Components/SearchBar"
import AddClientModal from "../Components/AddClientModal"
import AddEmployeeModal from "../Components/AddEmployeeModal"
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal"
import BrandLogo from "../Components/BrandLogo"
import "./AdminDashboard.css"

function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("clients")
  const [clients, setClients] = useState([])
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState("")
  const [showAddClient, setShowAddClient] = useState(false)
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [backendMessage, setBackendMessage] = useState("")

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    const [clientResult, employeeResult] = await Promise.all([getClients(), getEmployees()])
    setClients(clientResult.data || [])
    setEmployees(employeeResult.data || [])
    const error = clientResult.error || employeeResult.error
    setBackendMessage(error ? "Records could not be loaded. Check the Google Apps Script deployment." : "")
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!checkAdminSession()) return navigate("/admin")
    let active = true
    Promise.all([getClients(), getEmployees()]).then(([clientResult, employeeResult]) => {
      if (!active) return
      setClients(clientResult.data || [])
      setEmployees(employeeResult.data || [])
      const error = clientResult.error || employeeResult.error
      setBackendMessage(error ? "Records could not be loaded. Check the Google Apps Script deployment." : "")
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

  const visibleRecords = activeTab === "clients" ? filteredClients : filteredEmployees

  const logout = () => {
    logoutAdmin()
    navigate("/admin")
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="logoBox"><BrandLogo /><div className="dashboardTitle"><span>Secure operations</span><h1>Admin Studio</h1><p>Clients, projects, team profiles and payouts in one workspace.</p></div></div>
        <div className="headerBtns"><button onClick={() => navigate("/")}><FaHome /> <span>Website</span></button><button onClick={logout}><FaSignOutAlt /> <span>Logout</span></button></div>
      </header>

      <section className="admin-overview">
        <div><small>Total clients</small><strong>{clients.length}</strong><span>Business accounts</span></div>
        <div><small>Team members</small><strong>{employees.length}</strong><span>Employee profiles</span></div>
        <div><small>Active services</small><strong>{clients.reduce((sum, client) => sum + (client.projects?.filter((project) => project.work_status === "Running").length || 0), 0)}</strong><span>Currently running</span></div>
      </section>

      <nav className="admin-tabs" aria-label="Admin sections">
        <button className={activeTab === "clients" ? "active" : ""} onClick={() => { setActiveTab("clients"); setSearch("") }}><FaBriefcase /><span>Clients</span><b>{clients.length}</b></button>
        <button className={activeTab === "employees" ? "active" : ""} onClick={() => { setActiveTab("employees"); setSearch("") }}><FaUsers /><span>Employees</span><b>{employees.length}</b></button>
      </nav>

      <section className="records-shell">
        <div className="dashboard-top">
          <div className="sectionTitle"><span>{activeTab === "clients" ? "Client records" : "Team directory"}</span><h2>{activeTab === "clients" ? "Business pipeline" : "Employees & payroll"}</h2></div>
          <SearchBar search={search} setSearch={setSearch} />
          <button className="addClientBtn" onClick={() => activeTab === "clients" ? setShowAddClient(true) : setShowAddEmployee(true)}><FaPlus /> {activeTab === "clients" ? "Add client" : "Add employee"}</button>
        </div>

        {backendMessage && <div className="backend-notice">{backendMessage}</div>}

        <div className={activeTab === "clients" ? "clientGrid" : "employeeGrid"}>
          {visibleRecords.length === 0 ? (
            <div className="empty"><strong>{loading ? "Loading records..." : `No ${activeTab} found`}</strong><span>{loading ? "Connecting to secure records" : `Create the first ${activeTab === "clients" ? "client record" : "employee profile"}.`}</span></div>
          ) : activeTab === "clients" ? filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} onDelete={(id) => setDeleteId(id)} />
          )) : filteredEmployees.map((employee) => (
            <article className="employee-card" key={employee.id} onClick={() => navigate(`/employee/${employee.id}`)}>
              <div className="employee-card-top"><div className="employee-avatar">{employee.name?.charAt(0).toUpperCase()}</div><span>{employee.job_type === "Custom" ? employee.custom_job_type : employee.job_type}</span></div>
              <h3>{employee.name}</h3><p>{employee.job_role}</p>
              <div className="employee-card-meta"><span>{employee.phone}</span><strong>Rs {Number(employee.salary || 0).toLocaleString("en-IN")}/mo</strong></div>
              <button type="button">View profile</button>
            </article>
          ))}
        </div>
        <p className="total">Showing {visibleRecords.length} of {activeTab === "clients" ? clients.length : employees.length} {activeTab}</p>
      </section>

      {showAddClient && <AddClientModal onClose={() => setShowAddClient(false)} refreshClients={fetchRecords} />}
      {showAddEmployee && <AddEmployeeModal onClose={() => setShowAddEmployee(false)} refreshEmployees={fetchRecords} />}
      {deleteId && <ConfirmDeleteModal clientId={deleteId} close={() => setDeleteId(null)} refresh={fetchRecords} />}
    </main>
  )
}

export default AdminDashboard
