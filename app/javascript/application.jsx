import React from "react"
import ReactDOM from "react-dom/client"
import Hello from "./components/Hello"

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("react-root")
  if (root) {
    ReactDOM.createRoot(root).render(<Hello />)
  }
})
