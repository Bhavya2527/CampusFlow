/**
 * CampusFlow Ride Search Module
 * Responsibility: Member 2 (Student Ride Booking Experience)
 * 
 * Features:
 * - Pickup and Destination location selection
 * - Swap locations action
 * - Advance booking calendar
 * - Departure time window selection
 * - Women-only ride preference switch (SafeRide+)
 * - Vehicle type filter
 * - Quick campus corridor pills
 */

import { Icons } from '../../components/shared/Icons.js';
import { Select, ToggleSwitch } from '../../components/shared/Input.js';
import { AdvanceBookingCalendar } from './AdvanceBookingCalendar.js';
import { DepartureTimeSelector } from './DepartureTimeSelector.js';
import { Badge } from '../../components/shared/Badge.js';

export function RideSearch({
  locations = [],
  searchParams = {},
  onSearchChange = () => {},
  onSubmit = () => {}
}) {
  const container = document.createElement("div");
  container.className = "bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-5";

  // Location select options
  const locationOptions = locations.map(loc => ({
    value: loc.id,
    label: loc.name,
    sublabel: loc.zone
  }));

  container.innerHTML = `
    <!-- Search Form Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-slate-900 tracking-tight">Book Campus Ride</h2>
        <p class="text-xs text-slate-500">Scheduled campus shuttles, shared EV vans, and safe corridors</p>
      </div>
      <div class="hidden sm:flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
        ${Icons.Leaf("w-3.5 h-3.5 text-emerald-600")}
        <span>Zero Emission Fleet</span>
      </div>
    </div>

    <!-- Quick Route Shortcuts -->
    <div class="space-y-1.5">
      <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Popular Campus Corridors</span>
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" id="quick-routes-container">
        <button type="button" data-p="loc_north_gate" data-d="loc_metro_blue" class="quick-corridor-btn shrink-0 text-xs px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 rounded-lg border border-slate-200/70 font-medium text-slate-700 transition-all cursor-pointer">
          North Gate ↔ Metro Blue
        </button>
        <button type="button" data-p="loc_eng_hall" data-d="loc_central_library" class="quick-corridor-btn shrink-0 text-xs px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 rounded-lg border border-slate-200/70 font-medium text-slate-700 transition-all cursor-pointer">
          Engineering ↔ Library
        </button>
        <button type="button" data-p="loc_grad_housing" data-d="loc_science_block" class="quick-corridor-btn shrink-0 text-xs px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 rounded-lg border border-slate-200/70 font-medium text-slate-700 transition-all cursor-pointer">
          Grad Housing ↔ Science Block
        </button>
      </div>
    </div>

    <!-- Origin & Destination Inputs with Swap Button -->
    <div class="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center">
      <div id="pickup-select-mount"></div>
      
      <!-- Swap Button -->
      <div class="flex justify-center -my-1 md:my-0 md:mt-5">
        <button type="button" id="swap-locations-btn" class="p-2.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 transition-all shadow-xs cursor-pointer touch-target group" title="Swap Pickup and Drop">
          <span class="block transition-transform duration-300 group-hover:rotate-180">
            ${Icons.ArrowUpDown("w-4 h-4")}
          </span>
        </button>
      </div>

      <div id="dest-select-mount"></div>
    </div>

    <!-- Advance Booking Calendar Mount -->
    <div id="advance-calendar-mount"></div>

    <!-- Departure Time Selector Mount -->
    <div id="departure-time-mount"></div>

    <!-- Women-Only Preference & Vehicle Filter Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
      
      <!-- Women-Only Ride Preference (Requirement 8) -->
      <div id="women-only-toggle-mount"></div>

      <!-- Vehicle Type Filter -->
      <div class="space-y-1.5">
        <label class="block text-xs font-semibold text-slate-700 tracking-wide uppercase">Vehicle Preference</label>
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" id="vehicle-type-filter">
          <button type="button" data-vehicle="ALL" class="vehicle-filter-btn px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer touch-target ${searchParams.vehicleType === 'ALL' || !searchParams.vehicleType ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700'}">
            All Fleet
          </button>
          <button type="button" data-vehicle="EV Shuttle" class="vehicle-filter-btn px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer touch-target ${searchParams.vehicleType === 'EV Shuttle' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700'}">
            Campus EV Shuttle
          </button>
          <button type="button" data-vehicle="Eco-Van" class="vehicle-filter-btn px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer touch-target ${searchParams.vehicleType === 'Eco-Van' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700'}">
            Eco-Van 7
          </button>
          <button type="button" data-vehicle="Cruiser" class="vehicle-filter-btn px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer touch-target ${searchParams.vehicleType === 'Cruiser' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700'}">
            Rapid Cruiser
          </button>
        </div>
      </div>

    </div>

    <!-- Search Action Button -->
    <div class="pt-2">
      <button type="button" id="find-rides-submit-btn" class="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer touch-target text-base">
        ${Icons.Search("w-5 h-5")}
        <span>Search Available Rides</span>
      </button>
    </div>

  `;

  // Mount Pickup Select
  const pickupMount = container.querySelector("#pickup-select-mount");
  const pickupComp = Select({
    label: "Pickup Location",
    id: "pickup-location-select",
    options: locationOptions,
    value: searchParams.pickupId,
    placeholder: "Choose campus pickup point",
    icon: Icons.MapPin("w-4 h-4 text-emerald-600"),
    onChange: (val) => {
      onSearchChange({ pickupId: val });
    }
  });
  pickupMount.appendChild(pickupComp);

  // Mount Destination Select
  const destMount = container.querySelector("#dest-select-mount");
  const destComp = Select({
    label: "Destination",
    id: "dest-location-select",
    options: locationOptions,
    value: searchParams.destinationId,
    placeholder: "Choose campus destination",
    icon: Icons.MapPin("w-4 h-4 text-rose-500"),
    onChange: (val) => {
      onSearchChange({ destinationId: val });
    }
  });
  destMount.appendChild(destComp);

  // Mount Advance Calendar
  const calendarMount = container.querySelector("#advance-calendar-mount");
  const calendarComp = AdvanceBookingCalendar({
    selectedDate: searchParams.departureDate,
    onDateChange: (date) => {
      onSearchChange({ departureDate: date });
    }
  });
  calendarMount.appendChild(calendarComp);

  // Mount Departure Time Selector
  const timeMount = container.querySelector("#departure-time-mount");
  const timeComp = DepartureTimeSelector({
    selectedCategory: searchParams.timeSlotCategory || 'ALL',
    onChange: (cat) => {
      onSearchChange({ timeSlotCategory: cat });
    }
  });
  timeMount.appendChild(timeComp);

  // Mount Women-Only Preference Toggle
  const womenToggleMount = container.querySelector("#women-only-toggle-mount");
  const womenToggleComp = ToggleSwitch({
    id: "women-only-ride-toggle",
    label: "Women-Only SafeRide+",
    description: "Verified female drivers & women passengers only",
    checked: searchParams.isWomenOnly || false,
    variant: "pink",
    badge: Badge({
      type: "tag",
      value: "women-only",
      text: "Certified Safe",
      icon: Icons.ShieldCheck("w-3 h-3 text-pink-600")
    }),
    onChange: (isChecked) => {
      onSearchChange({ isWomenOnly: isChecked });
    }
  });
  womenToggleMount.appendChild(womenToggleComp);

  // Event: Swap Locations
  container.querySelector("#swap-locations-btn").addEventListener("click", () => {
    const tempP = searchParams.pickupId;
    const tempD = searchParams.destinationId;
    onSearchChange({
      pickupId: tempD,
      destinationId: tempP
    });
  });

  // Event: Quick Route Corridor selection
  container.querySelectorAll(".quick-corridor-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = btn.getAttribute("data-p");
      const d = btn.getAttribute("data-d");
      onSearchChange({
        pickupId: p,
        destinationId: d
      });
    });
  });

  // Event: Vehicle Filter Buttons
  container.querySelectorAll(".vehicle-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const vehicle = btn.getAttribute("data-vehicle");
      onSearchChange({ vehicleType: vehicle });
    });
  });

  // Event: Search Submit
  container.querySelector("#find-rides-submit-btn").addEventListener("click", () => {
    onSubmit();
  });

  return container;
}
