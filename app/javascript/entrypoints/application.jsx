import React from "react";
import ReactDOM from "react-dom/client";
import Home from "../components/Home";

const el = document.getElementById("react-root");

if (el) {
  const top_scores = JSON.parse(el.dataset.top_scores || "[]");
  ReactDOM.createRoot(el).render(<Home top_scores={top_scores} />);
}