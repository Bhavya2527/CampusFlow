/**
 * CampusFlow Shared Component: Application Header & Navbar
 * Created by: Member 1 (Design Systems Lead)
 */

import { Icons } from './Icons.js';
import { showToast } from './Toast.js';

export function Header({
  studentProfile = {},
  onTopUpClick = () => {},
  onEmergencyClick = () => {}
}) {
  const header = document.createElement("header");
  header.className = "sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 shadow-xs";

  header.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <!-- Left: Brand & University Identity -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
            ${Icons.Car("w-6 h-6 text-white")}
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-lg font-bold text-slate-900 tracking-tight">Campus<span class="text-emerald-600">Flow</span></span>
              <span class="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded-md">Ride Booking</span>
            </div>
            <p class="text-xs text-slate-500 hidden sm:block">Official University Transit Network</p>
          </div>
        </div>

        <!-- Center: Quick Network Live Status -->
        <div class="hidden md:flex items-center space-x-4 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60 text-xs">
          <span class="flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="font-medium text-slate-700">14 Active EV Shuttles</span>
          <span class="text-slate-300">|</span>
          <span class="text-slate-600">Avg Wait: <strong class="text-slate-900 font-semibold">4 mins</strong></span>
        </div>

        <!-- Right: Student Account & SafeRide SOS -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <!-- SOS Safety Hotline -->
          <button id="cf-sos-btn" class="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl transition-all cursor-pointer">
            ${Icons.Shield("w-3.5 h-3.5 text-pink-600")}
            <span class="hidden xs:inline">SafeRide SOS</span>
          </button>

          <!-- Campus Pass Balance Pill -->
          <div id="cf-wallet-pill" class="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs font-semibold text-emerald-800 cursor-pointer hover:bg-emerald-100 transition-colors" title="Click to view Campus Pass">
            ${Icons.Zap("w-3.5 h-3.5 text-emerald-600")}
            <span>₹<span id="header-wallet-balance">${studentProfile.campusPassBalance ? studentProfile.campusPassBalance.toFixed(2) : "450.00"}</span></span>
          </div>

          <!-- Student Profile Avatar -->
          <div class="flex items-center space-x-2 pl-1 sm:pl-2">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              ${studentProfile.name ? studentProfile.name.split(" ").map(n => n[0]).join("") : "AC"}
            </div>
            <div class="hidden lg:block text-left">
              <p class="text-xs font-bold text-slate-800 leading-none">${studentProfile.name || "Alex Chen"}</p>
              <p class="text-[10px] text-slate-500 leading-tight mt-0.5">${studentProfile.studentId || "U2023-CS-0492"}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;

  // Attach event listeners
  header.querySelector("#cf-sos-btn").addEventListener("click", () => {
    onEmergencyClick();
  });

  header.querySelector("#cf-wallet-pill").addEventListener("click", () => {
    onTopUpClick();
  });

  return header;
}
