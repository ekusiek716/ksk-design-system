import React from "react"
import {
  Image,
  Pressable,
  Text as RNText,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Button } from "./Button"

export interface CompactFilePickerProps {
  label?: React.ReactNode
  description?: React.ReactNode
  triggerLabel?: string
  icon?: React.ReactNode
  loading?: boolean
  disabled?: boolean
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

export interface NativeImageAttachment {
  id: string
  uri?: string
  source?: ImageSourcePropType
  alt?: string
  name?: string
}

export interface ImageAttachmentPickerProps extends Omit<CompactFilePickerProps, "icon"> {
  images?: NativeImageAttachment[]
  onRemove?: (id: string) => void
  removeLabel?: (image: NativeImageAttachment) => string
  previewVariant?: "grid" | "list"
}

export function CompactFilePicker({
  label = "ファイル",
  description,
  triggerLabel = "選択する",
  icon,
  loading = false,
  disabled = false,
  onPress,
  style,
}: CompactFilePickerProps) {
  const { theme, scales } = useTheme()
  const isDisabled = disabled || loading
  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        {
          minHeight: 56,
          flexDirection: "row",
          alignItems: "center",
          gap: scales.spacing.scale[3],
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: scales.borderRadius.lg,
          backgroundColor: theme.surface.secondary,
        }}
      >
        {icon ?? <RNText style={[resolveTypo("heading.md"), { color: theme.text["medium-emphasis"] }]}>＋</RNText>}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        {typeof label === "string" ? (
          <RNText numberOfLines={1} style={[resolveTypo("label.md"), { color: theme.text["high-emphasis"] }]}>
            {label}
          </RNText>
        ) : (
          label
        )}
        {description &&
          (typeof description === "string" ? (
            <RNText style={[resolveTypo("body.sm"), { color: theme.text["medium-emphasis"], marginTop: 2 }]}>
              {description}
            </RNText>
          ) : (
            description
          ))}
      </View>
      <Button variant="secondary" disabled={isDisabled} loading={loading} onPress={onPress}>
        {triggerLabel}
      </Button>
    </Pressable>
  )
}

export function ImageAttachmentPicker({
  images = [],
  onRemove,
  removeLabel = (image) => `${image.name ?? "画像"}を削除`,
  previewVariant = "grid",
  label = "画像",
  description = "JPG / PNG / WebP",
  triggerLabel = "画像を追加",
  ...props
}: ImageAttachmentPickerProps) {
  const { theme, scales } = useTheme()
  return (
    <View style={{ gap: scales.spacing.scale[3] }}>
      <CompactFilePicker
        {...props}
        label={label}
        description={description}
        triggerLabel={triggerLabel}
      />
      {images.length > 0 && (
        <View
          style={{
            flexDirection: previewVariant === "grid" ? "row" : "column",
            flexWrap: previewVariant === "grid" ? "wrap" : "nowrap",
            gap: scales.spacing.scale[2],
          }}
        >
          {images.map((image) => (
            <View
              key={image.id}
              style={{
                width: previewVariant === "grid" ? "31%" : "100%",
                flexDirection: previewVariant === "list" ? "row" : "column",
                alignItems: previewVariant === "list" ? "center" : "stretch",
                gap: scales.spacing.scale[2],
                padding: previewVariant === "list" ? scales.spacing.scale[2] : 0,
                borderWidth: 1,
                borderColor: theme.border["low-emphasis"],
                borderRadius: scales.borderRadius.xl,
                overflow: "hidden",
                backgroundColor: theme.surface.primary,
              }}
            >
              <Image
                source={image.source ?? { uri: image.uri ?? "" }}
                accessibilityLabel={image.alt ?? image.name}
                style={{
                  width: previewVariant === "list" ? 56 : "100%",
                  aspectRatio: 1,
                  borderRadius: previewVariant === "list" ? scales.borderRadius.lg : 0,
                }}
              />
              {previewVariant === "list" && (
                <RNText numberOfLines={1} style={[resolveTypo("label.sm"), { color: theme.text["high-emphasis"], flex: 1 }]}>
                  {image.name ?? image.alt ?? "画像"}
                </RNText>
              )}
              {onRemove && (
                <Button
                  variant="tertiary"
                  disabled={props.disabled}
                  accessibilityLabel={removeLabel(image)}
                  onPress={() => onRemove(image.id)}
                >
                  削除
                </Button>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
