import { useState } from "react"
import { FaShieldAlt, FaTimes } from "react-icons/fa"
import {
  confirmAdminPinReset,
  requestAdminPinReset
} from "../services/authService"
import "./ForgetPinModal.css"

function ForgetPinModal({ close }) {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    pin: "",
    confirm: "",
    otp: ""
  })
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const sendOtp = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    if (form.pin !== form.confirm) {
      setLoading(false)
      setError("New PIN and confirm PIN do not match")
      return
    }

    const result = await requestAdminPinReset(form.email, form.phone)
    setLoading(false)

    if (!result.success) {
      setError(result.error?.message || "Could not send OTP")
      return
    }

    setOtpSent(true)
    setMessage(result.message)
  }

  const verifyOtp = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    const result = await confirmAdminPinReset(form)
    setLoading(false)

    if (!result.success) {
      setError(result.error?.message || "PIN reset failed")
      return
    }

    setMessage("PIN updated successfully. You can login with your new PIN.")
    setTimeout(close, 1200)
  }

  return (
    <div className="modalOverlay">
      <div className="modalCard resetPinCard">
        <button type="button" className="resetClose" onClick={close}>
          <FaTimes />
        </button>

        <div className="resetIcon">
          <FaShieldAlt />
        </div>

        <h3>Reset Admin PIN</h3>
        <p className="resetIntro">
          Enter the official admin email, registered admin number, and your new
          PIN. A 4 digit OTP will be sent to the official email and will stay
          valid for 5 minutes.
        </p>

        <form onSubmit={otpSent ? verifyOtp : sendOtp}>
          <input
            type="email"
            name="email"
            placeholder="Official admin email"
            value={form.email}
            onChange={updateField}
            disabled={otpSent}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Registered admin number"
            maxLength="10"
            value={form.phone}
            onChange={updateField}
            disabled={otpSent}
            required
          />

          <input
            type="password"
            name="pin"
            placeholder="New 6 digit PIN"
            maxLength="6"
            value={form.pin}
            onChange={updateField}
            disabled={otpSent}
            required
          />

          <input
            type="password"
            name="confirm"
            placeholder="Confirm new PIN"
            maxLength="6"
            value={form.confirm}
            onChange={updateField}
            disabled={otpSent}
            required
          />

          {otpSent && (
            <input
              type="text"
              name="otp"
              placeholder="Enter 4 digit OTP"
              maxLength="4"
              value={form.otp}
              onChange={updateField}
              required
            />
          )}

          {error && <p className="resetMessage error">{error}</p>}
          {message && <p className="resetMessage success">{message}</p>}

          <div className="modalActions">
            <button type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : otpSent
                  ? "Verify OTP & Update PIN"
                  : "Send OTP"}
            </button>

            <button
              type="button"
              className="cancelBtn"
              onClick={close}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgetPinModal
