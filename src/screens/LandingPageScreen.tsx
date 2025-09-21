import { NavParams } from "@/App"
import TextButton from "@/components/TextButton"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { ThemeData } from "@/theme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StyleSheet, Text, View, ScrollView } from "react-native"

export default function LandingPageScreen(props: NativeStackScreenProps<NavParams, "home">) {
  const styles = useStyleSheet(getStyles)
  
  return (
    <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}>
      <View>
        <Banner styles={styles} {...props} />
        <BookFlightBlock styles={styles} {...props} />
      </View>
      <CopyrightFooter styles={styles} {...props} />
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

const BookFlightBlock = ({ navigation, styles }: BannerProps) => (
  <View style={styles.bookFlightBlock}>
    <Text style={styles.bookFlightTitle}>Ready to Take Off?</Text>
    <Text style={styles.bookFlightSubtitle}>Start planning your next adventure today.</Text>
    <TextButton style={styles.bookFlightButton} kind="outlined" shape="circular" onPress={() => navigation.navigate("searchFlight")}>
      Book Your Flight
    </TextButton>
  </View>
)

const CopyrightFooter = ({ styles }: BannerProps) => (
  <View style={styles.copyright}>
    <View style={styles.copyrightIconText}>
      <MaterialCommunityIcons name="airplane-takeoff" color="white" size={22} />
      <Text style={styles.copyrightTitle}>Skyhook</Text>
    </View>
    <Text style={styles.copyrightTitle}>&copy; 2025 Skyhook. All rights reserved.</Text>
  </View>
)

const getStyles = ({ colors, fonts }: ThemeData) => StyleSheet.create({
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
  
  bookFlightBlock: {
    backgroundColor: "#2563EB",
    padding: 28,
    paddingBottom: 45,
  },
  bookFlightTitle: {
    ...fonts.headlineLarge,
    textAlign: "center",
    color: "#fff",
    fontWeight: 500,
    marginBottom: 12,
  },
  bookFlightSubtitle: {
    ...fonts.titleMedium,
    textAlign: "center",
    marginBottom: 16,
    color: "#99B6F6",
  },
  bookFlightButton: {
    backgroundColor: "#fff",
    alignSelf: "center",
  },
  
  copyright: {
    padding: 18,
    backgroundColor: "#111827",
  },
  copyrightIconText: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingBottom: 12,
  },
  copyrightTitle: {
    textAlign: "center",
    color: "#fff",
  },
})