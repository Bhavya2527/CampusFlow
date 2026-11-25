/**
 * CampusFlow Student Experience Application
 * Lead Developer: Member 2 (Student Ride Booking Experience)
 * 
 * Orchestrates shared UI components from Member 1,
 * backend API contract layer from Member 3,
 * and the student ride booking experience.
 */

import { Header } from './components/shared/Header.js';
import { StudentDashboard } from './modules/booking/StudentDashboard.js';
import { rideService } from './api/rideService.js';
import { showToast } from './components/shared/Toast.js';

class CampusFlowApp {
  constructor() {
    this.headerMount = document.getElementById("header-root");
    this.dashboardMount = document.getElementById("dashboard-root");
    this.dashboardInstance = null;
  }

  async init() {
    try {
      const student = rideService.getStudentProfile();

      // 1. Mount Header (Shared component by Member 1)
      if (this.headerMount) {
        const headerComp = Header({
          studentProfile: student,
          onTopUpClick: () => {
            if (this.dashboardInstance) {
              this.dashboardInstance.openTopUpModal();
            }
          },
          onEmergencyClick: () => {
            if (this.dashboardInstance) {
              this.dashboardInstance.openEmergencySOSModal();
            }
          }
        });
        this.headerMount.appendChild(headerComp);
      }

      // 2. Initialize Student Dashboard (Member 2 deliverable)
      this.dashboardInstance = new StudentDashboard({ containerId: "dashboard-root" });
      await this.dashboardInstance.init();

      console.log("🚀 CampusFlow Student Ride Booking App initialized successfully!");
    } catch (err) {
      console.error("Failed to initialize CampusFlow App:", err);
      showToast({
        message: "Failed to initialize transit services. Please check network.",
        type: "error"
      });
    }
  }
}

// Bootstrap application on DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    const app = new CampusFlowApp();
    app.init();
  });
} else {
  const app = new CampusFlowApp();
  app.init();
}
