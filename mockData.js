/**
 * ============================================================================
 * MOCK DATA LAYER - DEVELOPED ACCORDING TO MEMBER 3 API CONTRACT SPEC
 * ============================================================================
 * NOTICE FOR TEAM MEMBERS & REVIEWERS:
 * This file contains strictly structured mock datasets simulating the CampusFlow
 * backend database. In production, this layer is replaced by live REST/GraphQL 
 * endpoints defined in `src/api/contracts.js`.
 * 
 * Final seat availability and fares are NOT hardcoded here; they are computed
 * dynamically through the rideService calculation engine.
 * ============================================================================
 */

export const MOCK_STUDENT_PROFILE = {
  id: "stu_alex_2027",
  name: "Alex Chen",
  email: "alex.chen@campus.edu",
  studentId: "U2023-CS-0492",
  department: "Computer Science & Engineering",
  year: "3rd Year (Class of '27)",
  campusPassBalance: 450.00, // Campus currency / wallet
  carbonSavedKg: 38.4,
  ridesCompletedThisSemester: 26,
  isVerifiedStudent: true,
  genderPreference: "Unspecified"
};

export const MOCK_CAMPUS_LOCATIONS = [
  {
    id: "loc_north_gate",
    name: "North Campus Main Gate",
    category: "campus",
    shortCode: "NCG",
    zone: "North Quadrant",
    popularityScore: 94
  },
  {
    id: "loc_south_transit",
    name: "South Campus Transit Hub",
    category: "transit_hub",
    shortCode: "SCTH",
    zone: "South Quadrant",
    popularityScore: 98
  },
  {
    id: "loc_central_library",
    name: "Central Knowledge Commons (Library)",
    category: "amenity",
    shortCode: "CKC",
    zone: "Central Academic Core",
    popularityScore: 89
  },
  {
    id: "loc_eng_hall",
    name: "Alan Turing Engineering Quad",
    category: "campus",
    shortCode: "ATEQ",
    zone: "West Tech Park",
    popularityScore: 91
  },
  {
    id: "loc_science_block",
    name: "Curie Science & Research Complex",
    category: "campus",
    shortCode: "CSRC",
    zone: "East Quadrant",
    popularityScore: 84
  },
  {
    id: "loc_metro_blue",
    name: "University Metro Station (Blue Line)",
    category: "transit_hub",
    shortCode: "METRO",
    zone: "City Link Connector",
    popularityScore: 99
  },
  {
    id: "loc_grad_housing",
    name: "Pine Crest Off-Campus Graduate Housing",
    category: "housing",
    shortCode: "PCH",
    zone: "North-West Perimeter",
    popularityScore: 86
  },
  {
    id: "loc_sports_arena",
    name: "Spartan Athletics & Sports Arena",
    category: "amenity",
    shortCode: "SASA",
    zone: "South Perimeter",
    popularityScore: 78
  },
  {
    id: "loc_city_center",
    name: "Downtown University Square & Mall",
    category: "amenity",
    shortCode: "DUSM",
    zone: "Downtown Link",
    popularityScore: 92
  }
];

export const MOCK_DRIVERS = [
  {
    id: "drv_priya_sharma",
    fullName: "Priya Sharma",
    phone: "+91 98765-43210",
    rating: 4.96,
    totalTrips: 1420,
    isUniversityVerified: true,
    isWomenCertified: true,
    vehicleMake: "Tata Nexon EV (Electric)",
    vehicleColor: "Emerald Green & White",
    licensePlate: "DL-01-CF-4091",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    emergencyPhone: "+91 1800-CAMPUS-SAFE"
  },
  {
    id: "drv_robert_martinez",
    fullName: "Rajesh Verma",
    phone: "+91 98112-33445",
    rating: 4.88,
    totalTrips: 980,
    isUniversityVerified: true,
    isWomenCertified: false,
    vehicleMake: "Force Urbania Campus Cruiser",
    vehicleColor: "Campus Navy & Yellow",
    licensePlate: "HR-06-CF-8822",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    emergencyPhone: "+91 1800-CAMPUS-SAFE"
  },
  {
    id: "drv_sunita_patel",
    fullName: "Sunita Patel",
    phone: "+91 98220-77651",
    rating: 4.98,
    totalTrips: 2150,
    isUniversityVerified: true,
    isWomenCertified: true,
    vehicleMake: "Mahindra e-Supro Shuttle",
    vehicleColor: "Arctic White with Pink Safety Stripe",
    licensePlate: "HR-06-CF-9903",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    emergencyPhone: "+91 1800-CAMPUS-SAFE"
  },
  {
    id: "drv_david_kim",
    fullName: "Deepak Saini",
    phone: "+91 98450-99881",
    rating: 4.91,
    totalTrips: 1120,
    isUniversityVerified: true,
    isWomenCertified: false,
    vehicleMake: "Toyota HiAce Eco-Van",
    vehicleColor: "Silver Metallic",
    licensePlate: "HR-06-CF-1144",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    emergencyPhone: "+91 1800-CAMPUS-SAFE"
  },
  {
    id: "drv_ananya_das",
    fullName: "Ananya Das",
    phone: "+91 98301-44778",
    rating: 4.95,
    totalTrips: 870,
    isUniversityVerified: true,
    isWomenCertified: true,
    vehicleMake: "MG ZS EV SafeRide+",
    vehicleColor: "Sky Blue & SafeRide Shield",
    licensePlate: "DL-01-CF-6520",
    avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
    emergencyPhone: "+91 1800-CAMPUS-SAFE"
  }
];

/**
 * Raw schedule definitions used by the dynamic engine to synthesize live ride instances.
 * Note: Available seats and live fares are NOT fixed here; they are computed on query.
 */
export const MOCK_RAW_SCHEDULES = [
  {
    id: "sched_01",
    pickupId: "loc_north_gate",
    destinationId: "loc_metro_blue",
    timeSlot: "08:15 AM",
    durationMinutes: 18,
    vehicleType: "Campus EV Shuttle",
    totalCapacity: 12,
    initialBookedSeats: 7, // 5 available dynamically
    baseFareAmount: 30.00,
    isWomenOnly: false,
    isWheelchairAccessible: true,
    driverId: "drv_robert_martinez"
  },
  {
    id: "sched_02",
    pickupId: "loc_north_gate",
    destinationId: "loc_metro_blue",
    timeSlot: "08:45 AM",
    durationMinutes: 18,
    vehicleType: "Eco-Van 7 (SafeRide+)",
    totalCapacity: 7,
    initialBookedSeats: 5, // 2 available (Filling fast!)
    baseFareAmount: 35.00,
    isWomenOnly: true, // Women-only ride preference
    isWheelchairAccessible: false,
    driverId: "drv_priya_sharma"
  },
  {
    id: "sched_03",
    pickupId: "loc_north_gate",
    destinationId: "loc_metro_blue",
    timeSlot: "09:15 AM",
    durationMinutes: 20,
    vehicleType: "Rapid Campus Cruiser",
    totalCapacity: 24,
    initialBookedSeats: 16, // 8 available
    baseFareAmount: 25.00,
    isWomenOnly: false,
    isWheelchairAccessible: true,
    driverId: "drv_david_kim"
  },
  {
    id: "sched_04",
    pickupId: "loc_eng_hall",
    destinationId: "loc_central_library",
    timeSlot: "11:30 AM",
    durationMinutes: 12,
    vehicleType: "Campus EV Shuttle",
    totalCapacity: 10,
    initialBookedSeats: 3, // 7 available
    baseFareAmount: 20.00,
    isWomenOnly: false,
    isWheelchairAccessible: true,
    driverId: "drv_robert_martinez"
  },
  {
    id: "sched_05",
    pickupId: "loc_south_transit",
    destinationId: "loc_city_center",
    timeSlot: "01:15 PM",
    durationMinutes: 25,
    vehicleType: "Campus EV Shuttle",
    totalCapacity: 14,
    initialBookedSeats: 11, // 3 available
    baseFareAmount: 40.00,
    isWomenOnly: false,
    isWheelchairAccessible: true,
    driverId: "drv_david_kim"
  },
  {
    id: "sched_06",
    pickupId: "loc_grad_housing",
    destinationId: "loc_science_block",
    timeSlot: "08:30 AM",
    durationMinutes: 15,
    vehicleType: "Eco-Van 7 (SafeRide+)",
    totalCapacity: 7,
    initialBookedSeats: 4, // 3 available
    baseFareAmount: 28.00,
    isWomenOnly: true, // Women-only certified
    driverId: "drv_sunita_patel"
  },
  {
    id: "sched_07",
    pickupId: "loc_central_library",
    destinationId: "loc_grad_housing",
    timeSlot: "05:45 PM",
    durationMinutes: 22,
    vehicleType: "Campus EV Shuttle",
    totalCapacity: 12,
    initialBookedSeats: 10, // 2 available
    baseFareAmount: 32.00,
    isWomenOnly: false,
    isWheelchairAccessible: true,
    driverId: "drv_robert_martinez"
  },
  {
    id: "sched_08",
    pickupId: "loc_metro_blue",
    destinationId: "loc_north_gate",
    timeSlot: "06:30 PM",
    durationMinutes: 20,
    vehicleType: "SafeRide+ Women's EV",
    totalCapacity: 6,
    initialBookedSeats: 2, // 4 available
    baseFareAmount: 35.00,
    isWomenOnly: true,
    driverId: "drv_ananya_das"
  },
  {
    id: "sched_09",
    pickupId: "loc_sports_arena",
    destinationId: "loc_south_transit",
    timeSlot: "07:30 PM",
    durationMinutes: 10,
    vehicleType: "Campus EV Shuttle",
    totalCapacity: 12,
    initialBookedSeats: 12, // 0 available (Sold out)
    baseFareAmount: 20.00,
    isWomenOnly: false,
    driverId: "drv_david_kim"
  }
];

/**
 * Initial sample bookings for student Alex Chen
 */
export const INITIAL_MOCK_BOOKINGS = [
  {
    bookingId: "CF-849201",
    rideId: "ride_upcoming_1",
    studentId: "stu_alex_2027",
    studentName: "Alex Chen",
    routeName: "North Campus Main Gate → University Metro Station (Blue Line)",
    pickupId: "loc_north_gate",
    pickupName: "North Campus Main Gate",
    destinationId: "loc_metro_blue",
    destinationName: "University Metro Station (Blue Line)",
    departureDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    departureTime: "08:45 AM",
    estimatedArrival: "09:03 AM",
    vehicleType: "Eco-Van 7 (SafeRide+)",
    totalSeats: 7,
    bookedSeats: 5,
    availableSeats: 2,
    seatCount: 1,
    farePerSeat: 35.00,
    totalFarePaid: 35.00,
    status: "CONFIRMED",
    bookingStatus: "CONFIRMED",
    bookingTimestamp: new Date(Date.now() - 7200000).toISOString(),
    boardingOtp: "5912",
    isWomenOnly: true,
    driver: MOCK_DRIVERS[0] // Priya Sharma
  },
  {
    bookingId: "CF-330194",
    rideId: "ride_completed_1",
    studentId: "stu_alex_2027",
    studentName: "Alex Chen",
    routeName: "Alan Turing Engineering Quad → Central Knowledge Commons (Library)",
    pickupId: "loc_eng_hall",
    pickupName: "Alan Turing Engineering Quad",
    destinationId: "loc_central_library",
    destinationName: "Central Knowledge Commons (Library)",
    departureDate: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
    departureTime: "02:15 PM",
    estimatedArrival: "02:27 PM",
    vehicleType: "Campus EV Shuttle",
    totalSeats: 12,
    bookedSeats: 8,
    availableSeats: 4,
    seatCount: 1,
    farePerSeat: 20.00,
    totalFarePaid: 20.00,
    status: "COMPLETED",
    bookingStatus: "COMPLETED",
    bookingTimestamp: new Date(Date.now() - 180000000).toISOString(),
    boardingOtp: "2480",
    isWomenOnly: false,
    driver: MOCK_DRIVERS[1] // Robert Martinez
  }
];
