import React from "react"
import { hydrateRoot } from "react-dom/client"
import { ConsumerFixture } from "./consumer-hydration.mjs"
import { Example } from "./readme-example"
import "./styles/app.css"
window.__readmeExample = Example
window.__serverMain = document.getElementById("fixture")
window.__serverInput = document.querySelector("input")
window.__recoverable = []
hydrateRoot(document.getElementById("root"), React.createElement(ConsumerFixture, {
  mismatch: new URLSearchParams(location.search).has("mismatch"),
}), { onRecoverableError: (error) => window.__recoverable.push(String(error)) })
