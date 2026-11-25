/**
 * CampusFlow Booking Cancellation Modal
 * Responsibility: Member 2 (Student Ride Booking Experience)
 * 
 * Requirement 10: Booking cancellation
 * Features:
 * - Clear cancellation policy
 * - Reason selection
 * - Dynamic refund calculation to Campus Pass wallet
 * - Atomically frees up seat availability on the ride
 */

import { openModal } from '../../components/shared/Modal.js';
import { Icons } from '../../components/shared/Icons.js';
import { rideService } from '../../api/rideService.js';
import { showToast } from '../../components/shared/Toast.js';

export function openCancellationModal({
  booking,
  onCancelled = () => {}
}) {
  const contentHtml = `
    <div class="space-y-4">
      
      <!-- Cancellation Alert Banner -->
      <div class="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-xs">
        ${Icons.AlertTriangle("w-5 h-5 text-rose-600 shrink-0 mt-0.5")}
        <div class="space-y-1 text-rose-900">
          <p class="font-bold">Are you sure you want to cancel this booking?</p>
          <p class="text-[11px] text-rose-700">
            Booking Reference: <strong class="font-mono">${booking.bookingId}</strong> for <strong>${booking.routeName}</strong>.
          </p>
        </div>
      </div>

      <!-- Free Cancellation Policy Guarantee -->
      <div class="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1">
        <div class="flex items-center space-x-1.5 text-emerald-900 font-bold">
          ${Icons.CheckCircle("w-4 h-4 text-emerald-600")}
          <span>CampusFlow Free Cancellation Policy</span>
        </div>
        <p class="text-[11px] text-emerald-800">
          Cancellations requested 30+ minutes prior to scheduled departure qualify for 100% instant refund credit back to your Campus Pass.
        </p>
      </div>

      <!-- Dynamic Refund Calculation Preview -->
      <div class="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 text-xs">
        <h5 class="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Refund Breakdown</h5>
        
        <div class="flex justify-between items-center text-slate-600">
          <span>Amount Paid (${booking.seatCount} seat${booking.seatCount > 1 ? 's' : ''})</span>
          <span class="font-semibold text-slate-800">₹${booking.totalFarePaid.toFixed(2)}</span>
        </div>

        <div class="flex justify-between items-center text-slate-600">
          <span>Campus Transit Cancellation Fee</span>
          <span class="text-emerald-600 font-bold">₹0.00 (Free)</span>
        </div>

        <div class="pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-900">
          <span>Instant Refund to Campus Pass</span>
          <span class="text-emerald-700 text-base">₹${booking.totalFarePaid.toFixed(2)}</span>
        </div>
      </div>

      <!-- Reason Selection -->
      <div class="space-y-1.5">
        <label for="cancel-reason-select" class="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          Reason for Cancellation
        </label>
        <select id="cancel-reason-select" class="w-full px-3.5 py-2.5 text-xs font-medium bg-white border border-slate-300 rounded-xl shadow-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
          <option value="Schedule change">Academic schedule changed</option>
          <option value="Lecture cancelled">Lecture / Lab cancelled by faculty</option>
          <option value="Alternate ride">Taking alternate transit / walking with friends</option>
          <option value="Booked by mistake">Booked incorrect time slot</option>
          <option value="Personal emergency">Personal or health emergency</option>
        </select>
      </div>

      <p class="text-[11px] text-slate-400 text-center">
        Releasing this seat helps other students who are currently waiting for this route.
      </p>

    </div>
  `;

  const modal = openModal({
    title: "Cancel Ride Booking",
    contentHtml,
    size: "md",
    actions: [
      {
        label: "Keep Booking",
        variant: "outline",
        onClick: () => true
      },
      {
        label: "Confirm Cancellation",
        variant: "danger",
        onClick: async () => {
          const select = modal.element.querySelector("#cancel-reason-select");
          const reason = select ? select.value : "Student cancelled";

          try {
            const updated = await rideService.cancelBooking(booking.bookingId, reason);
            showToast({
              message: `Booking ${booking.bookingId} cancelled. ₹${updated.refundAmount.toFixed(2)} refunded to your Campus Pass.`,
              type: "success"
            });
            onCancelled(updated);
            return true;
          } catch (err) {
            showToast({
              message: err.message || "Failed to cancel booking",
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
