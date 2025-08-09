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