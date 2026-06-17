import React, { useState } from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Sheet } from "./Sheet"
import { StarRating } from "./StarRating"
import { Textarea } from "./Textarea"
import { Button } from "./Button"

export interface ReviewOverlayProps {
  open: boolean
  onClose: () => void
  title?: string
  onSubmit?: (rating: number, comment: string) => void
}

export function ReviewOverlay({
  open,
  onClose,
  title = "レビューを投稿",
  onSubmit,
}: ReviewOverlayProps) {
  const { theme, scales } = useTheme()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  return (
    <Sheet open={open} onClose={onClose} side="bottom" title={title}>
      <View style={{ alignItems: "center", marginVertical: scales.spacing.scale[3] }}>
        <StarRating value={rating} onChange={setRating} size={32} />
      </View>
      <Textarea
        value={comment}
        onChangeText={setComment}
        placeholder="コメントを入力"
        minHeight={120}
      />
      <View style={{ flexDirection: "row", gap: scales.spacing.scale[2], marginTop: scales.spacing.scale[3] }}>
        <View style={{ flex: 1 }}>
          <Button variant="tertiary" onPress={onClose}>
            キャンセル
          </Button>
        </View>
        <View style={{ flex: 1 }}>
          <Button
            variant="primary"
            disabled={rating === 0}
            onPress={() => {
              onSubmit?.(rating, comment)
              onClose()
            }}
          >
            送信
          </Button>
        </View>
      </View>
    </Sheet>
  )
}
