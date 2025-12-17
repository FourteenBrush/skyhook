import { FlatList, StyleSheet, Text, View } from "react-native"
import Card from "@/components/Card"
import { CONTAINER_MARGIN, ThemeData } from "@/theme"
import { useTheme } from "@/hooks/useTheme"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { Booking } from "@/models/Booking"
import { useQuery } from "@tanstack/react-query"
import { ApiClient, QUERY_KEYS } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import StatusIndicator from "@/components/StatusIndicator"
import RoundedIconBackground from "@/components/RoundedIconBackground"
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import TextButton from "@/components/TextButton"
import FlightOverview from "@/components/FlightOverview"

export default function BookingsTab() {
  const styles = useStyleSheet(getStyles)
  const { fonts, colors } = useTheme()
  const { authToken } = useAuth()

  const { data: bookings, isPending, isError, error, refetch } = useQuery({
    queryFn: () => ApiClient.getBookings({ authToken: authToken! }),
    queryKey: [QUERY_KEYS.GET_BOOKINGS],
    staleTime: 4 * 60 * 1000, // ms
  })

  if (isPending) {
    return (
      <StatusIndicator
        title="Loading your trips..."
        icon={
          <RoundedIconBackground color={colors.primaryShaded} size={54}>
            <MaterialCommunityIcons name="ticket-confirmation-outline" size={34} color={colors.primary} />
          </RoundedIconBackground>
        }
        userMessage="Retrieving bookings..."
        style={styles.queryIndicator}
      />
    )
  }
  if (isError) {
    const userMessage = ApiClient.friendlyErrorMessage(error)
    return (
      <StatusIndicator
        title="Failed to retrieve your bookings"
        subtitle="We encountered an error while retrieving your data"
        icon=<Feather name="alert-circle" size={48} color="#EF4444" />
        userMessage={userMessage}
        button=<TextButton shape="circular" onPress={() => refetch()}>Retry</TextButton>
        style={styles.queryIndicator}
      />
    )
  }

  const title = bookings.length === 0
    ? "No bookings found"
    : bookings.length === 1
      ? "1 booking found"
      : `${bookings.length} bookings found`

  return (
    <View style={styles.container}>
      <Text style={styles.tripsTitle}>My Trips</Text>
      <Text style={fonts.bodyMedium}>{title}</Text>

      <FlatList<Booking>
        data={bookings}
        renderItem={({ item }) => <BookingCard booking={item} />}
        style={{ marginTop: CONTAINER_MARGIN }}
      />
    </View>
  )
}

const BookingCard = ({ booking }: { booking: Booking }) => {
  return (
    <Card clickable={false}>
      <FlightOverview flight={booking.flight} chosenClass={booking.chosenClass} />
    </Card>
  )
}

const getStyles = ({ fonts }: ThemeData) => StyleSheet.create({
  container: {
    marginHorizontal: CONTAINER_MARGIN,
    marginTop: CONTAINER_MARGIN,
    paddingBottom: 20,
  },
  queryIndicator: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    transform: [{ translateY: -65 }], // move slightly up
  },
  tripsTitle: {
    ...fonts.titleLarge,
    paddingBottom: 8,
  },
})
