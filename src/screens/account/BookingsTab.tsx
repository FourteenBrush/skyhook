import { FlatList, StyleSheet, Text, View } from "react-native"
import Card from "@/components/Card"
import { CONTAINER_MARGIN, ThemeData } from "@/theme"
import { useTheme } from "@/hooks/useTheme"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { Booking } from "@/models/Booking"
import { DefaultError, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ApiClient, QUERY_KEYS } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import StatusIndicator from "@/components/StatusIndicator"
import RoundedIconBackground from "@/components/RoundedIconBackground"
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import TextButton from "@/components/TextButton"
import FlightOverview from "@/components/FlightOverview"
import { ErrorLabel } from "@/components/FormInputs"

export default function BookingsTab() {
  const styles = useStyleSheet(getStyles)
  const { fonts, colors } = useTheme()
  const { userDetails } = useAuth()
  const queryClient = useQueryClient()

  const { data: bookings, isPending, isError, error, refetch } = useQuery({
    queryFn: () => ApiClient.getBookings({ authToken: userDetails!.authToken }),
    queryKey: [QUERY_KEYS.GET_BOOKINGS],
    staleTime: 4 * 60 * 1000, // ms
  })

  const { mutate: cancelBooking, error: cancelError, isPending: isCanceling } = useMutation<Booking, DefaultError, { booking: Booking }>({
    mutationFn: ({ booking }) => ApiClient.cancelBooking({ booking, authToken: userDetails!.authToken }),
    onSuccess: (booking) => queryClient.setQueryData<Booking[]>([QUERY_KEYS.GET_BOOKINGS], (oldData: Booking[] | undefined) => {
      return oldData !== undefined
        ? oldData.filter(b => b.id !== booking.id).concat(booking)
        : [booking]
    }),
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
        icon=<Feather name="alert-circle" size={48} color={colors.warningRed}/>
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
        renderItem={({ item }) => <BookingCard
          booking={item}
          cancelBooking={cancelBooking.bind(null, { booking: item })}
          isCanceling={isCanceling}
          cancelError={cancelError}
        />}
        style={{ marginTop: CONTAINER_MARGIN }}
      />
    </View>
  )
}

type BookingCardProps = {
  booking: Booking,
  cancelBooking: () => void,
  isCanceling: boolean,
  cancelError: any | null,
}

const BookingCard = ({ booking, cancelBooking, isCanceling, cancelError }: BookingCardProps) => {
  const styles = useStyleSheet(getStyles)
  const { fonts } = useTheme()

  return (
    <Card clickable={false}>
      <FlightOverview flight={booking.flight} chosenClass={booking.chosenClass}>
        <Text style={fonts.bodyMedium}>Passenger: {booking.passengerName}</Text>
        <TextButton
          kind="filled"
          style={styles.cancelButton}
          onPress={cancelBooking}
          disabled={isCanceling || booking.status === "cancelled"}
        >
          Cancel Booking
        </TextButton>

        {cancelError !== null && <ErrorLabel error={ApiClient.friendlyErrorMessage(
          cancelError,
          { fallback: "Failed to cancel this booking" },
        )} />}
      </FlightOverview>
    </Card>
  )
}

const getStyles = ({ fonts, colors }: ThemeData) => StyleSheet.create({
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
  cancelButton: {
    marginTop: 12,
    alignSelf: "stretch",
    backgroundColor: colors.warningRed,
  },
})
