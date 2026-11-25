/**
 * CampusFlow Booking Confirmation Modal
 * Responsibility: Member 2 (Student Ride Booking Experience)
 * 
 * Provides transparent review of ride parameters, dynamic seat calculation,
 * student wallet deduction, and immediate booking confirmation.
 */

import { openModal } from '../../components/shared/Modal.js';
import { Icons } from '../../components/shared/Icons.js';
import { rideService } from '../../api/rideService.js';
import { showToast } from '../../components/shared/Toast.js';

export function openBookingConfirmModal({
  ride,
  seatCount = 1,
  onBookingSuccess = () => {}
}) {
  const student = rideService.getStudentProfile();
  const totalAmount = ride.farePerSeat * seatCount;
  const balanceAfter = student.campusPassBalance - totalAmount;
  const hasSufficientBalance = balanceAfter >= 0;

  const contentHtml = `
    <div class="space-y-4">
      
      <!-- Route & Timing Card -->
      <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
        <div class="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase">
          ${Icons.Car("w-4 h-4 text-emerald-600")}
          <span>${ride.vehicleType}</span>
          ${ride.isWomenOnly ? `<span class="text-pink-600">• Women-Only SafeRide+</span>` : ''}
        </div>

        <!-- Visual Route Timeline -->
        <div class="space-y-2 text-sm">
          <div class="flex items-start space-x-3">
            <div class="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 mt-1 shrink-0"></div>
            <div>
              <p class="font-bold text-slate-800 leading-snug">${ride.pickupName}</p>
              <p class="text-xs text-slate-500 font-medium">Boarding at: <strong>${ride.departureTime}</strong></p>
            </div>
          </div>

          <div class="ml-1.5 w-0.5 h-4 bg-slate-200"></div>

          <div class="flex items-start space-x-3">
            <div class="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-100 mt-1 shrink-0"></div>
            <div>
              <p class="font-bold text-slate-800 leading-snug">${ride.destinationName}</p>
              <p class="text-xs text-slate-500 font-medium">Est. Arrival: <strong>${ride.estimatedArrival}</strong> (${ride.durationMinutes} mins)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Fare Calculation Breakdown (Dynamic) -->
      <div class="p-4 bg-white rounded-2xl border border-slate-200 space-y-2.5 text-xs">
        <h4 class="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Fare & Seat Calculation</h4>
        
        <div class="flex justify-between items-center text-slate-600">
          <span>Fare per Seat</span>
          <span class="font-semibold text-slate-800">₹${ride.farePerSeat.toFixed(2)}</span>
        </div>

        <div class="flex justify-between items-center text-slate-600">
          <span>Seats Reserved</span>
          <span class="font-semibold text-slate-800">${seatCount} seat${seatCount > 1 ? 's' : ''}</span>
        </div>

        <div class="pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-900">
          <span>Total Fare Payable</span>
          <span class="text-emerald-700 text-base">₹${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <!-- Campus Pass Payment & Wallet Status -->
      <div class="p-3.5 rounded-2xl border ${hasSufficientBalance ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50 border-rose-200'} text-xs space-y-1">
        <div class="flex justify-between font-bold ${hasSufficientBalance ? 'text-emerald-900' : 'text-rose-900'}">
          <span>Campus Pass Balance</span>
          <span>₹${student.campusPassBalance.toFixed(2)}</span>
        </div>
        <div class="flex justify-between ${hasSufficientBalance ? 'text-emerald-700' : 'text-rose-600'}">
          <span>Balance after booking:</span>
          <span>₹${Math.max(0, balanceAfter).toFixed(2)}</span>
        </div>
        ${!hasSufficientBalance ? `
          <p class="text-[11px] font-semibold text-rose-700 pt-1">
            ⚠️ Insufficient funds on your Campus Pass. Please top up your wallet to confirm this booking.
          </p>
        ` : ''}
      </div>

      <!-- Verified Driver Teaser -->
      <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
        <img src="${ride.driver.avatarUrl}" class="w-8 h-8 rounded-full object-cover border border-slate-300" />
        <div class="flex-1">
          <p class="font-bold text-slate-800">${ride.driver.fullName} (${ride.driver.licensePlate})</p>
          <p class="text-[11px] text-slate-500">${ride.driver.isUniversityVerified ? 'University Verified Operator' : 'Transport Team'}</p>
        </div>
        <span class="text-emerald-700 font-bold flex items-center">
          ${Icons.ShieldCheck("w-3.5 h-3.5 mr-1")}
          Verified
        </span>
      </div>

    </div>
  `;

  const modal = openModal({
    title: "Confirm Campus Ride Reservation",
    contentHtml,
    size: "md",
    actions: [
      {
        label: "Cancel",
        variant: "outline",
        onClick: () => true
      },
      {
        label: hasSufficientBalance ? `Pay ₹${totalAmount.toFixed(2)} & Confirm` : "Top Up Pass First",
        variant: hasSufficientBalance ? (ride.isWomenOnly ? "primary" : "primary") : "secondary",
        onClick: async () => {
          if (!hasSufficientBalance) {
            showToast({
              message: "Please top up your Campus Pass balance first.",
              type: "warning"
            });
            return false;
          }

          try {
            const booking = await rideService.createBooking({
              ride,
              seatCount,
              isWomenOnly: ride.isWomenOnly
            });

            showToast({
              message: `Ride booked successfully! Reference: ${booking.bookingId}`,
              type: "success"
            });

            onBookingSuccess(booking);
            return true;
          } catch (err) {
            showToast({
              message: err.message || "Failed to confirm booking",
              type: "error"
            });
            return false;
          }
        }
      }
    ]
  });

  return modal;
}
