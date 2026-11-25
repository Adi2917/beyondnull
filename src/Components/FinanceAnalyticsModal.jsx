import { useEffect, useMemo, useState } from "react"
import { FaChartBar, FaTimes } from "react-icons/fa"
import { getFinanceOverview } from "../services/authService"
import "./FinanceAnalyticsModal.css"

const money = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function FinanceAnalyticsModal({ onClose }) {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState("all")
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    getFinanceOverview(`${year}-01`, `${year}-01-01`, `${year}-12-31`).then((result) => {
      if (!active) return
      setEntries(result.data?.entries || [])
      setError(result.error?.message || "")
      setLoading(false)
    })
    return () => { active = false }
  }, [year])

  const report = useMemo(() => {
    const visible = month === "all" ? entries : entries.filter((entry) => Number(String(entry.date).slice(5, 7)) === Number(month))
    const income = visible.filter((entry) => entry.kind === "income").reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
    const out = visible.filter((entry) => entry.kind === "expense").reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
    const monthly = monthNames.map((label, index) => {
      const rows = entries.filter((entry) => Number(String(entry.date).slice(5, 7)) === index + 1)
      const incoming = rows.filter((entry) => entry.kind === "income").reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
      const outgoing = rows.filter((entry) => entry.kind === "expense").reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
      return { label, incoming, outgoing, net: incoming - outgoing }
    })
    const clients = {}
    visible.filter((entry) => entry.source === "client_payment").forEach((entry) => {
      const name = String(entry.name || "Client payment").split(" - ")[0]
      clients[name] = (clients[name] || 0) + Number(entry.amount || 0)
    })
    return { income, out, net: income - out, monthly, clients: Object.entries(clients).sort((a, b) => b[1] - a[1]) }
  }, [entries, month])

  const maxMovement = Math.max(1, ...report.monthly.flatMap((item) => [item.incoming, item.outgoing]))
  const maxClient = Math.max(1, ...report.clients.map((item) => item[1]))

  return <div className="analytics-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="analytics-modal" role="dialog" aria-modal="true" aria-label="Finance analytics">
      <header className="analytics-head">
        <div><span>Finance intelligence</span><h2><FaChartBar /> Cash-flow analytics</h2><p>Track money received, spending and client contribution.</p></div>
        <button type="button" onClick={onClose} aria-label="Close analytics"><FaTimes /></button>
      </header>
      <div className="analytics-controls">
        <label><span>Year</span><select value={year} onChange={(event) => {
          setLoading(true)
          setError("")
          setYear(Number(event.target.value))
        }}>{Array.from({ length: 5 }, (_, index) => currentYear - index).map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
        <label><span>Period</span><select value={month} onChange={(event) => setMonth(event.target.value)}><option value="all">Full year</option>{monthNames.map((name, index) => <option value={index + 1} key={name}>{name} {year}</option>)}</select></label>
      </div>
      {error ? <div className="analytics-error">{error}</div> : loading ? <div className="analytics-loading">Loading financial movement...</div> : <>
        <div className="analytics-kpis"><article><span>Money received</span><strong className="positive">{money(report.income)}</strong></article><article><span>Money out</span><strong className="negative">{money(report.out)}</strong></article><article><span>Net movement</span><strong className={report.net >= 0 ? "positive" : "negative"}>{report.net >= 0 ? "+" : "-"}{money(Math.abs(report.net))}</strong></article></div>
        <div className="analytics-grid">
          <article className="movement-chart"><div className="chart-title"><span>Monthly movement</span><b>{year}</b></div><div className="chart-bars">{report.monthly.map((item) => <div className="month-column" key={item.label}><div className="bar-pair"><i className="bar-in" style={{ height: `${Math.max(item.incoming ? 8 : 0, item.incoming / maxMovement * 100)}%` }} title={`In: ${money(item.incoming)}`} /><i className="bar-out" style={{ height: `${Math.max(item.outgoing ? 8 : 0, item.outgoing / maxMovement * 100)}%` }} title={`Out: ${money(item.outgoing)}`} /></div><span>{item.label}</span></div>)}</div><div className="chart-legend"><span><i className="in" />Money in</span><span><i className="out" />Money out</span></div></article>
          <article className="client-chart"><div className="chart-title"><span>Client contribution</span><b>{month === "all" ? "Year" : monthNames[Number(month) - 1]}</b></div>{report.clients.length ? <div className="client-bars">{report.clients.map(([name, value]) => <div className="client-bar" key={name}><div><span>{name}</span><strong>{money(value)}</strong></div><i><b style={{ width: `${value / maxClient * 100}%` }} /></i></div>)}</div> : <div className="analytics-empty">No client payments in this period.</div>}</article>
        </div>
      </>}
    </section>
  </div>
}

export default FinanceAnalyticsModal
