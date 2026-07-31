type AlertDialogOpenListener = () => void

const alertDialogOpenListeners = new Set<AlertDialogOpenListener>()

function notifyAlertDialogOpening() {
  for (const listener of alertDialogOpenListeners) listener()
}

function subscribeToAlertDialogOpening(listener: AlertDialogOpenListener) {
  alertDialogOpenListeners.add(listener)
  return () => {
    alertDialogOpenListeners.delete(listener)
  }
}

export { notifyAlertDialogOpening, subscribeToAlertDialogOpening }
