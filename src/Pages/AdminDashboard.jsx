import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaBookOpen, FaBriefcase, FaEdit, FaExternalLinkAlt, FaFileInvoiceDollar, FaHome, FaPlus, FaSignOutAlt, FaTrash, FaUsers, FaWallet } from "react-icons/fa"
import { checkAdminSession, deleteFinanceEntry, deleteResource, downloadClientPaymentProof, downloadEmployeeReceipt, downloadFinanceProof, getClients, getEmployees, getFinanceOverview, getPublishedResources, logoutAdmin } from "../services/authService"
import ClientCard from "../Components/ClientCard"
import SearchBar from "../Components/SearchBar"
import AddClientModal from "../Components/AddClientModal"
import AddEmployeeModal from "../Components/AddEmployeeModal"
import AddResourceModal from "../Components/AddResourceModal"
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal"
import BrandLogo from "../Components/BrandLogo"
import FinanceEntryModal from "../Components/FinanceEntryModal"
import "./AdminDashboard.css"
import { ACCESS_PATH, employeeProfilePath } from "../portalRoutes"

const currentFinanceMonth = () => {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return date.toISOString().slice(0, 7)
}

const financeMonthLabel = (month) => new Date(`${month}-01T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
const currentCycleDates = () => {
  const month = currentFinanceMonth()
  const next = new Date(`${month}-01T00:00:00`)
  next.setMonth(next.getMonth() + 1)
  return { from: `${month}-08`, to: `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-07` }
}
const money = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`

function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("clients")
  const [clients, setClients] = useState([])
  const [employees, setEmployees] = useState([])
  const [resources, setResources] = useState([])
  const [finance, setFinance] = useState(null)
  const [financeMonth, setFinanceMonth] = useState(currentFinanceMonth)
  const [financeMode, setFinanceMode] = useState("month")
  const [financeFrom, setFinanceFrom] = useState(() => currentCycleDates().from)
  const [financeTo, setFinanceTo] = useState(() => currentCycleDates().to)
  const [financeFilter, setFinanceFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [showAddClient, setShowAddClient] = useState(false)
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [showAddResource, setShowAddResource] = useState(false)
  const [financeEntryType, setFinanceEntryType] = useState("")
  const [editClient, setEditClient] = useState(null)
  const [editEmployee, setEditEmployee] = useState(null)
  const [editResource, setEditResource] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [backendErrors, setBackendErrors] = useState({})

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    const customDates = financeMode === "custom" ? [financeFrom, financeTo] : ["", ""]
    const [clientResult, employeeResult, resourceResult, financeResult] = await Promise.all([getClients(), getEmployees(), getPublishedResources(), getFinanceOverview(financeMonth, ...customDates)])
    setClients(clientResult.data || [])
    setEmployees(employeeResult.data || [])
    setResources(resourceResult.data || [])
    setFinance(financeResult.data || null)
    setBackendErrors({ clients: clientResult.error, employees: employeeResult.error, resources: resourceResult.error, finance: financeResult.error })
    setLoading(false)
  }, [financeFrom, financeMode, financeMonth, financeTo])

  useEffect(() => {
    if (!checkAdminSession()) return navigate(ACCESS_PATH)
    const timer = window.setTimeout(fetchRecords, 0)
    return () => window.clearTimeout(timer)
  }, [fetchRecords, navigate])

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

  const filteredFinanceEntries = useMemo(() => (finance?.entries || []).filter((entry) => {
    if (financeFilter === "in") return entry.kind === "income"
    if (financeFilter === "out") return entry.kind === "expense"
    if (financeFilter === "salary") return entry.source === "salary"
    return true
  }), [finance, financeFilter])

  const visibleRecords = activeTab === "clients" ? filteredClients : activeTab === "employees" ? filteredEmployees : activeTab === "resources" ? filteredResources : filteredFinanceEntries

  const tabCopy = {
    clients: { eyebrow: "Client records", title: "Business pipeline", action: "Add client" },
    employees: { eyebrow: "Team directory", title: "Employees & payroll", action: "Add employee" },
    resources: { eyebrow: "Published content", title: "Resource library", action: "Add resource" },
    finance: { eyebrow: "Cash flow", title: "Finance control" }
  }[activeTab]

  const openAddModal = () => {
    if (activeTab === "clients") setShowAddClient(true)
    else if (activeTab === "employees") setShowAddEmployee(true)
    else if (activeTab === "resources") setShowAddResource(true)
  }

  const removeResource = async (resource) => {
    if (!window.confirm(`Delete "${resource.title}" from the resource library?`)) return
    const { error } = await deleteResource(resource.id)
    if (error) return alert(error.message || "Could not delete resource")
    await fetchRecords()
  }

  const removeFinanceEntry = async (entry) => {
    if (!window.confirm(`Delete finance entry "${entry.name}"?`)) return
    const { error } = await deleteFinanceEntry(entry.id)
    if (error) return alert(error.message || "Could not delete finance entry")
    await fetchRecords()
  }

  const openFinanceProof = async (entry) => {
    const { data, error } = await downloadFinanceProof(entry.id)
    if (error) return alert(error.message || "Could not download finance proof")
    const link = document.createElement("a")
    link.href = data.data
    link.download = data.name || "finance-proof"
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const openClientPaymentProof = async (entry) => {
    const { data, error } = await downloadClientPaymentProof(entry.client_payment_id)
    if (error) return alert(error.message || "Could not download client payment proof")
    const link = document.createElement("a")
    link.href = data.data
    link.download = data.name || "client-payment-proof"
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const viewSalaryReceipt = async (entry) => {
    const preview = window.open("", "_blank")
    if (!preview) return alert("Please allow pop-ups to view the receipt")
    preview.document.write("<p style='font-family:Arial;padding:24px'>Loading salary receipt...</p>")
    const { data, error } = await downloadEmployeeReceipt(entry.payout_id)
    if (error) { preview.close(); return alert(error.message || "Could not open salary receipt") }
    const response = await fetch(data.data)
    const blobUrl = URL.createObjectURL(await response.blob())
    preview.location.href = blobUrl
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
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
        <button className={activeTab === "finance" ? "active" : ""} onClick={() => { setActiveTab("finance"); setSearch("") }}><FaWallet /><span>Finance</span><b>{finance?.entries?.length || 0}</b></button>
      </nav>

      <section className="records-shell">
        <div className="dashboard-top">
          <div className="sectionTitle"><span>{tabCopy.eyebrow}</span><h2>{tabCopy.title}</h2></div>
          {activeTab === "finance" ? <div className="finance-toolbar">
            <div className="finance-mode-switch"><button className={financeMode === "month" ? "active" : ""} onClick={() => setFinanceMode("month")}>Monthly cycle</button><button className={financeMode === "custom" ? "active" : ""} onClick={() => setFinanceMode("custom")}>Custom dates</button></div>
            {financeMode === "month" ? <label><span>Finance month</span><select value={financeMonth} onChange={(event) => setFinanceMonth(event.target.value)}>{(finance?.available_months || [financeMonth]).map((month) => <option key={month} value={month}>{financeMonthLabel(month)}</option>)}</select></label> : <><label><span>From</span><input type="date" value={financeFrom} onChange={(event) => setFinanceFrom(event.target.value)} /></label><label><span>To</span><input type="date" value={financeTo} onChange={(event) => setFinanceTo(event.target.value)} /></label></>}
            <button className="finance-income-btn" onClick={() => setFinanceEntryType("income")}><FaPlus /> Add funds</button><button className="finance-expense-btn" onClick={() => setFinanceEntryType("expense")}><FaPlus /> Add expense</button>
          </div> : <><SearchBar search={search} setSearch={setSearch} /><button className="addClientBtn" onClick={openAddModal}><FaPlus /> {tabCopy.action}</button></>}
        </div>

        {backendErrors[activeTab] && <div className="backend-notice">{backendErrors[activeTab].message || "Records could not be loaded. Check the Google Apps Script deployment."}</div>}

        {activeTab === "finance" ? <div className="finance-panel">
          <div className="finance-cycle-note"><FaFileInvoiceDollar /><div><strong>{finance?.custom_range ? "Custom finance report" : `${financeMonthLabel(financeMonth)} cycle`}</strong><span>{finance?.cycle_start ? `${new Date(`${finance.cycle_start}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} to ${new Date(`${finance.cycle_end}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : financeMode === "custom" ? "Select both dates" : "8th to next month 7th"}</span></div></div>
          <div className="finance-summary-grid">
            <article><span>Opening / carry</span><strong>{money(finance?.opening_balance)}</strong><small>Balance before this cycle</small></article>
            <article className="finance-positive"><span>Money received</span><strong>{money(finance?.income_total)}</strong><small>Client advances + added funds</small></article>
            <article className="finance-negative"><span>Salary paid</span><strong>{money(finance?.salary_total)}</strong><small>Employee payouts</small></article>
            <article className="finance-negative"><span>Other expenses</span><strong>{money(finance?.expense_total)}</strong><small>Manually added costs</small></article>
            <article className="finance-closing"><span>Closing balance</span><strong>{money(finance?.closing_balance)}</strong><small>Live company balance</small></article>
          </div>
          <div className="finance-ledger">
            <div className="finance-ledger-head"><div><span>Transactions</span><h3>Income and spending ledger</h3></div><b>{filteredFinanceEntries.length} of {finance?.entries?.length || 0} entries</b></div>
            <div className="finance-filters" aria-label="Finance transaction filters">{[{ id: "all", label: "All" }, { id: "in", label: "Amount in" }, { id: "out", label: "Amount out" }, { id: "salary", label: "Salary" }].map((filter) => <button type="button" className={financeFilter === filter.id ? "active" : ""} key={filter.id} onClick={() => setFinanceFilter(filter.id)}>{filter.label}</button>)}</div>
            {!filteredFinanceEntries.length ? <div className="empty"><strong>{loading ? "Loading finance records..." : "No matching transactions"}</strong><span>Change the date range or transaction filter.</span></div> : <div className="finance-table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Amount</th><th>Proof</th><th>Action</th></tr></thead><tbody>{filteredFinanceEntries.map((entry) => <tr key={entry.id}><td>{new Date(`${entry.date}T00:00:00`).toLocaleDateString("en-IN")}</td><td><span className={`finance-type ${entry.kind}`}>{entry.source === "client_payment" ? "Client payment" : entry.source === "salary" ? "Salary" : entry.source === "manual_expense" ? "Expense" : "Added funds"}</span></td><td><strong className="finance-entry-name">{entry.name}</strong>{entry.detail ? <small className="finance-entry-detail">{entry.detail}</small> : null}</td><td className={entry.kind === "income" ? "amount-in" : "amount-out"}>{entry.kind === "income" ? "+" : "-"}{money(entry.amount)}</td><td>{entry.source === "client_payment" && entry.has_proof ? <button className="finance-proof-btn" onClick={() => openClientPaymentProof(entry)}>View proof</button> : entry.has_proof && entry.managed ? <button className="finance-proof-btn" onClick={() => openFinanceProof(entry)}>View proof</button> : entry.source === "salary" && entry.has_proof ? <button className="finance-proof-btn" onClick={() => viewSalaryReceipt(entry)}>View receipt</button> : "-"}</td><td>{entry.managed ? <button className="finance-delete-btn" onClick={() => removeFinanceEntry(entry)}><FaTrash /> Delete</button> : entry.source === "client_payment" ? <button className="finance-profile-link" onClick={() => navigate(`/workspace-7x29/client/${entry.client_id}`)}>Client profile</button> : <span className="finance-auto">Automatic</span>}</td></tr>)}</tbody></table></div>}
          </div>
        </div> : <div className={activeTab === "clients" ? "clientGrid" : activeTab === "employees" ? "employeeGrid" : "resource-admin-grid"}>
          {visibleRecords.length === 0 ? (
            <div className="empty"><strong>{loading ? "Loading records..." : `No ${activeTab} found`}</strong><span>{loading ? "Connecting to secure records" : `Create the first ${activeTab === "clients" ? "client record" : activeTab === "employees" ? "employee profile" : "published resource"}.`}</span></div>
          ) : activeTab === "clients" ? filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} onEdit={setEditClient} onDelete={(id) => setDeleteId(id)} />
          )) : activeTab === "employees" ? filteredEmployees.map((employee) => (
            <article className="employee-card" key={employee.id} onClick={() => navigate(employeeProfilePath(employee.id))}>
              <div className="employee-card-top"><div className="employee-avatar">{employee.name?.charAt(0).toUpperCase()}</div><span>{employee.job_type === "Custom" ? employee.custom_job_type : employee.job_type}</span></div>
              <h3>{employee.name}</h3><p>{employee.job_role}</p>
              <div className="employee-card-meta"><span>{employee.phone}</span><strong>{Number(employee.salary || 0) > 0 ? `Rs ${Number(employee.salary).toLocaleString("en-IN")}/mo` : "Salary not fixed"}</strong></div>
              <div className="employee-card-actions"><button type="button" onClick={(event) => { event.stopPropagation(); navigate(employeeProfilePath(employee.id)) }}>View profile</button><button type="button" onClick={(event) => { event.stopPropagation(); setEditEmployee(employee) }}><FaEdit /> Edit</button></div>
            </article>
          )) : filteredResources.map((resource) => (
            <article className="resource-admin-card" key={resource.id}>
              <div className="resource-admin-visual"><img src={resource.image || resource.logo || "/beyondnull-official-logo.jpg"} alt="" /><span>{resource.category}</span></div>
              <div className="resource-admin-copy"><small>{resource.readTime}</small><h3>{resource.title}</h3><p>{resource.subtitle || resource.excerpt || "Published BeyondNull resource"}</p></div>
              <div className="resource-admin-actions"><button type="button" onClick={() => navigate(`/resources/${resource.slug}`)}><FaExternalLinkAlt /> View</button><button type="button" onClick={() => setEditResource(resource)}><FaEdit /> Edit</button><button type="button" className="danger" onClick={() => removeResource(resource)}><FaTrash /> Delete</button></div>
            </article>
          ))}
        </div>}
        {activeTab !== "finance" && <p className="total">Showing {visibleRecords.length} of {activeTab === "clients" ? clients.length : activeTab === "employees" ? employees.length : resources.length} {activeTab}</p>}
      </section>

      {showAddClient && <AddClientModal onClose={() => setShowAddClient(false)} refreshClients={fetchRecords} />}
      {showAddEmployee && <AddEmployeeModal onClose={() => setShowAddEmployee(false)} refreshEmployees={fetchRecords} />}
      {showAddResource && <AddResourceModal onClose={() => setShowAddResource(false)} refreshResources={fetchRecords} />}
      {editClient && <AddClientModal client={editClient} onClose={() => setEditClient(null)} refreshClients={fetchRecords} />}
      {editEmployee && <AddEmployeeModal employee={editEmployee} onClose={() => setEditEmployee(null)} refreshEmployees={fetchRecords} />}
      {editResource && <AddResourceModal resource={editResource} onClose={() => setEditResource(null)} refreshResources={fetchRecords} />}
      {financeEntryType && <FinanceEntryModal entryType={financeEntryType} onClose={() => setFinanceEntryType("")} refreshFinance={fetchRecords} />}
      {deleteId && <ConfirmDeleteModal clientId={deleteId} close={() => setDeleteId(null)} refresh={fetchRecords} />}
    </main>
  )
}

export default AdminDashboard
