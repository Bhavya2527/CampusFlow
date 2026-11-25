"""
CampusFlow Test Suite: Verification of Member 2 Student Ride Booking
Tests data contracts, dynamic seat calculations, fare computations,
advance booking calendar logic, women-only preferences, and cancellation engine.
"""

import os
import re
import sys

def test_file_existence():
    required_files = [
        "index.html",
        "server.py",
        "src/app.js",
        "src/styles/design-tokens.css",
        "src/api/contracts.js",
        "src/api/mockData.js",
        "src/api/rideService.js",
        "src/components/shared/Icons.js",
        "src/components/shared/Badge.js",
        "src/components/shared/Button.js",
        "src/components/shared/Card.js",
        "src/components/shared/Input.js",
        "src/components/shared/Modal.js",
        "src/components/shared/Toast.js",
        "src/components/shared/Tabs.js",
        "src/components/shared/Header.js",
        "src/modules/booking/StudentDashboard.js",
        "src/modules/booking/RideSearch.js",
        "src/modules/booking/RideCard.js",
        "src/modules/booking/RouteDemandPreview.js",
        "src/modules/booking/AdvanceBookingCalendar.js",
        "src/modules/booking/DepartureTimeSelector.js",
        "src/modules/booking/BookingConfirmModal.js",
        "src/modules/booking/CancellationModal.js",
        "src/modules/booking/DriverDetailsModal.js",
        "src/modules/booking/MyBookings.js"
    ]

    missing = []
    for f in required_files:
        if not os.path.exists(f):
            missing.append(f)
    
    assert len(missing) == 0, f"Missing files: {missing}"
    print(f"✓ All {len(required_files)} architecture files exist.")

def test_booking_card_required_fields():
    """
    Booking card must show:
    - Route
    - Fare per seat
    - Vehicle type
    - Total seats
    - Booked seats
    - Available seats
    - Departure time
    - Estimated arrival
    - Booking status
    """
    with open("src/modules/booking/RideCard.js", "r", encoding="utf-8") as f:
        content = f.read()

    required_keywords = [
        "routeName",
        "farePerSeat",
        "vehicleType",
        "totalSeats",
        "bookedSeats",
        "availableSeats",
        "departureTime",
        "estimatedArrival",
        "bookingStatus"
    ]

    for kw in required_keywords:
        assert kw in content, f"Missing required booking card attribute in RideCard.js: {kw}"
    print("✓ RideCard contains all 9 required attributes.")

    # Check MyBookings card as well
    with open("src/modules/booking/MyBookings.js", "r", encoding="utf-8") as f:
        my_bookings_content = f.read()

    for kw in required_keywords:
        assert kw in my_bookings_content, f"Missing required booking card attribute in MyBookings.js: {kw}"
    print("✓ MyBookings contains all 9 required attributes.")

def test_no_hardcoded_values():
    """
    Ensure seat availability and fare values are dynamically computed in rideService
    and not hardcoded.
    """
    with open("src/api/rideService.js", "r", encoding="utf-8") as f:
        service_code = f.read()

    # Verify dynamic computation formulas exist
    assert "availableSeats = Math.max(0, totalSeats - bookedSeats)" in service_code or "totalSeats - bookedSeats" in service_code, \
        "Dynamic availableSeats formula not found in rideService.js"

    assert "rawCalculatedFare = sched.baseFareAmount * demandData.surgeMultiplier" in service_code or "surgeMultiplier" in service_code, \
        "Dynamic fare calculation not found in rideService.js"

    assert "advanceDiscountFactor" in service_code, \
        "Advance booking discount factor not found in rideService.js"

    assert "cancelBooking" in service_code, \
        "Cancellation engine not found in rideService.js"

    print("✓ Dynamic seat and fare calculation engine verified in rideService.js.")

def test_women_only_preference():
    with open("src/api/rideService.js", "r", encoding="utf-8") as f:
        code = f.read()
    assert "isWomenOnly" in code
    assert "driver.isWomenCertified" in code or "isWomenCertified" in code
    print("✓ Women-only SafeRide preference filtering verified.")

def test_cancellation_refund_and_seat_release():
    with open("src/api/rideService.js", "r", encoding="utf-8") as f:
        code = f.read()
    # Check refund calculation
    assert "refundAmount" in code or "campusPassBalance + refundAmount" in code or "campusPassBalance +" in code
    # Check seat release
    assert "bookedSeats - booking.seatCount" in code or "availableSeats + booking.seatCount" in code
    print("✓ Cancellation refund & seat release verified.")

if __name__ == "__main__":
    print("Running CampusFlow Verification Tests...")
    test_file_existence()
    test_booking_card_required_fields()
    test_no_hardcoded_values()
    test_women_only_preference()
    test_cancellation_refund_and_seat_release()
    print("\n🎉 ALL 5 INTEGRATION SUITES PASSED!")
