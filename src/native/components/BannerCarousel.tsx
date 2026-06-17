import React, { useRef, useState } from "react"
import {
  FlatList,
  View,
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { Banner, type BannerProps } from "./Banner"

export interface BannerCarouselProps {
  banners: BannerProps[]
  itemWidth?: number
  height?: number
  showIndicator?: boolean
}

export function BannerCarousel({
  banners,
  itemWidth,
  height = 160,
  showIndicator = true,
}: BannerCarouselProps) {
  const { theme, scales } = useTheme()
  const [index, setIndex] = useState(0)
  const width = itemWidth ?? Dimensions.get("window").width - 32
  const listRef = useRef<FlatList<BannerProps>>(null)

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x
    const i = Math.round(x / (width + scales.spacing.scale[2]))
    if (i !== index) setIndex(i)
  }

  return (
    <View style={{ gap: scales.spacing.scale[2] }}>
      <FlatList
        ref={listRef}
        data={banners}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width + scales.spacing.scale[2]}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ paddingHorizontal: scales.spacing.scale[4], gap: scales.spacing.scale[2] }}
        renderItem={({ item }) => (
          <View style={{ width, height }}>
            <Banner {...item} height={height} />
          </View>
        )}
      />
      {showIndicator && banners.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            gap: 6,
            alignSelf: "center",
          }}
        >
          {banners.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === index ? 16 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === index ? theme.brand.primary : theme.surface.tertiary,
              }}
            />
          ))}
        </View>
      )}
    </View>
  )
}
