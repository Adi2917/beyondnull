import fs from "node:fs"

async function run() {
  const tabs = await (await fetch("http://127.0.0.1:9224/json/list")).json()
  const ws = new WebSocket(tabs[0].webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = reject
  })

  let nextId = 0
  const pending = new Map()
  ws.onmessage = event => {
    const message = JSON.parse(event.data)
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message)
      pending.delete(message.id)
    }
  }
  const send = (method, params = {}) => new Promise(resolve => {
    const id = ++nextId
    pending.set(id, resolve)
    ws.send(JSON.stringify({ id, method, params }))
  })
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
  const screenshot = async name => {
    const result = await send("Page.captureScreenshot", { format: "png", fromSurface: true })
    fs.writeFileSync(`.codex-tmp/${name}.png`, Buffer.from(result.result.data, "base64"))
  }

  await send("Page.enable")
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
  await send("Page.navigate", { url: "http://127.0.0.1:4180/portfolio/index.html" })
  await wait(1550)
  await screenshot("welcome-assembly")

  await send("Page.navigate", { url: "http://127.0.0.1:4180/portfolio/index.html?skipIntro=1" })
  await wait(900)
  await send("Runtime.evaluate", { expression: "document.querySelectorAll('.project-selector button')[3].click()" })
  await wait(400)
  await send("Runtime.evaluate", { expression: "document.querySelector('.open-project').click()" })
  await wait(700)
  const state = await send("Runtime.evaluate", {
    expression: "JSON.stringify({open:document.querySelector('.preview-modal').classList.contains('open'),snapshot:document.querySelector('.preview-modal').classList.contains('snapshot-preview'),frame:document.querySelector('.preview-modal iframe').src,fallback:getComputedStyle(document.querySelector('.preview-fallback')).display})",
    returnByValue: true
  })
  console.log(state.result.result.value)
  await screenshot("connect-fallback")
  ws.close()
}

run().catch(error => {
  console.error(error)
  process.exit(1)
})
