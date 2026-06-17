import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { Animated, View, Text as RNText, Pressable } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type ToastTone = "info" | "success" | "warning" | "caution"

export interface ToastItem {
  id: string
  title?: string
  description?: string
  tone?: ToastTone
  duration?: number
}

interface ToastContextValue {
  show: (toast: Omit<ToastItem, "id">) => string
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast は ToastProvider の内側で使ってください")
  return ctx
}

let counter = 0
function nextId() {
  counter += 1
  return `toast-${counter}`
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { theme, scales } = useTheme()
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = nextId()
      setItems((prev) => [...prev, { ...toast, id }])
      const duration = toast.duration ?? 3000
      setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: scales.spacing.scale[10],
          left: 0,
          right: 0,
          alignItems: "center",
          gap: scales.spacing.scale[2],
          zIndex: 9999,
        }}
      >
        {items.map((t) => (
          <ToastView key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </View>
    </ToastContext.Provider>
  )
}

function ToastView({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const { theme, scales } = useTheme()
  const opacity = useRef(new Animated.Value(0)).current
  const translate = useRef(new Animated.Value(-20)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translate, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start()
  }, [opacity, translate])

  const palette = {
    info: { bg: theme.surface.info, fg: theme.text.info },
    success: { bg: theme.surface.success, fg: theme.text.success },
    warning: { bg: theme.surface.warning, fg: theme.text.warning },
    caution: { bg: theme.surface.caution, fg: theme.text.caution },
  }[toast.tone ?? "info"]

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY: translate }],
        backgroundColor: palette.bg,
        borderRadius: scales.borderRadius.lg,
        paddingHorizontal: scales.spacing.scale[4],
        paddingVertical: scales.spacing.scale[3],
        marginHorizontal: scales.spacing.scale[4],
        shadowColor: theme.overlay.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: scales.spacing.scale[3],
        maxWidth: 480,
      }}
    >
      <View style={{ flex: 1 }}>
        {toast.title && (
          <RNText style={[resolveTypo("label.md"), { color: palette.fg }]}>{toast.title}</RNText>
        )}
        {toast.description && (
          <RNText style={[resolveTypo("body.sm"), { color: theme.text["high-emphasis"] }]}>
            {toast.description}
          </RNText>
        )}
      </View>
      <Pressable onPress={onDismiss} hitSlop={8}>
        <RNText style={[resolveTypo("label.sm"), { color: palette.fg }]}>×</RNText>
      </Pressable>
    </Animated.View>
  )
}
