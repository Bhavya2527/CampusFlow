/**
 * CampusFlow Student Dashboard Module
 * Responsibility: Member 2 (Student Ride Booking Experience)
 * 
 * Requirement 1: Student dashboard
 * Features:
 * - Personalized student welcome & academic identity
 * - Live transit metrics (Active Bookings, CO2 Saved, Trips, Campus Pass balance)
 * - Quick Top-Up dialog for campus pass
 * - Route advisory ticker
 * - Orchestrates Ride Search, Demand Preview, Available Ride Cards, and My Bookings
 */

import { Icons } from '../../components/shared/Icons.js';
import { Badge } from '../../components/shared/Badge.js';
import { Button } from '../../components/shared/Button.js';
import { Tabs } from '../../components/shared/Tabs.js';
import { openModal } from '../../components/shared/Modal.js';
import { showToast } from '../../components/shared/Toast.js';
import { rideService } from '../../api/rideService.js';
import { RideSearch } from './RideSearch.js';
import { RideCard } from './RideCard.js';
import { RouteDemandPreview } from './RouteDemandPreview.js';
import { MyBookings } from './MyBookings.js';
import { openBookingConfirmModal } from './BookingConfirmModal.js';
import { openDriverDetailsModal } from './DriverDetailsModal.js';

export class StudentDashboard {
  constructor({ containerId = "dashboard-root" }) {
    this.container = document.getElementById(containerId);
    this.activeTab = "book"; // 'book' | 'my-bookings' | 'demand-insights'
    this.searchParams = {
      pickupId: "loc_north_gate",
      destinationId: "loc_metro_blue",
      departureDate: new Date().toISOString().split('T')[0],
      timeSlotCategory: "ALL",
      isWomenOnly: false,
      vehicleType: "ALL"
    };
    this.locations = [];
    this.availableRides = [];
    this.currentDemand = null;
    this.isLoadingRides = false;
    this.bookingsFilter = "UPCOMING";
  }

  async init() {
    this.locations = await rideService.getLocations();
    await this.fetchDemandAndRides();
    this.render();
  }

  async fetchDemandAndRides() {
    this.isLoadingRides = true;
    try {
      // 1. Fetch Route Demand Preview (Requirement 5)
      this.currentDemand = await rideService.getRouteDemand(
        this.searchParams.pickupId,
        this.searchParams.destinationId,
        this.searchParams.departureDate
      );

      // 2. Search Available Rides (Requirements 3, 4, 6, 7, 8)
      this.availableRides = await rideService.searchRides(this.searchParams);
    } catch (err) {
      console.error("Error fetching rides:", err);
      showToast({ message: "Failed to load rides. Please retry.", type: "error" });
    } finally {
      this.isLoadingRides = false;
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = "";

    const student = rideService.getStudentProfile();
    const myBookings = rideService.getMyBookings();
    const upcomingCount = myBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'IN_TRANSIT').length;

    const wrapper = document.createElement("div");
    wrapper.className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6";

    // 1. Personalized Student Hero Banner & Live Stats (Requirement 1)
    const heroBanner = this._createHeroBanner(student, upcomingCount);
    wrapper.appendChild(heroBanner);

    // 2. Navigation Tabs
    const tabsContainer = document.createElement("div");
    tabsContainer.className = "flex items-center justify-between";
    const tabsComp = Tabs({
      tabs: [
        { id: "book", label: "Book a Ride", icon: Icons.Search("w-4 h-4"), badge: null },
        { id: "my-bookings", label: "My Bookings", icon: Icons.Ticket("w-4 h-4"), badge: upcomingCount > 0 ? upcomingCount : null },
        { id: "demand-insights", label: "Route Demand Insights", icon: Icons.TrendingUp("w-4 h-4"), badge: null }
      ],
      activeTab: this.activeTab,
      onChange: (tabId) => {
        this.activeTab = tabId;
        this.render();
      }
    });
    tabsContainer.appendChild(tabsComp);
    wrapper.appendChild(tabsContainer);

    // 3. Tab Content View
    const contentArea = document.createElement("div");
    contentArea.className = "space-y-6";

    if (this.activeTab === "book") {
      this._renderBookTab(contentArea);
    } else if (this.activeTab === "my-bookings") {
      this._renderMyBookingsTab(contentArea, myBookings);
    } else if (this.activeTab === "demand-insights") {
      this._renderDemandInsightsTab(contentArea);
    }

    wrapper.appendChild(contentArea);
    this.container.appendChild(wrapper);
  }

  _createHeroBanner(student, upcomingCount) {
    const banner = document.createElement("div");
    banner.className = "relative rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-md overflow-hidden";

    banner.innerHTML = `
      <!-- Background Ambient Glow -->
      <div class="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        <!-- Left: Student Welcome Info -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              ${Icons.ShieldCheck("w-3 h-3 mr-1 text-emerald-300")}
              Verified Campus Student
            </span>
            <span class="text-xs text-slate-300">${student.department}</span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, <span class="text-emerald-300">${student.name}</span>! 👋
          </h1>
          <p class="text-xs sm:text-sm text-slate-300 max-w-xl">
            Book certified campus EV shuttles, reserved safe vans, and transit corridors across university hubs.
          </p>

          <!-- Route Live Advisory Ticker -->
          <div class="inline-flex items-center space-x-2 text-xs bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10 text-slate-200 mt-2">
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span><strong>Campus Transit Alert:</strong> All 14 green corridors running on schedule with 0 delays.</span>
          </div>
        </div>

        <!-- Right: 4 Dashboard Stats Cards (Requirement 1) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          
          <!-- Stat 1: Active Bookings -->
          <div class="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center space-y-0.5">
            <div class="text-[10px] uppercase font-bold tracking-wider text-slate-300">Active Rides</div>
            <div class="text-xl font-extrabold text-white">${upcomingCount}</div>
            <div class="text-[10px] text-emerald-300 font-semibold">${upcomingCount > 0 ? 'Upcoming' : 'None active'}</div>
          </div>

          <!-- Stat 2: CO2 Saved -->
          <div class="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center space-y-0.5">
            <div class="text-[10px] uppercase font-bold tracking-wider text-slate-300">CO2 Saved</div>
            <div class="text-xl font-extrabold text-emerald-300">${student.carbonSavedKg.toFixed(1)} <span class="text-xs font-normal">kg</span></div>
            <div class="text-[10px] text-slate-300 font-medium">Eco Campus Impact</div>
          </div>

          <!-- Stat 3: Semester Rides -->
          <div class="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center space-y-0.5">
            <div class="text-[10px] uppercase font-bold tracking-wider text-slate-300">Semester Trips</div>
            <div class="text-xl font-extrabold text-white">${student.ridesCompletedThisSemester}</div>
            <div class="text-[10px] text-slate-300 font-medium">Class of '27</div>
          </div>

          <!-- Stat 4: Campus Pass Balance with Top-Up -->
          <div class="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center space-y-0.5 relative group">
            <div class="text-[10px] uppercase font-bold tracking-wider text-slate-300">Campus Pass</div>
            <div class="text-xl font-extrabold text-amber-300 leading-tight">₹${student.campusPassBalance.toFixed(2)}</div>
            <button type="button" id="hero-topup-btn" class="mt-1 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-2 py-0.5 rounded-md cursor-pointer transition-colors">
              + Top Up
            </button>
          </div>

        </div>

      </div>
    `;

    banner.querySelector("#hero-topup-btn").addEventListener("click", () => {
      this.openTopUpModal();
    });

    return banner;
  }

  _renderBookTab(parent) {
    // 1. Search Box Component (Requirements 2, 3, 6, 7, 8)
    const searchSection = RideSearch({
      locations: this.locations,
      searchParams: this.searchParams,
      onSearchChange: async (updates) => {
        Object.assign(this.searchParams, updates);
        await this.fetchDemandAndRides();
        this.render();
      },
      onSubmit: async () => {
        await this.fetchDemandAndRides();
        this.render();
        showToast({
          message: `Found ${this.availableRides.length} available rides for your corridor`,
          type: "info"
        });
      }
    });
    parent.appendChild(searchSection);

    // 2. Route Demand Preview (Requirement 5)
    if (this.currentDemand) {
      const demandMount = document.createElement("div");
      demandMount.innerHTML = RouteDemandPreview(this.currentDemand);
      parent.appendChild(demandMount);
    }

    // 3. Available Rides Heading & Cards List (Requirement 4)
    const resultsHeader = document.createElement("div");
    resultsHeader.className = "flex items-center justify-between pt-2";
    resultsHeader.innerHTML = `
      <div>
        <h3 class="text-base font-bold text-slate-900">Available Campus Rides</h3>
        <p class="text-xs text-slate-500">Live seat availability and real-time dynamically computed fares</p>
      </div>
      <span class="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
        ${this.availableRides.length} ride${this.availableRides.length !== 1 ? 's' : ''} available
      </span>
    `;
    parent.appendChild(resultsHeader);

    if (this.isLoadingRides) {
      const loadingEl = document.createElement("div");
      loadingEl.className = "p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200";
      loadingEl.innerHTML = `
        <div class="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p class="text-sm font-semibold">Calculating dynamic fares and verifying seat inventory...</p>
      `;
      parent.appendChild(loadingEl);
      return;
    }

    if (this.availableRides.length === 0) {
      const emptyEl = document.createElement("div");
      emptyEl.className = "p-10 text-center bg-white rounded-3xl border border-slate-200 space-y-3";
      emptyEl.innerHTML = `
        <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
          ${Icons.Car("w-6 h-6")}
        </div>
        <h4 class="text-base font-bold text-slate-800">No rides match your filter criteria</h4>
        <p class="text-xs text-slate-500 max-w-sm mx-auto">
          Try expanding your departure time window or selecting "All Fleet" in vehicle preference.
        </p>
      `;
      parent.appendChild(emptyEl);
      return;
    }

    // Render Ride Cards (All 9 required fields)
    const ridesGrid = document.createElement("div");
    ridesGrid.className = "space-y-4";

    this.availableRides.forEach(ride => {
      const cardEl = RideCard({
        ride,
        onBookClick: (selectedRide, seatCount) => {
          openBookingConfirmModal({
            ride: selectedRide,
            seatCount,
            onBookingSuccess: async () => {
              await this.fetchDemandAndRides();
              this.activeTab = "my-bookings";
              this.render();
            }
          });
        },
        onDriverTeaserClick: (driver, currentRide) => {
          openDriverDetailsModal({ booking: currentRide, driver });
        }
      });
      ridesGrid.appendChild(cardEl);
    });

    parent.appendChild(ridesGrid);
  }

  _renderMyBookingsTab(parent, bookings) {
    const myBookingsComp = MyBookings({
      bookings,
      activeFilter: this.bookingsFilter,
      onFilterChange: (filter) => {
        this.bookingsFilter = filter;
        this.render();
      },
      onBookingUpdate: async () => {
        await this.fetchDemandAndRides();
        this.render();
      }
    });
    parent.appendChild(myBookingsComp);
  }

  _renderDemandInsightsTab(parent) {
    const insights = document.createElement("div");
    insights.className = "space-y-4";

    insights.innerHTML = `
      <div class="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
        <div>
          <h3 class="text-lg font-bold text-slate-900">Campus Corridor Demand Analytics</h3>
          <p class="text-xs text-slate-500">Live demand tracking across all university academic blocks, dormitories, and metro links</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
            <span class="text-emerald-800 font-bold uppercase text-[10px]">Optimal Commute Times</span>
            <p class="text-emerald-950 font-bold text-sm">10:00 AM - 12:00 PM</p>
            <p class="text-emerald-700">Lowest demand and guaranteed seats across all EV shuttle routes.</p>
          </div>

          <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
            <span class="text-amber-800 font-bold uppercase text-[10px]">Peak Surge Hours</span>
            <p class="text-amber-950 font-bold text-sm">08:00 - 09:30 AM & 05:00 - 06:45 PM</p>
            <p class="text-amber-700">High rush due to lectures. Advance booking recommended 24h prior.</p>
          </div>

          <div class="p-4 bg-pink-50 rounded-2xl border border-pink-200 space-y-1">
            <span class="text-pink-800 font-bold uppercase text-[10px]">Women SafeRide+ Network</span>
            <p class="text-pink-950 font-bold text-sm">24/7 Guaranteed Escort</p>
            <p class="text-pink-700">Certified female operators stationed at Main Gates, Library, & Grad Housing.</p>
          </div>
        </div>
      </div>
    `;

    if (this.currentDemand) {
      const liveMount = document.createElement("div");
      liveMount.innerHTML = RouteDemandPreview(this.currentDemand);
      insights.appendChild(liveMount);
    }

    parent.appendChild(insights);
  }

  openTopUpModal() {
    const student = rideService.getStudentProfile();
    const contentHtml = `
      <div class="space-y-4 text-xs">
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
          <span class="text-slate-400 text-[10px] uppercase font-bold">Current Pass Balance</span>
          <div class="text-2xl font-extrabold text-emerald-700 font-mono">₹${student.campusPassBalance.toFixed(2)}</div>
          <p class="text-slate-500">Student ID: ${student.studentId} • ${student.name}</p>
        </div>

        <div class="space-y-1.5">
          <label class="block font-bold text-slate-700 uppercase text-[11px]">Select Top-Up Amount</label>
          <div class="grid grid-cols-3 gap-2" id="topup-amount-chips">
            <button type="button" data-amt="100" class="topup-chip py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 text-center transition-all cursor-pointer">₹100</button>
            <button type="button" data-amt="250" class="topup-chip py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 text-center transition-all cursor-pointer">₹250</button>
            <button type="button" data-amt="500" class="topup-chip py-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 font-bold text-emerald-800 text-center transition-all cursor-pointer">₹500</button>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="block font-bold text-slate-700 uppercase text-[11px]">Payment Method</label>
          <div class="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-lg">🏦</span>
              <div>
                <p class="font-bold text-slate-800">University Student Account UPI</p>
                <p class="text-[10px] text-slate-500">Direct link to student ID card wallet</p>
              </div>
            </div>
            <span class="text-emerald-600 font-bold">Primary</span>
          </div>
        </div>
      </div>
    `;

    let selectedAmt = 500;

    const modal = openModal({
      title: "Top Up Campus Pass Balance",
      contentHtml,
      size: "sm",
      actions: [
        { label: "Cancel", variant: "outline", onClick: () => true },
        {
          label: "Confirm Recharge",
          variant: "primary",
          onClick: () => {
            const updated = rideService.updateStudentProfile({
              campusPassBalance: student.campusPassBalance + selectedAmt
            });
            showToast({
              message: `Recharged ₹${selectedAmt} successfully! New Balance: ₹${updated.campusPassBalance.toFixed(2)}`,
              type: "success"
            });
            this.render();
            // Update header wallet pill if present
            const headerBal = document.getElementById("header-wallet-balance");
            if (headerBal) headerBal.textContent = updated.campusPassBalance.toFixed(2);
            return true;
          }
        }
      ]
    });

    modal.element.querySelectorAll(".topup-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        modal.element.querySelectorAll(".topup-chip").forEach(c => {
          c.className = "topup-chip py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 text-center transition-all cursor-pointer";
        });
        chip.className = "topup-chip py-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 font-bold text-emerald-800 text-center transition-all cursor-pointer";
        selectedAmt = Number(chip.getAttribute("data-amt"));
      });
    });
  }

  openEmergencySOSModal() {
    openModal({
      title: "Campus SafeRide+ Emergency SOS",
      size: "sm",
      contentHtml: `
        <div class="space-y-3 text-xs">
          <div class="p-4 bg-pink-50 border border-pink-200 rounded-2xl text-pink-900 space-y-1">
            <h4 class="font-bold flex items-center space-x-1">
              ${Icons.Shield("w-4 h-4 text-pink-600")}
              <span>Priority Student Protection Active</span>
            </h4>
            <p class="text-[11px] text-pink-700">
              Your location coordinates and student ID are broadcast to campus security and the nearest SafeRide patrol vehicle.
            </p>
          </div>

          <div class="space-y-2 text-slate-700">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <p class="font-bold">Campus Security Dispatch</p>
                <p class="text-[10px] text-slate-500">24/7 Immediate Response</p>
              </div>
              <a href="tel:1800-CAMPUS-SAFE" class="px-3 py-1 bg-pink-600 text-white font-bold rounded-lg text-xs">Call 1800-SAFE</a>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <p class="font-bold">Women Student Safety Cell</p>
                <p class="text-[10px] text-slate-500">Dedicated Night Escort Service</p>
              </div>
              <a href="tel:+91-98765-SAFE" class="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs">Call Cell</a>
            </div>
          </div>
        </div>
      `,
      actions: [
        { label: "Dismiss", variant: "secondary", onClick: () => true }
      ]
    });
  }
}
