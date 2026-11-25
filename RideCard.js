/**
 * CampusFlow Booking Card Component
 * Responsibility: Member 2 (Student Ride Booking Experience)
 * 
 * MUST SHOW (Explicit Requirements):
 * 1. Route
 * 2. Fare per seat
 * 3. Vehicle type
 * 4. Total seats
 * 5. Booked seats
 * 6. Available seats
 * 7. Departure time
 * 8. Estimated arrival
 * 9. Booking status
 * 
 * CORE CONSTRAINT:
 * Final seat availability and fare values are DYNAMICALLY COMPUTED by rideService
 * and NEVER hardcoded in the UI.
 */

import { Icons } from '../../components/shared/Icons.js';
import { Badge } from '../../components/shared/Badge.js';
import { Button } from '../../components/shared/Button.js';

export function RideCard({
  ride,
  onBookClick = () => {},
  onDriverTeaserClick = () => {}
}) {
  const card = document.createElement("div");
  const isSoldOut = ride.availableSeats === 0;
  const isFillingFast = ride.availableSeats > 0 && ride.availableSeats <= 3;

  card.className = `bg-white rounded-3xl border ${
    isSoldOut 
      ? 'border-slate-200 opacity-80' 
      : isFillingFast 
        ? 'border-amber-200/90 shadow-sm hover:border-amber-400' 
        : 'border-slate-200 shadow-sm hover:border-emerald-300'
  } p-5 sm:p-6 transition-all duration-200 relative overflow-hidden`;

  // Capacity fill percentage for progress bar
  const bookedPercent = Math.min(100, Math.round((ride.bookedSeats / ride.totalSeats) * 100));

  let seatBarColor = "bg-emerald-500";
  if (isSoldOut) seatBarColor = "bg-rose-500";
  else if (isFillingFast) seatBarColor = "bg-amber-500";

  // Local state for interactive seat booking count
  let selectedSeatCount = 1;

  card.innerHTML = `
    <!-- Top Row: Route & Booking Status Badge -->
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-3.5 border-b border-slate-100">
      <div class="space-y-1">
        
        <!-- 1. ROUTE -->
        <div class="flex items-center space-x-2">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
            Route
          </span>
          <h3 class="text-base font-bold text-slate-900 leading-snug">
            ${ride.routeName}
          </h3>
        </div>

        <div class="flex flex-wrap items-center gap-2 pt-0.5">
          <!-- 3. VEHICLE TYPE -->
          <span class="inline-flex items-center text-xs text-slate-600 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full">
            ${Icons.Car("w-3.5 h-3.5 text-slate-500 mr-1")}
            <strong>Vehicle:</strong>&nbsp;${ride.vehicleType}
          </span>

          ${ride.isWomenOnly ? `
            <span class="inline-flex items-center text-xs font-semibold text-pink-700 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full">
              ${Icons.ShieldCheck("w-3.5 h-3.5 text-pink-600 mr-1")}
              Women-Only SafeRide
            </span>
          ` : ""}

          ${ride.isWheelchairAccessible ? `
            <span class="inline-flex items-center text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              ♿ Accessible
            </span>
          ` : ""}
        </div>
      </div>

      <!-- 9. BOOKING STATUS -->
      <div class="shrink-0 self-start">
        ${Badge({
          type: "status",
          value: ride.bookingStatus,
          text: ride.bookingStatus === 'OPEN' ? 'Open for Booking' : ride.bookingStatus === 'FILLING_FAST' ? 'Filling Fast' : 'Sold Out'
        })}
      </div>
    </div>

    <!-- Middle Grid: Timing, Fares, & Seat Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 my-1 border-b border-slate-100">
      
      <!-- 7. DEPARTURE TIME & 8. ESTIMATED ARRIVAL -->
      <div class="flex items-center space-x-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
        <div class="p-2.5 rounded-xl bg-white text-emerald-600 border border-slate-200/60 shadow-2xs">
          ${Icons.Clock("w-5 h-5")}
        </div>
        <div class="space-y-0.5">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Departure / Arrival</div>
          <div class="text-sm font-bold text-slate-900">
            ${ride.departureTime} <span class="text-slate-400 font-normal">→</span> ${ride.estimatedArrival}
          </div>
          <div class="text-[11px] text-slate-500 font-medium">
            Est. ${ride.durationMinutes} mins transit
          </div>
        </div>
      </div>

      <!-- 2. FARE PER SEAT (Dynamically Computed) -->
      <div class="flex items-center space-x-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
        <div class="p-2.5 rounded-xl bg-white text-indigo-600 border border-slate-200/60 shadow-2xs">
          ${Icons.Zap("w-5 h-5")}
        </div>
        <div class="space-y-0.5">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fare per Seat</div>
          <div class="text-lg font-extrabold text-slate-900 leading-none">
            ₹${ride.farePerSeat.toFixed(2)}
            <span class="text-xs font-normal text-slate-500">/ seat</span>
          </div>
          <div class="text-[10px] text-slate-400 font-medium">
            Dynamic Campus Rate (${ride.demandInfo ? ride.demandInfo.level : 'Standard'})
          </div>
        </div>
      </div>

      <!-- 4. TOTAL SEATS, 5. BOOKED SEATS, 6. AVAILABLE SEATS (Dynamically Computed) -->
      <div class="flex flex-col justify-center bg-slate-50/70 p-3 rounded-2xl border border-slate-100 space-y-2">
        <div class="flex justify-between items-center text-xs">
          <span class="text-slate-500 font-medium">Total: <strong class="text-slate-800 font-bold">${ride.totalSeats}</strong></span>
          <span class="text-slate-500 font-medium">Booked: <strong class="text-slate-800 font-bold">${ride.bookedSeats}</strong></span>
          <span class="${isSoldOut ? 'text-rose-600' : isFillingFast ? 'text-amber-600' : 'text-emerald-700'} font-bold">
            Available: <strong>${ride.availableSeats}</strong>
          </span>
        </div>

        <!-- Seat Capacity Bar -->
        <div class="seat-bar-container">
          <div class="seat-bar-fill ${seatBarColor}" style="width: ${bookedPercent}%"></div>
        </div>

        <div class="text-[10px] text-slate-400 text-right">
          ${isSoldOut ? 'No seats remaining' : `${ride.availableSeats} of ${ride.totalSeats} seats open`}
        </div>
      </div>

    </div>

    <!-- Bottom Row: Assigned Driver Teaser & Interactive Booking Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
      
      <!-- Driver Teaser -->
      <div class="flex items-center space-x-2.5 cursor-pointer group" id="driver-teaser-area" title="Click to view driver details">
        <img 
          src="${ride.driver.avatarUrl}" 
          alt="${ride.driver.fullName}" 
          class="w-9 h-9 rounded-full object-cover border-2 border-slate-200 group-hover:border-emerald-500 transition-colors"
        />
        <div class="text-xs">
          <div class="flex items-center space-x-1.5">
            <span class="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">${ride.driver.fullName}</span>
            <span class="flex items-center text-amber-500 font-semibold text-[11px]">
              ${Icons.Star("w-3 h-3 mr-0.5")}
              ${ride.driver.rating.toFixed(2)}
            </span>
          </div>
          <p class="text-[11px] text-slate-500">${ride.driver.licensePlate} • ${ride.driver.isUniversityVerified ? 'Campus Verified' : 'Staff'}</p>
        </div>
      </div>

      <!-- Seat Selector & Booking Action -->
      <div class="flex items-center space-x-3 self-end sm:self-auto">
        
        <!-- Seat Counter (if available) -->
        ${!isSoldOut ? `
          <div class="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button type="button" id="seat-decrement-btn" class="w-7 h-7 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center text-sm shadow-2xs cursor-pointer touch-target">
              -
            </button>
            <span id="selected-seat-display" class="w-8 text-center font-bold text-sm text-slate-800">
              1
            </span>
            <button type="button" id="seat-increment-btn" class="w-7 h-7 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center text-sm shadow-2xs cursor-pointer touch-target">
              +
            </button>
          </div>
        ` : ''}

        <!-- Book Action Button Mount -->
        <div id="book-action-button-mount"></div>

      </div>

    </div>
  `;

  // Mount Book Button
  const bookBtnMount = card.querySelector("#book-action-button-mount");
  const bookBtn = Button({
    text: isSoldOut ? "Sold Out" : `Book (${selectedSeatCount} seat)`,
    variant: isSoldOut ? "secondary" : ride.isWomenOnly ? "women-safe" : "primary",
    disabled: isSoldOut,
    onClick: () => {
      onBookClick(ride, selectedSeatCount);
    }
  });
  bookBtnMount.appendChild(bookBtn);

  // Seat Counter Interactivity
  if (!isSoldOut) {
    const decBtn = card.querySelector("#seat-decrement-btn");
    const incBtn = card.querySelector("#seat-increment-btn");
    const display = card.querySelector("#selected-seat-display");

    const updateSeatCount = (newCount) => {
      selectedSeatCount = newCount;
      display.textContent = selectedSeatCount;
      bookBtn.querySelector("span").textContent = `Book (${selectedSeatCount} seat${selectedSeatCount > 1 ? 's' : ''} • ₹${(ride.farePerSeat * selectedSeatCount).toFixed(0)})`;
    };

    decBtn.addEventListener("click", () => {
      if (selectedSeatCount > 1) {
        updateSeatCount(selectedSeatCount - 1);
      }
    });

    incBtn.addEventListener("click", () => {
      const maxAllowed = Math.min(ride.availableSeats, 4); // max 4 seats per booking
      if (selectedSeatCount < maxAllowed) {
        updateSeatCount(selectedSeatCount + 1);
      }
    });
  }

  // Driver Teaser Click
  card.querySelector("#driver-teaser-area").addEventListener("click", () => {
    onDriverTeaserClick(ride.driver, ride);
  });

  return card;
}
