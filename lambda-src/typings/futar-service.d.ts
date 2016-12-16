interface IRideTimes {
  firstRideAbsoluteTime: string;
  firstRideRelativeTimeInMinutes: number;
  firstRideRelativeTimeHumanized: string;
  secondRideAbsoluteTime: string;
  secondRideRelativeTimeHumanized: string;
  combinedRelativeTimeHumanized: string;
}

interface IStopData {
  currentTime: number;
  data: {
      entry: {
        stopTimes: IStopTime[];
      };

      references: {
        trips: { [s: string]: ITrip };
      };
  };
}

interface IStopTime {
  arrivalTime: number;
  departureTime: number;
  predictedArrivalTime: number;
  predictedDeparttureTime: number;
  tripId: string;
}

interface ITrip {
  id: string;
  routeId: string;
}
