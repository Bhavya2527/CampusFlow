/**
 * CampusFlow Confirmed Driver Details Modal
 * Responsibility: Member 2 (Student Ride Booking Experience)
 * 
 * Requirement 11: Confirmed driver details
 * Shows:
 * - Driver photo, full name, rating, total trips
 * - University Verification status
 * - Women-Only certification status
 * - Vehicle make, model, color, license plate
 * - Live shuttle location & estimated pickup ETA
 * - Boarding security OTP
 * - Driver contact & University Emergency dispatch
 */

import { openModal } from '../../components/shared/Modal.js';
import { Icons } from '../../components/shared/Icons.js';
import { showToast } from '../../components/shared/Toast.js';

export function openDriverDetailsModal({
  booking,
  driver = null
}) {
  const drv = driver || booking.driver;
  if (!drv) {
    showToast({ message: "Driver details not assigned yet.", type: "warning" });
    return;
  }

  const liveEta = Math.floor(4 + Math.random() * 4);
  const boardingOtp = booking?.boardingOtp || "5912";

  const contentHtml = `
    <div class="space-y-4">
      
      <!-- Top Driver Card -->
      <div class="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
        <div class="relative">
          <img 
            src="${drv.avatarUrl}" 
            alt="${drv.fullName}" 
            class="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
          />
          <div class="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-xs" title="University Verified">
            ${Icons.ShieldCheck("w-3.5 h-3.5")}
          </div>
        </div>

        <div class="space-y-1 flex-1">
          <div class="flex items-center justify-between">
            <h4 class="text-base font-bold text-slate-900">${drv.fullName}</h4>
            <div class="flex items-center text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              ${Icons.Star("w-3.5 h-3.5 mr-1")}
              <span>${drv.rating.toFixed(2)}</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-1 text-[11px]">
            <span class="text-emerald-700 bg-emerald-100/70 font-semibold px-2 py-0.5 rounded">
              Verified Campus Staff
            </span>
            ${drv.isWomenCertified ? `
              <span class="text-pink-700 bg-pink-100/80 font-semibold px-2 py-0.5 rounded">
                Women-Certified SafeRide
              </span>
            ` : ''}
          </div>

          <p class="text-xs text-slate-500">${drv.totalTrips.toLocaleString()} successful student trips</p>
        </div>
      </div>

      <!-- Live Shuttle ETA & Location Tracking -->
      <div class="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-2">
        <div class="flex items-center justify-between text-xs font-bold text-emerald-900">
          <span class="flex items-center space-x-1.5">
            <span class="flex h-2.5 w-2.5 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Live Shuttle Status</span>
          </span>
          <span class="text-emerald-800 font-extrabold text-sm">Arriving in ${liveEta} mins</span>
        </div>
        <p class="text-xs text-emerald-800">
          📍 Approaching Academic North Roundabout (400m from pickup stop)
        </p>
      </div>

      <!-- Security Boarding OTP Box -->
      <div class="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-sm">
        <div>
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Boarding Security PIN</div>
          <div class="text-2xl font-black tracking-widest text-emerald-400">${boardingOtp}</div>
          <p class="text-[10px] text-slate-400">Share this code with your driver before boarding</p>
        </div>
        <div class="p-3 bg-slate-800 rounded-xl text-center">
          <div class="text-[10px] font-semibold text-slate-400 uppercase">Boarding Status</div>
          <div class="text-xs font-bold text-emerald-400 mt-0.5">READY FOR PICKUP</div>
        </div>
      </div>

      <!-- Vehicle Specifications -->
      <div class="p-4 bg-white rounded-2xl border border-slate-200 space-y-2.5 text-xs">
        <h5 class="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Vehicle Information</h5>
        
        <div class="grid grid-cols-2 gap-2 text-slate-600">
          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span class="text-slate-400 text-[10px] block uppercase font-bold">Vehicle Model</span>
            <span class="font-bold text-slate-800 text-xs">${drv.vehicleMake}</span>
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span class="text-slate-400 text-[10px] block uppercase font-bold">License Plate</span>
            <span class="font-bold text-slate-900 text-xs font-mono tracking-wider">${drv.licensePlate}</span>
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span class="text-slate-400 text-[10px] block uppercase font-bold">Exterior Color</span>
            <span class="font-bold text-slate-800 text-xs">${drv.vehicleColor}</span>
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span class="text-slate-400 text-[10px] block uppercase font-bold">Campus Fleet ID</span>
            <span class="font-bold text-slate-800 text-xs">CF-TRANSIT-${drv.id.slice(-4).toUpperCase()}</span>
          </div>
        </div>
      </div>

      <!-- Contact Actions -->
      <div class="grid grid-cols-2 gap-3 pt-1">
        <button type="button" id="call-driver-btn" class="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer touch-target">
          ${Icons.Phone("w-4 h-4 text-emerald-600")}
          <span>Call Driver</span>
        </button>

        <button type="button" id="sos-dispatch-btn" class="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-pink-200 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs transition-colors cursor-pointer touch-target">
          ${Icons.Shield("w-4 h-4 text-pink-600")}
          <span>Safety SOS</span>
        </button>
      </div>

    </div>
  `;

  const modal = openModal({
    title: "Confirmed Driver & Shuttle Details",
    contentHtml,
    size: "md",
    actions: [
      {
        label: "Done",
        variant: "primary",
        onClick: () => true
      }
    ]
  });

  // Call Driver Simulated Event
  modal.element.querySelector("#call-driver-btn").addEventListener("click", () => {
    showToast({
      message: `Connecting to ${drv.fullName} at ${drv.phone}... (Secure campus transit relay)`,
      type: "info"
    });
  });

  // Safety SOS Simulated Event
  modal.element.querySelector("#sos-dispatch-btn").addEventListener("click", () => {
    showToast({
      message: `Campus Security & Women SafeRide hotline notified. Priority response dispatched.`,
      type: "warning"
    });
  });

  return modal;
}
