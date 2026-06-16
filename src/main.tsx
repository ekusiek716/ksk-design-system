import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { PrototypeHost } from "./prototypes/_host"

// `npm run dev`（localhost:5173）は Notion 仕様から生成したモックの
// プレビュー環境。コンポーネント単体のカタログは Storybook 側を参照。
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PrototypeHost />
  </React.StrictMode>,
)
