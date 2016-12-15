interface IRide {
  arrivalTime: number;
  departureTime: number;
  predictedArrivalTime: number;
  predictedDeparttureTime: number;
}

interface IRideTimes {
  firstRideAbsoluteTime: string;
  firstRideRelativeTimeInMinutes: number;
  firstRideRelativeTimeHumanized: string;
  secondRideAbsoluteTime: string;
  secondRideRelativeTimeHumanized: string;
  combinedRelativeTimeHumanized: string;
}
