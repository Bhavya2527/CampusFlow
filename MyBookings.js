/**
 * CampusFlow My Bookings Module
 * Responsibility: Member 2 (Student Ride Booking Experience)
 * 
 * Requirement 9: My bookings
 * Shows student's booking history with tabbed views (Upcoming, Completed, Cancelled).
 * 
 * Each card displays ALL 9 REQUIRED ATTRIBUTES:
 * - Route
 * - Fare per seat
 * - Vehicle type
 * - Total seats
 * - Booked seats
 * - Available seats
 * - Departure time
 * - Estimated arrival
 * - Booking status
 */

import { Icons } from '../../components/shared/Icons.js';
import { Badge } from '../../components/shared/Badge.js';
import { Button } from '../../components/shared/Button.js';
import { openCancellationModal } from './CancellationModal.js';
import { openDriverDetailsModal } from './DriverDetailsModal.js';

export function MyBookings({
  bookings = [],
  activeFilter = 'ALL', // 'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'
  onFilterChange = () => { },
  onBookingUpdate = () => { }
}) {
  const container = document.createElement("div");
  container.className = "space-y-4";

  // Filter Bookings
  let filteredBookings = bookings;
  if (activeFilter === 'UPCOMING') {
    filteredBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'IN_TRANSIT');
  } else if (activeFilter === 'COMPLETED') {
    filteredBookings = bookings.filter(b => b.status === 'COMPLETED');
  } else if (activeFilter === 'CANCELLED') {
    filteredBookings = bookings.filter(b => b.status === 'CANCELLED');
  }

  const upcomingCount = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'IN_TRANSIT').length;
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;
  const cancelledCount = bookings.filter(b => b.status === 'CANCELLED').length;

  container.innerHTML = `
    <!-- Top Header & Filter Chips -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
      <div>
        <h2 class="text-lg font-bold text-slate-900 tracking-tight">My Ride Bookings</h2>
        <p class="text-xs text-slate-500">Track upcoming departures, boarding passes, and travel history</p>
      </div>

      <!-- Filter Tabs -->
      <div class="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none" id="booking-status-filter-pills">
        <button type="button" data-filter="ALL" class="booking-filter-pill px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${activeFilter === 'ALL' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}">
          All (${bookings.length})
        </button>
        <button type="button" data-filter="UPCOMING" class="booking-filter-pill px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${activeFilter === 'UPCOMING' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}">
          Upcoming (${upcomingCount})
        </button>
        <button type="button" data-filter="COMPLETED" class="booking-filter-pill px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${activeFilter === 'COMPLETED' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}">
          Completed (${completedCount})
        </button>
        <button type="button" data-filter="CANCELLED" class="booking-filter-pill px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${activeFilter === 'CANCELLED' ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}">
          Cancelled (${cancelledCount})
        </button>
      </div>
    </div>

    <!-- Booking List Container -->
    <div class="space-y-4" id="bookings-card-list">
      ${filteredBookings.length === 0 ? `
        <div class="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
          <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            ${Icons.Ticket("w-6 h-6")}
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-800">No bookings in this view</h4>
            <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              ${activeFilter === 'UPCOMING' ? "You don't have any upcoming campus rides scheduled right now." : "No bookings found matching your selected status."}
            </p>
          </div>
        </div>
      ` : ""}
    </div>
  `;

  // Attach Filter Listeners
  container.querySelectorAll(".booking-filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const filter = pill.getAttribute("data-filter");
      onFilterChange(filter);
    });
  });

  // Render individual booking cards
  const listContainer = container.querySelector("#bookings-card-list");
  filteredBookings.forEach(booking => {
    const cardEl = renderSingleBookingCard(booking, onBookingUpdate);
    listContainer.appendChild(cardEl);
  });

  return container;
}

/**
 * Helper to render each booking card showing ALL 9 REQUIRED FIELDS:
 * 1. Route
 * 2. Fare per seat
 * 3. Vehicle type
 * 4. Total seats
 * 5. Booked seats
 * 6. Available seats
 * 7. Departure time
 * 8. Estimated arrival
 * 9. Booking status
 */
function renderSingleBookingCard(booking, onBookingUpdate) {
  const card = document.createElement("div");
  const isUpcoming = booking.status === 'CONFIRMED' || booking.status === 'IN_TRANSIT';
  const isCancelled = booking.status === 'CANCELLED';

  card.className = `bg-white rounded-3xl border ${isCancelled
      ? 'border-slate-200 bg-slate-50/50'
      : isUpcoming
        ? 'border-emerald-200 shadow-sm ring-1 ring-emerald-100'
        : 'border-slate-200 shadow-2xs'
    } p-5 sm:p-6 space-y-4`;

  card.innerHTML = `
    <!-- Top Row: Reference & Status -->
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-3 border-b border-slate-100">
      <div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            ${booking.bookingId}
          </span>
          <!-- 9. BOOKING STATUS -->
          ${Badge({
    type: "status",
    value: booking.bookingStatus || booking.status,
    text: booking.bookingStatus || booking.status
  })}
          ${booking.isWomenOnly ? `
            <span class="text-[11px] font-bold text-pink-700 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full">
              SafeRide+ Women
            </span>
          ` : ""}
        </div>
        
        <!-- 1. ROUTE -->
        <h3 class="text-base font-bold text-slate-900 mt-1 leading-snug">
          ${booking.routeName}
        </h3>
      </div>

      <!-- Boarding OTP (for active rides) -->
      ${isUpcoming ? `
        <div class="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-center shrink-0">
          <div class="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Boarding PIN</div>
          <div class="text-base font-black text-emerald-700 tracking-widest font-mono">${booking.boardingOtp}</div>
        </div>
      ` : ''}
    </div>

    <!-- Middle Specs: Required fields 2 through 8 -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 text-xs">
      
      <!-- 7. DEPARTURE TIME & 8. ESTIMATED ARRIVAL -->
      <div>
        <span class="text-slate-400 text-[10px] block uppercase font-bold">Departure / Arrival</span>
        <span class="font-bold text-slate-800">${booking.departureTime}</span>
        <span class="text-slate-400 block text-[11px]">→ ${booking.estimatedArrival}</span>
      </div>

      <!-- 2. FARE PER SEAT & TOTAL PAID -->
      <div>
        <span class="text-slate-400 text-[10px] block uppercase font-bold">Fare per Seat</span>
        <span class="font-bold text-slate-900">₹${booking.farePerSeat.toFixed(2)}</span>
        <span class="text-emerald-700 block text-[11px] font-semibold">Total: ₹${booking.totalFarePaid.toFixed(2)}</span>
      </div>

      <!-- 3. VEHICLE TYPE -->
      <div>
        <span class="text-slate-400 text-[10px] block uppercase font-bold">Vehicle Type</span>
        <span class="font-bold text-slate-800 line-clamp-1">${booking.vehicleType}</span>
        <span class="text-slate-500 block text-[11px]">${booking.seatCount} seat${booking.seatCount > 1 ? 's' : ''} booked</span>
      </div>

      <!-- 4. TOTAL SEATS, 5. BOOKED, 6. AVAILABLE SEATS -->
      <div>
        <span class="text-slate-400 text-[10px] block uppercase font-bold">Seat Status</span>
        <span class="font-bold text-slate-800">${booking.availableSeats} of ${booking.totalSeats} seats open</span>
        <span class="text-slate-500 block text-[11px]">Total: ${booking.totalSeats} | Booked: ${booking.bookedSeats}</span>
      </div>

    </div>

    <!-- Cancellation details if cancelled -->
    ${isCancelled ? `
      <div class="p-3 bg-rose-50 border border-rose-200/70 rounded-xl text-xs space-y-0.5 text-rose-800">
        <div class="flex justify-between font-bold">
          <span>Cancelled on: ${new Date(booking.cancellationTimestamp).toLocaleDateString()}</span>
          <span>Refunded: ₹${(booking.refundAmount || booking.totalFarePaid).toFixed(2)}</span>
        </div>
        <p class="text-[11px] text-rose-600">Reason: ${booking.cancellationReason || "Student requested"}</p>
      </div>
    ` : ''}

    <!-- Bottom Actions: Driver Details & Cancellation -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
      
      <!-- Driver Info Pill -->
      <div class="flex items-center space-x-2 text-xs cursor-pointer group" id="view-driver-pill">
        <img src="${booking.driver.avatarUrl}" class="w-7 h-7 rounded-full object-cover border border-slate-300 group-hover:border-emerald-500" />
        <div>
          <span class="font-bold text-slate-800 group-hover:text-emerald-700">${booking.driver.fullName}</span>
          <span class="text-slate-400 text-[11px]"> • ${booking.driver.licensePlate}</span>
        </div>
        <span class="text-emerald-600 text-[11px] font-semibold underline ml-1">View Details</span>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-2 self-end sm:self-auto">
        ${isUpcoming ? `
          <button type="button" id="cancel-booking-btn" class="px-3.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer touch-target">
            Cancel Booking
          </button>
        ` : ''}

        <button type="button" id="driver-details-btn" class="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer touch-target flex items-center space-x-1.5">
          ${Icons.Car("w-3.5 h-3.5 text-slate-500")}
          <span>Driver & Shuttle</span>
        </button>
      </div>

    </div>
  `;

  // Event: Driver Details Click
  const openDriver = () => {
    openDriverDetailsModal({ booking, driver: booking.driver });
  };
  card.querySelector("#view-driver-pill").addEventListener("click", openDriver);
  card.querySelector("#driver-details-btn").addEventListener("click", openDriver);

  // Event: Cancel Booking Click
  if (isUpcoming) {
    card.querySelector("#cancel-booking-btn").addEventListener("click", () => {
      openCancellationModal({
        booking,
        onCancelled: (updated) => {
          onBookingUpdate(updated);
        }
      });
    });
  }

  return card;
}
