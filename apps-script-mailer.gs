const TO_EMAIL = "beyoondnull@gmail.com"

function doPost(e) {
  const params = (e && e.parameter) || {}
  const subject = params.subject || "BeyondNull Security Notification"
  const plainBody = params.plainMessage || params.message || ""
  const htmlBody = params.htmlMessage || params.html_message || plainBody.replace(/\n/g, "<br>")

  MailApp.sendEmail({
    to: TO_EMAIL,
    subject,
    name: params.fromName || "BeyondNull Security",
    replyTo: params.email || TO_EMAIL,
    body: plainBody,
    htmlBody
  })

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON)
}

function doGet() {
  return ContentService
    .createTextOutput("BeyondNull mail bridge is active.")
    .setMimeType(ContentService.MimeType.TEXT)
}
