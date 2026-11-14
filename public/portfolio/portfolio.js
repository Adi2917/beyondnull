(function () {
  const projects = [
    { name: "Razvi Decor", display: "Razvi<br>Decor", ghost: "RAZVI", category: "Interior & decor", type: "Website", line: "Crafted spaces, translated to screen", image: "./projects/razvi.png", url: "https://razvi-decor.vercel.app/" },
    { name: "Aarunya Yoga", display: "Aarunya<br>Yoga", ghost: "AARUNYA", category: "Wellness & yoga", type: "Website", line: "A calm interface with living energy", image: "./projects/aarunya.png", url: "https://aarunya-yoga.vercel.app/" },
    { name: "Caake Treet", display: "Caake<br>Treet", ghost: "CAKE", category: "Food & bakery", type: "Commerce", line: "A visual storefront made to feel delicious", image: "./projects/caake.png", url: "https://caake-treet.vercel.app/" },
    { name: "Connect Your School", display: "Connect<br>Your School", ghost: "CONNECT", category: "Education technology", type: "Platform", line: "One connected operating layer for schools", image: "./projects/connect.png", url: "https://connectyourschool.in/", embeddable: false },
    { name: "Social Controller", display: "Social<br>Controller", ghost: "SOCIAL", category: "Social media SaaS", type: "Product", line: "Control the entire content operation", image: "/products/social-controller.png", url: "https://socialcontroller.online/" },
    { name: "Little Wings Pre-School", display: "Little Wings<br>Pre-School", ghost: "WINGS", category: "Early education", type: "Website", line: "A playful first impression for young minds", image: "./projects/wings.png", url: "https://little-wings-pre-school-purnea.vercel.app/" }
  ]
  const intro = document.querySelector(".intro")
  const introNumber = intro.querySelector("strong")
  const introBar = intro.querySelector(".intro-progress i")
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches
  const query = new URLSearchParams(location.search)
  const requestedSection = query.get("section")
  const deepLinked = Boolean(location.hash) || query.has("skipIntro") || Boolean(requestedSection)
  if (deepLinked) intro.style.display = "none"
  if (deepLinked) addEventListener("load", () => {
    const target = document.querySelector(requestedSection ? "#" + requestedSection : location.hash)
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = "auto"
      if (target) scrollTo(0, target.offsetTop)
      requestAnimationFrame(() => { document.documentElement.style.scrollBehavior = "" })
    }, 100)
  })
  let count = 0
  const finishIntro = () => {
    introNumber.textContent = "100"
    introBar.style.width = "100%"
    setTimeout(() => intro.classList.add("done"), reducedMotion ? 0 : 2000)
  }
  if (reducedMotion || deepLinked) finishIntro()
  else {
    const counter = setInterval(() => {
      count = Math.min(100, count + Math.max(1, Math.ceil((100 - count) / 8)))
      introNumber.textContent = String(count).padStart(2, "0")
      introBar.style.width = count + "%"
      if (count >= 100) { clearInterval(counter); finishIntro() }
    }, 42)
  }

  const progress = document.querySelector(".progress-rail i")
  const heroLines = document.querySelectorAll(".hero-line")
  let ticking = false
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight
    progress.style.height = (max > 0 ? scrollY / max * 100 : 0) + "%"
    heroLines.forEach((line) => {
      line.style.transform = "translate3d(" + (scrollY * Number(line.dataset.speed || 0)) + "px,0,0)"
    })
    ticking = false
  }
  addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(updateScroll); ticking = true }
  }, { passive: true })
  updateScroll()

  const rope = document.querySelector(".rope-trigger")
  rope.addEventListener("click", () => {
    rope.classList.add("pulling")
    setTimeout(() => document.querySelector(".manifesto").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }), reducedMotion ? 0 : 300)
    setTimeout(() => rope.classList.remove("pulling"), 1500)
  })

  const selector = document.querySelector(".project-selector")
  const focus = document.querySelector(".project-focus")
  const focusFrame = focus.querySelector(".focus-shot")
  let activeProject = 0

  projects.forEach((project, index) => {
    const button = document.createElement("button")
    button.type = "button"
    button.innerHTML = "<b>" + String(index + 1).padStart(2, "0") + "</b><span>" + project.name + "</span>"
    button.addEventListener("click", () => showProject(index))
    selector.appendChild(button)
  })

  function showProject(index) {
    activeProject = (index + projects.length) % projects.length
    const project = projects[activeProject]
    focus.classList.add("switching")
    setTimeout(() => {
      focus.dataset.url = project.url
      focus.dataset.index = String(activeProject + 1).padStart(2, "0")
      focus.querySelector(".focus-backdrop").textContent = project.ghost
      focus.querySelector(".focus-meta").innerHTML = "<span>" + String(activeProject + 1).padStart(2, "0") + " / Selected work</span><span>" + project.category + " / " + project.type + "</span>"
      focus.querySelector(".focus-copy small").textContent = project.line
      focus.querySelector("h3").innerHTML = project.display
      focus.querySelector(".browser-bar b").textContent = project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")
      focusFrame.src = project.image
      focusFrame.alt = project.name + " website preview"
      selector.querySelectorAll("button").forEach((button, i) => button.classList.toggle("active", i === activeProject))
      focus.classList.remove("switching")
    }, reducedMotion ? 0 : 220)
  }
  focus.querySelector(".project-prev").addEventListener("click", () => showProject(activeProject - 1))
  focus.querySelector(".project-next").addEventListener("click", () => showProject(activeProject + 1))
  showProject(0)

  const modal = document.querySelector(".preview-modal")
  const modalFrame = modal.querySelector("iframe")
  const modalFallback = modal.querySelector(".preview-fallback")
  const modalFallbackImage = modalFallback.querySelector("img")
  const modalNote = modal.querySelector(".preview-note")
  const loading = modal.querySelector(".preview-loading")
  const closeButton = modal.querySelector(".close-preview")
  const linkedinPreview = modal.querySelector(".linkedin-preview")

  function openModal(url, title, index, options) {
    const settings = options || {}
    const useSnapshot = settings.embeddable === false
    modal.classList.remove("linkedin-profile-preview")
    modal.querySelector("h2").textContent = title
    modal.querySelector(".preview-count").textContent = index
    modal.querySelector(".preview-url").textContent = url.replace(/^https?:\/\//, "")
    modal.querySelector("footer a").href = url
    modal.classList.toggle("snapshot-preview", useSnapshot)
    modalFallback.setAttribute("aria-hidden", String(!useSnapshot))
    modalFallbackImage.src = useSnapshot ? settings.image : ""
    modalFallbackImage.alt = useSnapshot ? title + " website preview" : ""
    modalNote.textContent = useSnapshot
      ? "Protected preview: this website blocks iframe embedding for visitor security."
      : "Interactive live preview. Some websites may limit embedded navigation."
    loading.classList.toggle("hidden", useSnapshot)
    modalFrame.src = useSnapshot ? "about:blank" : url
    modal.classList.add("open")
    modal.setAttribute("aria-hidden", "false")
    document.body.classList.add("modal-open")
    closeButton.focus()
  }
  function openLinkedinModal(card, index) {
    const name = card.dataset.name
    const photo = card.dataset.photo
    const avatar = linkedinPreview.querySelector(".linkedin-preview-avatar")
    modal.querySelector("h2").textContent = name
    modal.querySelector(".preview-count").textContent = String(index + 1).padStart(2, "0")
    modal.querySelector(".preview-url").textContent = card.dataset.url.replace(/^https?:\/\//, "")
    modal.querySelector("footer a").href = card.dataset.url
    modal.querySelector("footer a").innerHTML = "Open LinkedIn profile <span>&nearr;</span>"
    modalNote.textContent = "Profile snapshot. LinkedIn blocks embedded browsing, so the original profile opens securely in a new tab."
    linkedinPreview.querySelector("h3").textContent = name
    linkedinPreview.querySelector("p").textContent = card.dataset.role
    linkedinPreview.querySelector(".linkedin-preview-card > b").textContent = card.dataset.result
    avatar.innerHTML = photo ? '<img src="' + photo + '" alt="' + name + '">' : card.dataset.initials
    modalFrame.src = "about:blank"
    modal.classList.remove("snapshot-preview")
    modal.classList.add("linkedin-profile-preview", "open")
    modal.setAttribute("aria-hidden", "false")
    linkedinPreview.setAttribute("aria-hidden", "false")
    document.body.classList.add("modal-open")
    closeButton.focus()
  }
  function closeModal() {
    modal.classList.remove("open")
    modal.setAttribute("aria-hidden", "true")
    document.body.classList.remove("modal-open")
    setTimeout(() => {
      modalFrame.src = "about:blank"
      modal.classList.remove("snapshot-preview", "linkedin-profile-preview")
      modalFallbackImage.src = ""
      linkedinPreview.setAttribute("aria-hidden", "true")
      modal.querySelector("footer a").innerHTML = "Open original website <span>&nearr;</span>"
    }, 350)
  }

  focus.querySelector(".open-project").addEventListener("click", () => {
    const project = projects[activeProject]
    openModal(project.url, project.name, String(activeProject + 1).padStart(2, "0"), project)
  })
  document.querySelectorAll(".lab-open").forEach((button) => button.addEventListener("click", () => {
    const card = button.closest("article")
    const image = card.querySelector("img").getAttribute("src")
    const embeddable = !card.dataset.url.includes("connectyourschool.in")
    openModal(card.dataset.url, card.querySelector("h3").textContent, card.dataset.index, { image: image, embeddable: embeddable })
  }))
  document.querySelectorAll(".open-linkedin").forEach((button, index) => button.addEventListener("click", () => {
    openLinkedinModal(button.closest(".linkedin-case"), index)
  }))
  modalFrame.addEventListener("load", () => {
    if (!modal.classList.contains("snapshot-preview")) setTimeout(() => loading.classList.add("hidden"), 450)
  })
  closeButton.addEventListener("click", closeModal)
  modal.addEventListener("mousedown", (event) => { if (event.target === modal) closeModal() })
  addEventListener("keydown", (event) => { if (event.key === "Escape" && modal.classList.contains("open")) closeModal() })

  if (matchMedia("(pointer:fine)").matches) {
    const cursor = document.querySelector(".cursor")
    addEventListener("mousemove", (event) => {
      cursor.style.left = event.clientX + "px"
      cursor.style.top = event.clientY + "px"
    })
    document.querySelectorAll(".open-project,.lab-open,.open-linkedin").forEach((item) => {
      item.addEventListener("mouseenter", () => cursor.classList.add("active"))
      item.addEventListener("mouseleave", () => cursor.classList.remove("active"))
    })
  }
})()

