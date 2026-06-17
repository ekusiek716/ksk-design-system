import React, { useState } from "react"
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  View,
  Text as RNText,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface ImageGalleryProps {
  images: ImageSourcePropType[]
  initialIndex?: number
  thumbnailSize?: number
}

export function ImageGallery({ images, initialIndex = 0, thumbnailSize = 80 }: ImageGalleryProps) {
  const { theme, scales } = useTheme()
  const [viewer, setViewer] = useState<{ open: boolean; index: number }>({ open: false, index: initialIndex })
  const screenWidth = Dimensions.get("window").width

  return (
    <>
      <FlatList
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: scales.spacing.scale[2] }}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => setViewer({ open: true, index })}>
            <Image
              source={item}
              style={{
                width: thumbnailSize,
                height: thumbnailSize,
                borderRadius: scales.borderRadius.md,
                backgroundColor: theme.surface.tertiary,
              }}
            />
          </Pressable>
        )}
      />
      <Modal
        visible={viewer.open}
        transparent
        animationType="fade"
        onRequestClose={() => setViewer({ ...viewer, open: false })}
      >
        <View style={{ flex: 1, backgroundColor: theme.surface.inverse }}>
          <Pressable
            onPress={() => setViewer({ ...viewer, open: false })}
            style={{ position: "absolute", top: 48, right: 16, zIndex: 1, padding: 8 }}
          >
            <RNText style={[resolveTypo("heading.lg"), { color: theme.text["on-inverse"] }]}>×</RNText>
          </Pressable>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            initialScrollIndex={viewer.index}
            getItemLayout={(_, idx) => ({
              length: screenWidth,
              offset: screenWidth * idx,
              index: idx,
            })}
            keyExtractor={(_, i) => String(i)}
            onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
              const i = Math.round(e.nativeEvent.contentOffset.x / screenWidth)
              if (i !== viewer.index) setViewer((v) => ({ ...v, index: i }))
            }}
            scrollEventThrottle={32}
            renderItem={({ item }) => (
              <View style={{ width: screenWidth, alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={item}
                  resizeMode="contain"
                  style={{ width: screenWidth, height: "100%" }}
                />
              </View>
            )}
          />
          <View
            style={{
              position: "absolute",
              bottom: 32,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <RNText style={[resolveTypo("label.md"), { color: theme.text["on-inverse"] }]}>
              {viewer.index + 1} / {images.length}
            </RNText>
          </View>
        </View>
      </Modal>
    </>
  )
}
