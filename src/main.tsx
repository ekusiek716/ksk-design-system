import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--Surface-Primary)]">
      <div className="text-center">
        <h1 className="typo-heading-2xl text-[var(--Text-High-Emphasis)]">
          KSK Design System
        </h1>
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mt-2">
          Storybook を起動してください: <code className="typo-label-sm bg-[var(--Surface-Tertiary)] px-2 py-1 rounded-sm">npm run storybook</code>
        </p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
