/**
 * CampusFlow Ride & Booking Service Layer
 * ============================================================================
 * Implements backend API contracts defined by Member 3.
 * 
 * CORE REQUIREMENT:
 * Final seat availability and fare values are DYNAMICALLY COMPUTED.
 * They are NEVER hardcoded in UI components.
 * ============================================================================
 */

import {
  MOCK_CAMPUS_LOCATIONS,
  MOCK_DRIVERS,
  MOCK_RAW_SCHEDULES,
  INITIAL_MOCK_BOOKINGS,
  MOCK_STUDENT_PROFILE
} from './mockData.js';

// Local persistent state or memory store for dynamic seat tracking
const STORAGE_KEYS = {
  BOOKINGS: 'campusflow_student_bookings',
  SCHEDULE_OVERRIDES: 'campusflow_schedule_overrides',
  STUDENT_PROFILE: 'campusflow_student_profile'
};

class CampusFlowRideService {
  constructor() {
    this._initStore();
  }

  _initStore() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
          localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_MOCK_BOOKINGS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE)) {
          localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(MOCK_STUDENT_PROFILE));
        }
      }
    } catch (e) {
      console.warn("Storage not available, using in-memory state", e);
    }
  }

  getStudentProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
      return data ? JSON.parse(data) : { ...MOCK_STUDENT_PROFILE };
    } catch (e) {
      return { ...MOCK_STUDENT_PROFILE };
    }
  }

  updateStudentProfile(updates) {
    try {
      const current = this.getStudentProfile();
      const updated = { ...current, ...updates };
      localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(updated));
      return updated;
    } catch (e) {
      return updates;
    }
  }

  /**
   * Retrieves all campus stops/locations
   */
  async getLocations() {
    // Simulates network latency per Member 3 API contract
    await this._delay(80);
    return [...MOCK_CAMPUS_LOCATIONS];
  }

  /**
   * Dynamic Demand Engine: Calculates route demand, surge multipliers, and peak hours
   */
  async getRouteDemand(pickupId, destinationId, targetDate = new Date()) {
    await this._delay(100);

    const pickup = MOCK_CAMPUS_LOCATIONS.find(l => l.id === pickupId) || MOCK_CAMPUS_LOCATIONS[0];
    const destination = MOCK_CAMPUS_LOCATIONS.find(l => l.id === destinationId) || MOCK_CAMPUS_LOCATIONS[1];

    // Compute dynamic demand score (0-100) based on popularity and time
    const baseScore = Math.round((pickup.popularityScore + destination.popularityScore) / 2);
    
    // Check if current hour is campus rush hour (8:00-9:30 AM or 17:00-18:30 PM)
    const currentHour = new Date().getHours();
    const isRushHour = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 19);
    
    let dynamicScore = baseScore + (isRushHour ? 12 : -5);
    dynamicScore = Math.max(25, Math.min(98, dynamicScore));

    let demandLevel = 'MODERATE';
    let surgeMultiplier = 1.0;
    if (dynamicScore >= 88) {
      demandLevel = 'SURGE';
      surgeMultiplier = 1.35;
    } else if (dynamicScore >= 72) {
      demandLevel = 'HIGH';
      surgeMultiplier = 1.20;
    } else if (dynamicScore <= 45) {
      demandLevel = 'LOW';
      surgeMultiplier = 0.95;
    }

    const activeStudents = Math.round(dynamicScore * 0.9 + Math.floor(Math.random() * 8));

    return {
      routeId: `${pickup.id}_to_${destination.id}`,
      pickupId: pickup.id,
      pickupName: pickup.name,
      destinationId: destination.id,
      destinationName: destination.name,
      demandLevel,
      demandScore: dynamicScore,
      activeStudentRequests: activeStudents,
      surgeMultiplier: parseFloat(surgeMultiplier.toFixed(2)),
      peakHours: [
        { time: "08:00 AM - 09:30 AM", trafficFactor: 1.4, isPeak: true },
        { time: "12:30 PM - 01:30 PM", trafficFactor: 1.15, isPeak: false },
        { time: "05:00 PM - 06:45 PM", trafficFactor: 1.45, isPeak: true }
      ],
      recommendedAlternativeTime: isRushHour ? "10:15 AM (Save 20%, More Seats)" : "08:15 AM (Early Bird Express)",
      routeNotice: dynamicScore >= 88 
        ? "High demand on this corridor due to peak class dismissals. Early booking recommended."
        : "Green corridor operating with optimal campus flow."
    };
  }

  /**
   * Search available rides based on criteria
   * DYNAMIC ENGINE: Calculates real-time fares and seat availability
   */
  async searchRides({
    pickupId,
    destinationId,
    departureDate,
    timeSlotCategory = 'ALL', // 'ALL' | 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT'
    isWomenOnly = false,
    vehicleType = 'ALL'
  }) {
    await this._delay(150);

    const demandData = await this.getRouteDemand(pickupId, destinationId);
    const overrides = this._getScheduleOverrides();

    // Determine day difference for advance booking discount calculation
    const today = new Date();
    today.setHours(0,0,0,0);
    const searchDate = departureDate ? new Date(departureDate) : new Date();
    searchDate.setHours(0,0,0,0);
    const daysInAdvance = Math.max(0, Math.round((searchDate - today) / (1000 * 60 * 60 * 24)));
    const advanceDiscountFactor = daysInAdvance >= 2 ? 0.90 : 1.0; // 10% off for 2+ days advance

    // Match raw schedules or synthesize matching routes
    let matchedSchedules = MOCK_RAW_SCHEDULES.filter(s => {
      const matchPickup = !pickupId || s.pickupId === pickupId || Math.random() > 0.4;
      const matchDest = !destinationId || s.destinationId === destinationId || Math.random() > 0.4;
      return matchPickup && matchDest;
    });

    if (matchedSchedules.length === 0) {
      // Synthesize schedules for any arbitrary campus route
      matchedSchedules = this._generateSynthesizedSchedules(pickupId, destinationId);
    }

    // Process each schedule through the dynamic pricing & availability engine
    const rides = matchedSchedules.map((sched, index) => {
      const pickup = MOCK_CAMPUS_LOCATIONS.find(l => l.id === pickupId) || 
                     MOCK_CAMPUS_LOCATIONS.find(l => l.id === sched.pickupId) || 
                     MOCK_CAMPUS_LOCATIONS[0];
      const dest = MOCK_CAMPUS_LOCATIONS.find(l => l.id === destinationId) || 
                   MOCK_CAMPUS_LOCATIONS.find(l => l.id === sched.destinationId) || 
                   MOCK_CAMPUS_LOCATIONS[1];

      const rideId = `ride_${sched.id}_${departureDate || 'today'}_${index}`;
      
      // Check overrides for live seat booking updates
      const override = overrides[rideId] || {};
      const totalSeats = sched.totalCapacity;
      const bookedSeats = override.bookedSeats !== undefined ? override.bookedSeats : sched.initialBookedSeats;

      // DYNAMIC CALCULATION OF AVAILABLE SEATS:
      const availableSeats = Math.max(0, totalSeats - bookedSeats);

      // DYNAMIC STATUS DETERMINATION:
      let bookingStatus = 'OPEN';
      if (availableSeats === 0) {
        bookingStatus = 'SOLD_OUT';
      } else if (availableSeats <= 3) {
        bookingStatus = 'FILLING_FAST';
      }

      // DYNAMIC FARE CALCULATION ENGINE:
      // Base fare * Demand surge multiplier * Vehicle multiplier * Advance discount
      let vehicleMultiplier = 1.0;
      if (sched.vehicleType.includes('SafeRide+') || sched.vehicleType.includes('Eco-Van')) {
        vehicleMultiplier = 1.10;
      } else if (sched.vehicleType.includes('Cruiser')) {
        vehicleMultiplier = 0.88;
      }

      const rawCalculatedFare = sched.baseFareAmount * demandData.surgeMultiplier * vehicleMultiplier * advanceDiscountFactor;
      // Round dynamically to clean currency
      const dynamicFarePerSeat = Math.round(rawCalculatedFare);

      // Driver assignment
      const driver = MOCK_DRIVERS.find(d => d.id === sched.driverId) || 
                     (sched.isWomenOnly ? MOCK_DRIVERS[0] : MOCK_DRIVERS[1]);

      return {
        id: rideId,
        scheduleId: sched.id,
        routeName: `${pickup.name} → ${dest.name}`,
        pickupId: pickup.id,
        pickupName: pickup.name,
        pickupShortCode: pickup.shortCode,
        destinationId: dest.id,
        destinationName: dest.name,
        destinationShortCode: dest.shortCode,
        departureDate: departureDate || new Date().toISOString().split('T')[0],
        departureTime: sched.timeSlot,
        estimatedArrival: this._calculateArrival(sched.timeSlot, sched.durationMinutes),
        durationMinutes: sched.durationMinutes,
        vehicleType: sched.vehicleType,
        totalSeats: totalSeats,
        bookedSeats: bookedSeats,
        availableSeats: availableSeats, // DYNAMICALLY COMPUTED
        baseFare: sched.baseFareAmount,
        farePerSeat: dynamicFarePerSeat, // DYNAMICALLY COMPUTED
        bookingStatus: bookingStatus,   // DYNAMICALLY COMPUTED
        isWomenOnly: sched.isWomenOnly,
        isWheelchairAccessible: !!sched.isWheelchairAccessible,
        driver: driver,
        demandInfo: {
          level: demandData.demandLevel,
          surgeMultiplier: demandData.surgeMultiplier
        }
      };
    });

    // Apply Filters
    let filtered = rides;

    // Filter 1: Women-Only Preference
    if (isWomenOnly) {
      filtered = filtered.filter(r => r.isWomenOnly && r.driver.isWomenCertified);
    }

    // Filter 2: Vehicle Type
    if (vehicleType !== 'ALL') {
      filtered = filtered.filter(r => r.vehicleType.toLowerCase().includes(vehicleType.toLowerCase()));
    }

    // Filter 3: Time Slot Category
    if (timeSlotCategory !== 'ALL') {
      filtered = filtered.filter(r => {
        const hour = this._parseHour(r.departureTime);
        if (timeSlotCategory === 'MORNING') return hour >= 6 && hour < 12;
        if (timeSlotCategory === 'AFTERNOON') return hour >= 12 && hour < 17;
        if (timeSlotCategory === 'EVENING') return hour >= 17 && hour < 21;
        if (timeSlotCategory === 'NIGHT') return hour >= 21 || hour < 6;
        return true;
      });
    }

    return filtered;
  }

  /**
   * Creates a confirmed booking for the student
   * DYNAMIC SEAT ATOMIZATION: Deducts available seats from the ride
   */
  async createBooking({
    ride,
    seatCount = 1,
    isWomenOnly = false,
    specialNotes = ""
  }) {
    await this._delay(180);

    if (seatCount > ride.availableSeats) {
      throw new Error(`Only ${ride.availableSeats} seat(s) currently available. Cannot book ${seatCount}.`);
    }

    const student = this.getStudentProfile();
    const totalFare = ride.farePerSeat * seatCount;

    if (student.campusPassBalance < totalFare) {
      throw new Error(`Insufficient Campus Pass balance (Balance: ₹${student.campusPassBalance.toFixed(2)}, Required: ₹${totalFare.toFixed(2)}). Please top up your pass.`);
    }

    // Deduct student balance
    this.updateStudentProfile({
      campusPassBalance: student.campusPassBalance - totalFare,
      ridesCompletedThisSemester: student.ridesCompletedThisSemester + 1,
      carbonSavedKg: parseFloat((student.carbonSavedKg + (1.4 * seatCount)).toFixed(1))
    });

    // Update dynamic seat reservation in schedule overrides
    const overrides = this._getScheduleOverrides();
    const currentBooked = overrides[ride.id]?.bookedSeats !== undefined 
      ? overrides[ride.id].bookedSeats 
      : ride.bookedSeats;
    
    overrides[ride.id] = {
      bookedSeats: currentBooked + seatCount
    };
    this._saveScheduleOverrides(overrides);

    // Generate unique booking record
    const bookingId = `CF-${Math.floor(100000 + Math.random() * 900000)}`;
    const boardingOtp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      bookingId,
      rideId: ride.id,
      studentId: student.id,
      studentName: student.name,
      routeName: ride.routeName,
      pickupId: ride.pickupId,
      pickupName: ride.pickupName,
      destinationId: ride.destinationId,
      destinationName: ride.destinationName,
      departureDate: ride.departureDate,
      departureTime: ride.departureTime,
      estimatedArrival: ride.estimatedArrival,
      vehicleType: ride.vehicleType,
      totalSeats: ride.totalSeats,
      bookedSeats: currentBooked + seatCount,
      availableSeats: Math.max(0, ride.totalSeats - (currentBooked + seatCount)),
      seatCount,
      farePerSeat: ride.farePerSeat,
      totalFarePaid: totalFare,
      status: "CONFIRMED",
      bookingStatus: "CONFIRMED",
      bookingTimestamp: new Date().toISOString(),
      boardingOtp,
      isWomenOnly: !!isWomenOnly || ride.isWomenOnly,
      specialNotes,
      driver: ride.driver
    };

    // Save to student bookings list
    const myBookings = this.getMyBookings();
    myBookings.unshift(newBooking);
    this._saveBookings(myBookings);

    return newBooking;
  }

  /**
   * Booking Cancellation
   * DYNAMIC ENGINE: Frees up the reserved seat and credits refund to student wallet
   */
  async cancelBooking(bookingId, reason = "Student requested cancellation") {
    await this._delay(150);

    const bookings = this.getMyBookings();
    const index = bookings.findIndex(b => b.bookingId === bookingId);
    if (index === -1) {
      throw new Error(`Booking ${bookingId} not found.`);
    }

    const booking = bookings[index];
    if (booking.status === "CANCELLED") {
      throw new Error(`Booking ${bookingId} is already cancelled.`);
    }

    // Dynamic refund calculation (100% campus pass refund policy)
    const refundAmount = booking.totalFarePaid;
    const student = this.getStudentProfile();
    this.updateStudentProfile({
      campusPassBalance: student.campusPassBalance + refundAmount
    });

    // Dynamic seat release in schedule overrides
    const overrides = this._getScheduleOverrides();
    if (overrides[booking.rideId]) {
      overrides[booking.rideId].bookedSeats = Math.max(0, overrides[booking.rideId].bookedSeats - booking.seatCount);
      this._saveScheduleOverrides(overrides);
    }

    // Update booking state
    const updatedBooking = {
      ...booking,
      status: "CANCELLED",
      bookingStatus: "CANCELLED",
      cancellationTimestamp: new Date().toISOString(),
      cancellationReason: reason,
      refundAmount: refundAmount,
      availableSeats: booking.availableSeats + booking.seatCount,
      bookedSeats: Math.max(0, booking.bookedSeats - booking.seatCount)
    };

    bookings[index] = updatedBooking;
    this._saveBookings(bookings);

    return updatedBooking;
  }

  /**
   * Retrieves all bookings for the student
   */
  getMyBookings(filter = 'ALL') {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      let list = data ? JSON.parse(data) : [...INITIAL_MOCK_BOOKINGS];
      
      if (filter === 'UPCOMING') {
        list = list.filter(b => b.status === 'CONFIRMED' || b.status === 'IN_TRANSIT');
      } else if (filter === 'COMPLETED') {
        list = list.filter(b => b.status === 'COMPLETED');
      } else if (filter === 'CANCELLED') {
        list = list.filter(b => b.status === 'CANCELLED');
      }
      return list;
    } catch (e) {
      return [...INITIAL_MOCK_BOOKINGS];
    }
  }

  /**
   * Retrieves confirmed driver details for a booking
   */
  async getDriverDetails(bookingId) {
    await this._delay(80);
    const bookings = this.getMyBookings();
    const booking = bookings.find(b => b.bookingId === bookingId);
    if (!booking) throw new Error("Booking not found");

    return {
      bookingId: booking.bookingId,
      status: booking.status,
      boardingOtp: booking.boardingOtp,
      departureTime: booking.departureTime,
      estimatedArrival: booking.estimatedArrival,
      vehicleType: booking.vehicleType,
      driver: booking.driver,
      pickupName: booking.pickupName,
      destinationName: booking.destinationName,
      liveEtaMinutes: Math.floor(4 + Math.random() * 5),
      shuttleCurrentLocation: "Approaching Academic North Roundabout (400m away)"
    };
  }

  /* ------------------- Helper Methods ------------------- */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _getScheduleOverrides() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULE_OVERRIDES);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  _saveScheduleOverrides(overrides) {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE_OVERRIDES, JSON.stringify(overrides));
    } catch (e) {}
  }

  _saveBookings(bookings) {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {}
  }

  _calculateArrival(timeSlot, durationMinutes) {
    try {
      const [time, modifier] = timeSlot.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (hours === 12 && modifier === 'AM') hours = 0;
      if (hours !== 12 && modifier === 'PM') hours += 12;

      const date = new Date();
      date.setHours(hours, minutes + durationMinutes, 0, 0);

      let arrHours = date.getHours();
      const arrMinutes = date.getMinutes().toString().padStart(2, '0');
      const arrMod = arrHours >= 12 ? 'PM' : 'AM';
      arrHours = arrHours % 12 || 12;

      return `${arrHours.toString().padStart(2, '0')}:${arrMinutes} ${arrMod}`;
    } catch (e) {
      return "20 mins later";
    }
  }

  _parseHour(timeSlot) {
    try {
      const [time, modifier] = timeSlot.split(' ');
      let [hours] = time.split(':').map(Number);
      if (hours === 12 && modifier === 'AM') return 0;
      if (hours !== 12 && modifier === 'PM') return hours + 12;
      return hours;
    } catch (e) {
      return 9;
    }
  }

  _generateSynthesizedSchedules(pickupId, destId) {
    return [
      {
        id: `gen_1_${pickupId}`,
        pickupId,
        destinationId: destId,
        timeSlot: "09:00 AM",
        durationMinutes: 16,
        vehicleType: "Campus EV Shuttle",
        totalCapacity: 12,
        initialBookedSeats: 6,
        baseFareAmount: 25.00,
        isWomenOnly: false,
        driverId: "drv_robert_martinez"
      },
      {
        id: `gen_2_${pickupId}`,
        pickupId,
        destinationId: destId,
        timeSlot: "09:45 AM",
        durationMinutes: 15,
        vehicleType: "SafeRide+ Women's EV",
        totalCapacity: 6,
        initialBookedSeats: 3,
        baseFareAmount: 32.00,
        isWomenOnly: true,
        driverId: "drv_priya_sharma"
      },
      {
        id: `gen_3_${pickupId}`,
        pickupId,
        destinationId: destId,
        timeSlot: "11:15 AM",
        durationMinutes: 18,
        vehicleType: "Eco-Van 7",
        totalCapacity: 7,
        initialBookedSeats: 4,
        baseFareAmount: 28.00,
        isWomenOnly: false,
        driverId: "drv_david_kim"
      }
    ];
  }
}

export const rideService = new CampusFlowRideService();
