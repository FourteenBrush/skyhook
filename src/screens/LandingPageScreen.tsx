import { NavParams } from "@/App"
import TextButton from "@/components/TextButton"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { ThemeData } from "@/theme"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StyleSheet, Text, View, ScrollView } from "react-native"

export default function LandingPageScreen(props: NativeStackScreenProps<NavParams, "home">) {
  const styles = useStyleSheet(getStyles)
  
  return (
    <ScrollView style={styles.container}>
      <Banner styles={styles} {...props} />
    </ScrollView>
  )
}

type BannerProps = NativeStackScreenProps<NavParams, "home"> & {
  // because no concrete type exists for stylesheets
  styles: ReturnType<typeof getStyles>,
}

const Banner = ({ navigation, styles }: BannerProps) => (
  <View style={styles.banner}>
    <Text style={styles.bannerTitle}>Find Your Perfect</Text>
    <Text style={styles.bannerTitleFlight}>Flight</Text>
    
    <Text style={styles.bannerSubtitle}>Compare prices from dozens of airlines</Text>
    <Text style={styles.bannerSubtitle}>Book with confidence with the best price guarantee</Text>
    
    <TextButton shape="circular" style={styles.searchButton} onPress={() => navigation.navigate("searchFlight")}>
      Search Flights
    </TextButton>
    
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
  },
  banner: {
    padding: 28,
    backgroundColor: colors.card,
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
    marginTop: 18,
  },
})