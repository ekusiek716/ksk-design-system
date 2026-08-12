import React from "react"
import { Modal, View, Pressable, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { useSafeAreaInsets } from "../theme/SafeAreaInsetsProvider"
import { resolveFullscreenDialogPadding, resolveInsetEdge } from "../safe-area"
import { resolveTypo } from "../typography"

export type DialogPosition = "center" | "top" | "fullscreen"

export interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  footer?: React.ReactNode
  children?: React.ReactNode
  /** タップで閉じるか */
  dismissOnBackdrop?: boolean
  /**
   * パネルの配置。既定 "center"（従来の挙動）。
   * - "center": 画面中央のカード
   * - "top": 上寄せのカード（キーボードで隠れやすい入力用）
   * - "fullscreen": 全画面（ウィザード／エディタ等）。角丸を持たず四辺の
   *   safe-area を避ける。web の `DialogContent position="fullscreen"` に対応。
   */
  position?: DialogPosition
  /**
   * safe-area（ノッチ・ステータスバー・ホームインジケータ）の回避を
   * 有効にするか。既定 true。実測 inset は `SafeAreaInsetsProvider` から供給する
   * （未供給なら回避量 0＝従来どおりの見た目）。
   * 効果があるのは `position="top"` / `"fullscreen"` だけ。
   */
  safeArea?: boolean
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  dismissOnBackdrop = true,
  position = "center",
  safeArea = true,
}: DialogProps) {
  const { theme, scales } = useTheme()
  const insets = useSafeAreaInsets()
  const isFullscreen = position === "fullscreen"
  const fullscreenPadding = resolveFullscreenDialogPadding(
    scales.spacing.scale[5],
    insets,
    safeArea,
  )

  return (
    <Modal visible={open} transparent={!isFullscreen} animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={() => dismissOnBackdrop && !isFullscreen && onClose()}
        style={{
          flex: 1,
          backgroundColor: isFullscreen ? theme.surface.primary : theme.overlay.dark,
          alignItems: "center",
          justifyContent: position === "top" ? "flex-start" : "center",
          ...(isFullscreen
            ? { padding: 0 }
            : {
                padding: scales.spacing.scale[4],
                // "top" は画面上端寄せなので、ステータスバー分を余白に足す
                ...(position === "top"
                  ? {
                      paddingTop:
                        scales.spacing.scale[4] + resolveInsetEdge(insets, "top", safeArea),
                    }
                  : null),
              }),
        }}
      >
        <Pressable
          onPress={() => {}}
          style={{
            width: "100%",
            backgroundColor: theme.surface.primary,
            gap: scales.spacing.scale[3],
            ...(isFullscreen
              ? { flex: 1, borderRadius: 0, ...fullscreenPadding }
              : {
                  maxWidth: 480,
                  borderRadius: scales.borderRadius["2xl"],
                  padding: scales.spacing.scale[5],
                }),
          }}
        >
          {title && (
            <RNText style={[resolveTypo("heading.lg"), { color: theme.text["high-emphasis"] }]}>
              {title}
            </RNText>
          )}
          {description && (
            <RNText style={[resolveTypo("body.md"), { color: theme.text["medium-emphasis"] }]}>
              {description}
            </RNText>
          )}
          {children}
          {footer && (
            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: scales.spacing.scale[2] }}>
              {footer}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  )
}
