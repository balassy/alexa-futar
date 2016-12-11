interface Ride {
  arrivalTime: number,
  departureTime: number,
  predictedArrivalTime: number,
  predictedDeparttureTime: number
}

interface RideTimes {
  firstRideAbsoluteTime: string,
  firstRideRelativeTimeInMinutes: number,
  firstRideRelativeTimeHumanized: string,
  secondRideAbsoluteTime: string,
  secondRideRelativeTimeHumanized: string,
  combinedRelativeTimeHumanized: string
}
