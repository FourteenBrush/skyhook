import { Alert, FlatList, StyleSheet, Text, View } from "react-native"
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
import { formatDatetime } from "@/utils/utils"
import Badge from "@/components/Badge"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavParams } from "@/Routes"

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

  const {
    mutate: cancelBooking,
    error: cancelationError,
    isPending: isCanceling
  } = useMutation<Booking, DefaultError, { booking: Booking }>({
    mutationFn: ({ booking }) => ApiClient.cancelBooking({ booking, authToken: userDetails!.authToken }),
    onSuccess: (booking) => queryClient.setQueryData<Booking[]>([QUERY_KEYS.GET_BOOKINGS], (oldData: Booking[] | undefined) => {
      return oldData !== undefined
        ? oldData.filter(b => b.id !== booking.id).concat(booking)
        : [booking]
    }),
  })

  const {
    mutate: deleteBooking,
    error: deletionError,
    isPending: isDeleting,
  } = useMutation<Booking, DefaultError, { booking: Booking }>({
    mutationFn: ({ booking }) => ApiClient.deleteBooking({ booking, authToken: userDetails!.authToken }),
    onSuccess: (booking) => queryClient.setQueryData<Booking[]>([QUERY_KEYS.GET_BOOKINGS], (oldData: Booking[] | undefined) => {
      return oldData?.filter(b => b.id !== booking.id)
    })
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

  const confirmCancelationOrDeletion = (booking: Booking) => {
    const [onPress, message] = booking.status === "cancelled"
      ? [() => deleteBooking({ booking }), "Are you sure you wish to delete this canceled booking?"]
      : [() => cancelBooking({ booking }), "Are you sure you wish to cancel this booking?"]

    Alert.alert("Confirm action", message, [
      { text: "No", isPreferred: true, style: "cancel" },
      { text: "Yes", style: "destructive", onPress }
    ], { cancelable: true })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tripsTitle}>My Trips</Text>
      <Text style={fonts.bodyMedium}>{title}</Text>

      <FlatList<Booking>
        data={bookings.sort((a, b) => (a.bookedAt < b.bookedAt) ? -1 : 1)}
        renderItem={({ item }) => {
          
          const [error, isPending, fallbackErrorMessage] = item.status === "cancelled"
            ? [cancelationError, isCanceling, "Failed to cancel this booking"]
            : [deletionError, isDeleting, "Failed to delete this booking"]

          return (<BookingCard
            booking={item}
            cancelOrDelete={confirmCancelationOrDeletion.bind(null, item)}
            isActionPending={isPending}
            error={error}
            fallbackErrorMessage={fallbackErrorMessage}
          />)
        }}
        style={styles.bookingsList}
      />
    </View>
  )
}

type BookingCardProps = {
  booking: Booking,
  cancelOrDelete: () => void,
  isActionPending: boolean,
  error: any | null,
  fallbackErrorMessage: string,
}

const BookingCard = ({ booking, cancelOrDelete, isActionPending, error, fallbackErrorMessage }: BookingCardProps) => {
  const navigation = useNavigation<NavigationProp<NavParams>>()
  const styles = useStyleSheet(getStyles)
  const { fonts, colors } = useTheme()

  const isExpired = booking.flight.departureTime >= new Date()

  const buttonText = booking.status === "cancelled"
    ? "Delete"
    : "Cancel Booking"

  return (
    <Card
      clickable={true}
      onPress={() => navigation.navigate("bookingDetails", { booking })}
    >
      <FlightOverview
        flight={booking.flight}
        chosenClass={booking.chosenClass}
        rightOfAirline={[
          booking.status === "cancelled" && <Badge kind="dark">Cancelled</Badge>,
          isExpired && <Badge kind="light">Departed</Badge>,
        ]}
      >
        <Text style={fonts.bodyMedium}>Booking nr: <Text style={styles.bookingDetail}>{booking.bookingNr}</Text></Text>
        <Text style={fonts.bodyMedium}>Passenger: <Text style={styles.bookingDetail}>{booking.passengerName}</Text></Text>
        <Text style={fonts.bodyMedium}>Booked at: <Text style={styles.bookingDetail}>{formatDatetime(booking.bookedAt)}</Text></Text>

        {!isExpired && (
          <TextButton
            kind="filled"
            style={styles.actionButton}
            onPress={cancelOrDelete}
            disabled={isActionPending}
            pre={booking.status === "cancelled" && <MaterialCommunityIcons name="delete" size={22} color={colors.buttonText} />}
          >
            {buttonText}
          </TextButton>
        )}

        {error !== null && <ErrorLabel error={ApiClient.friendlyErrorMessage(
          error, { fallback: fallbackErrorMessage })
        } />}
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
  bookingsList: {
    marginTop: CONTAINER_MARGIN,
    marginBottom: 30, // prevent underflow
  },
  actionButton: {
    marginTop: 12,
    alignSelf: "stretch",
    backgroundColor: colors.warningRed,
  },
  actionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bookingDetail: {
    fontWeight: 500,
  },
})
