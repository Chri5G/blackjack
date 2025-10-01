import React from "react"
import ReactDOM from "react-dom/client"
import Home from "./components/Home"

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("react-root")
  if (root) {
    ReactDOM.createRoot(root).render(<Home />)
  }
})
