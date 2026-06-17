import React from "react"
import { FlatList, View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { ProductCard, type ProductCardProps } from "./ProductCard"
import { SectionHeader } from "./SectionHeader"

export interface ProductCarouselProps {
  title?: string
  action?: { label: string; onPress: () => void }
  products: ProductCardProps[]
  cardWidth?: number
}

export function ProductCarousel({
  title,
  action,
  products,
  cardWidth = 160,
}: ProductCarouselProps) {
  const { scales } = useTheme()
  return (
    <View>
      {title && <SectionHeader title={title} action={action} />}
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{
          gap: scales.spacing.scale[3],
          paddingHorizontal: scales.spacing.scale[4],
          paddingBottom: scales.spacing.scale[2],
        }}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth }}>
            <ProductCard {...item} />
          </View>
        )}
      />
    </View>
  )
}
