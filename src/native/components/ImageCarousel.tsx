import React, { useState } from "react"
import {
  Dimensions,
  FlatList,
  Image,
  View,
  Text as RNText,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface ImageCarouselProps {
  images: ImageSourcePropType[]
  height?: number
  showCounter?: boolean
  showDots?: boolean
}

export function ImageCarousel({
  images,
  height = 280,
  showCounter = true,
  showDots = true,
}: ImageCarouselProps) {
  const { theme, scales } = useTheme()
  const [index, setIndex] = useState(0)
  const width = Dimensions.get("window").width

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width)
    if (i !== index) setIndex(i)
  }

  return (
    <View>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={{ width, height, backgroundColor: theme.surface.tertiary }}>
            <Image source={item} resizeMode="cover" style={{ width: "100%", height: "100%" }} />
          </View>
        )}
      />
      {showCounter && images.length > 1 && (
        <View
          style={{
            position: "absolute",
            top: scales.spacing.scale[3],
            right: scales.spacing.scale[3],
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: scales.borderRadius.full,
            backgroundColor: theme.overlay.dark,
          }}
        >
          <RNText style={[resolveTypo("label.xs"), { color: theme.text["on-inverse"] }]}>
            {index + 1} / {images.length}
          </RNText>
        </View>
      )}
      {showDots && images.length > 1 && (
        <View
          style={{
            position: "absolute",
            bottom: scales.spacing.scale[3],
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {images.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === index ? 16 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === index ? theme.text["on-inverse"] : theme.text["on-inverse-secondary"],
              }}
            />
          ))}
        </View>
      )}
    </View>
  )
}
