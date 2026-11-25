import React, { useEffect, useState } from 'react';
import {
  simulationEngine,
  SimulationSnapshot,
} from './simulation/deterministicEngine';
import { CampusMap } from './components/CampusMap';
import { SimulationControls } from './components/SimulationControls';
import { FleetSidebar } from './components/FleetSidebar';
import { DriverDashboardModal } from './components/DriverDashboardModal';
import { StudentDemandView } from './components/StudentDemandView';

export const App: React.FC = () => {
  const [snapshot, setSnapshot] = useState<SimulationSnapshot>(
    simulationEngine.getSnapshot()
  );
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [driverModalVehicleId, setDriverModalVehicleId] = useState<string | null>(null);
  const [showStudentView, setShowStudentView] = useState(false);

  // Subscribe to deterministic simulation engine state
  useEffect(() => {
    const unsubscribe = simulationEngine.subscribe((newSnapshot) => {
      setSnapshot(newSnapshot);
    });

    // High frequency deterministic tick (e.g. 50ms intervals = 20 fps)
    const tickIntervalMs = 50;
    const interval = setInterval(() => {
      simulationEngine.tick(tickIntervalMs / 1000);
    }, tickIntervalMs);

    // Keyboard shortcuts for stage demo
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        simulationEngine.togglePlayPause();
      } else if (e.key === 'r' || e.key === 'R') {
        simulationEngine.reset();
      } else if (e.key === '1') {
        simulationEngine.setSpeed(1);
      } else if (e.key === '2') {
        simulationEngine.setSpeed(2);
      } else if (e.key === '4') {
        simulationEngine.setSpeed(4);
      } else if (e.key === 'b' || e.key === 'B') {
        simulationEngine.toggleRoadBlock();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubscribe();
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const selectedVehicle = snapshot.vehicles.find((v) => v.id === driverModalVehicleId) || null;
  const isRoadBlocked = snapshot.roadSegments.some((r) => r.isBlocked);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Top Simulation Controls Bar */}
      <SimulationControls
        isRunning={snapshot.isRunning}
        isPaused={snapshot.isPaused}
        speedMultiplier={snapshot.speedMultiplier}
        simTime={snapshot.simTime}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left / Center: Interactive Fixed Campus Grid Map */}
        <main className="flex-1 relative overflow-hidden">
          <CampusMap
            vehicles={snapshot.vehicles}
            requests={snapshot.requests}
            roadSegments={snapshot.roadSegments}
            campusLocations={snapshot.campusLocations}
            recentEvents={snapshot.recentEvents}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
            selectedRequestId={selectedRequestId}
            onSelectRequest={setSelectedRequestId}
            isPaused={snapshot.isPaused}
            speedMultiplier={snapshot.speedMultiplier}
          />
        </main>

        {/* Right: Fleet & Ride Requests Sidebar */}
        <FleetSidebar
          vehicles={snapshot.vehicles}
          requests={snapshot.requests}
          events={snapshot.recentEvents}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={setSelectedVehicleId}
          selectedRequestId={selectedRequestId}
          onSelectRequest={setSelectedRequestId}
          onOpenDriverDashboard={(id) => setDriverModalVehicleId(id)}
          onOpenStudentView={() => setShowStudentView(true)}
        />
      </div>

      {/* Driver Dashboard In-Vehicle Terminal Modal (Optional Feature) */}
      {driverModalVehicleId && (
        <DriverDashboardModal
          vehicle={selectedVehicle}
          requests={snapshot.requests}
          isRoadBlocked={isRoadBlocked}
          onClose={() => setDriverModalVehicleId(null)}
        />
      )}

      {/* Student View Portal Modal (Optional Feature) */}
      {showStudentView && (
        <StudentDemandView
          locations={snapshot.campusLocations}
          onClose={() => setShowStudentView(false)}
        />
      )}
    </div>
  );
};

