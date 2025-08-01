import { useStyleSheet } from "@/hooks/useStyleSheet"
import { ThemeData } from "@/theme"
import { ScrollView, TouchableOpacity } from "react-native"
import { StyleSheet, Text, View } from "react-native"

export default function LandingPageScreen() {
  const styles = useStyleSheet(getStyles)
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Banner styles={styles} />
    </ScrollView>
  )
}

type BannerProps = {
  // because no concrete type exists for stylesheets
  styles: ReturnType<typeof getStyles>,
}

const Banner = ({ styles }: BannerProps) => (
  <View style={styles.banner}>
    <Text style={styles.bannerTitle}>Find Your Perfect</Text>
    <Text style={styles.bannerTitleFlight}>Flight</Text>
    
    <Text style={styles.bannerSubtitle}>Compare prices from dozens of airlines</Text>
    <Text style={styles.bannerSubtitle}>Book with confidence with the best price guarantee</Text>
    
    <TouchableOpacity style={styles.searchButton}>
      <Text style={styles.searchButtonText}>Search Flights</Text>
    </TouchableOpacity>
    
    {/* <Text style={fonts.displayLarge}>Display Large</Text>
    <Text style={fonts.displayMedium}>Display Medium</Text>
    <Text style={fonts.displaySmall}>Display Small</Text>
    <Text style={fonts.headlineLarge}>Headline Large</Text>
    <Text style={fonts.headlineMedium}>Headline Medium</Text>
    <Text style={fonts.headlineSmall}>Headline Small</Text>
    <Text style={fonts.titleLarge}>Title Large</Text>
    <Text style={fonts.titleMedium}>Title Medium</Text>
    <Text style={fonts.titleSmall}>Title Small</Text>
    <Text style={fonts.labelLarge}>Label Large</Text>
    <Text style={fonts.labelMedium}>Label Medium</Text>
    <Text style={fonts.labelSmall}>Label Small</Text>
    <Text style={fonts.bodyLarge}>Body Large</Text>
    <Text style={fonts.bodyMedium}>Body Medium</Text>
    <Text style={fonts.bodySmall}>Body Small</Text> */}
  </View>
)

const getStyles = ({ colors, fonts }: ThemeData) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  banner: {
    padding: 28,
    backgroundColor: colors.card,
    alignItems: "center",
    width: "100%",
  },
  bannerTitle: {
    ...fonts.displaySmall,
    fontWeight: 500,
  },
  bannerTitleFlight: {
    ...fonts.displaySmall,
    color: colors.primary,
    fontWeight: 500,
    marginBottom: 19,
  },
  bannerSubtitle: {
    ...fonts.titleMedium,
    color: colors.secondary,
  },
  searchButton: {
    marginTop: 22,
    padding: 13,
    paddingHorizontal: 22,
    backgroundColor: colors.button,
    borderRadius: 24,
  },
  searchButtonText: {
    ...fonts.labelLarge,
    color: colors.background,
  },
})