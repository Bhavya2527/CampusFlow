/**
 * CampusFlow Backend API Contracts
 * ============================================================================
 * Defined by: Member 3 (Backend & Data Contracts Lead)
 * Consumer: Member 2 (Student Ride Booking Experience)
 * 
 * Version: 1.2.0-spec
 * Protocol: REST / JSON over HTTPS
 * Base URL: /api/v1
 * ============================================================================
 */

/**
 * @typedef {Object} CampusLocation
 * @property {string} id - Unique location identifier (e.g., 'loc_north_gate')
 * @property {string} name - Human readable display name
 * @property {string} category - 'campus' | 'transit_hub' | 'housing' | 'amenity'
 * @property {string} shortCode - 3-4 letter acronym (e.g., 'NG', 'LIB')
 * @property {string} zone - Campus quadrant / zone
 * @property {number} popularityScore - 1-100 relative routing weight
 */

/**
 * @typedef {Object} DriverProfile
 * @property {string} id - Driver ID (e.g., 'drv_402')
 * @property {string} fullName - Driver full name
 * @property {string} phone - Contact phone number
 * @property {number} rating - Average student rating (0.00 - 5.00)
 * @property {number} totalTrips - Completed campus trips count
 * @property {boolean} isUniversityVerified - University transport verification flag
 * @property {boolean} isWomenCertified - Certified for Women-Only safe transit
 * @property {string} vehicleMake - e.g. "Tata Nexon EV", "Toyota Commuter"
 * @property {string} vehicleColor - e.g. "Campus Emerald", "Arctic White"
 * @property {string} licensePlate - e.g. "CF-EV-204"
 * @property {string} avatarUrl - Driver profile picture URL / SVG
 * @property {string} emergencyPhone - Campus Security hotline link
 */

/**
 * @typedef {Object} RouteDemandData
 * @property {string} routeId - Combined pickup-destination ID
 * @property {string} pickupId - Origin location ID
 * @property {string} destinationId - Destination location ID
 * @property {'LOW' | 'MODERATE' | 'HIGH' | 'SURGE'} demandLevel - Calculated demand tier
 * @property {number} demandScore - 0 to 100 normalized demand index
 * @property {number} activeStudentRequests - Students currently viewing or requesting this route
 * @property {number} surgeMultiplier - Dynamic pricing factor (1.00x - 1.65x)
 * @property {Array<{ time: string, trafficFactor: number, isPeak: boolean }>} peakHours
 * @property {string} recommendedAlternativeTime - Cost-saving alternative slot
 * @property {string} routeNotice - Safety, construction, or weather advisory
 */

/**
 * @typedef {Object} RideDetails
 * @property {string} id - Ride ID (e.g., 'ride_ev_802')
 * @property {string} routeName - Readable route name (e.g., 'North Gate -> Metro Blue Line')
 * @property {string} pickupId - Location ID
 * @property {string} pickupName - Location Name
 * @property {string} destinationId - Location ID
 * @property {string} destinationName - Location Name
 * @property {string} departureDate - YYYY-MM-DD
 * @property {string} departureTime - HH:MM (24-hour or e.g., '08:30 AM')
 * @property {string} estimatedArrival - HH:MM (e.g., '08:55 AM')
 * @property {number} durationMinutes - Estimated transit time
 * @property {string} vehicleType - 'Campus EV Shuttle' | 'Eco-Van 7' | 'Rapid Cruiser'
 * @property {number} totalSeats - Total physical passenger capacity
 * @property {number} bookedSeats - Currently confirmed reservations
 * @property {number} availableSeats - Dynamically calculated (totalSeats - bookedSeats)
 * @property {number} baseFare - Base currency per seat before dynamic rules
 * @property {number} farePerSeat - Dynamically calculated current fare per seat
 * @property {'OPEN' | 'FILLING_FAST' | 'SOLD_OUT'} bookingStatus - Availability status
 * @property {boolean} isWomenOnly - Women-only ride preference certified
 * @property {boolean} isWheelchairAccessible - Accessibility support
 * @property {DriverProfile} driver - Driver assignment
 */

/**
 * @typedef {Object} BookingRecord
 * @property {string} bookingId - Unique ticket / reference code (e.g., 'CF-782914')
 * @property {string} rideId - Associated ride ID
 * @property {string} studentId - Student identifier
 * @property {string} studentName - Student display name
 * @property {string} routeName - Full route string
 * @property {string} pickupName - Boarding location
 * @property {string} destinationName - Drop-off location
 * @property {string} departureDate - YYYY-MM-DD
 * @property {string} departureTime - HH:MM
 * @property {string} estimatedArrival - HH:MM
 * @property {string} vehicleType - Vehicle category
 * @property {number} seatCount - Number of seats booked in this transaction
 * @property {number} farePerSeat - Fare charged per seat
 * @property {number} totalFarePaid - Total amount billed
 * @property {'CONFIRMED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED'} status - Booking state
 * @property {string} bookingTimestamp - ISO timestamp of purchase
 * @property {string} [cancellationTimestamp] - ISO timestamp if cancelled
 * @property {string} [cancellationReason] - Student-provided reason
 * @property {number} [refundAmount] - Calculated refund credit
 * @property {string} boardingOtp - 4-digit security boarding pin (e.g., '4821')
 * @property {string} qrCodePlaceholder - Visual verification token
 * @property {DriverProfile} driver - Assigned driver details
 * @property {boolean} isWomenOnly - Whether this was booked under women-only preference
 */

export const API_ENDPOINTS = {
  LOCATIONS: '/api/v1/locations',
  RIDES_SEARCH: '/api/v1/rides/search',
  RIDE_BY_ID: (id) => `/api/v1/rides/${id}`,
  ROUTE_DEMAND: (pickup, dest) => `/api/v1/routes/demand?pickup=${pickup}&destination=${dest}`,
  BOOKINGS_MY: '/api/v1/bookings/my-bookings',
  BOOKING_CREATE: '/api/v1/bookings',
  BOOKING_CANCEL: (id) => `/api/v1/bookings/${id}/cancel`,
  BOOKING_DRIVER: (id) => `/api/v1/bookings/${id}/driver`,
};
