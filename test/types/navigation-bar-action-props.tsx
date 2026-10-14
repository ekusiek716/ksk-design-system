import * as React from "react"
import { NavigationBar } from "../../src/components/ui/navigation-bar"
const leftRef = React.createRef<HTMLButtonElement>()
const shareRef = React.createRef<HTMLButtonElement>()
export const navigation = <NavigationBar onLeft={() => {}} onShare={() => {}}
  leftButtonProps={{ ref: leftRef, "data-testid": "close", "data-count": 1, "aria-label": "Close" }}
  shareButtonProps={{ ref: shareRef, "data-testid": "share", "data-enabled": true }} />
