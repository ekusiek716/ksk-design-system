/** 閉じる（×）の線アイコン。NavigationBar の leftIcon="close"・Banner の onDismiss が使う共通部品 */
function IconClose({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export { IconClose }
