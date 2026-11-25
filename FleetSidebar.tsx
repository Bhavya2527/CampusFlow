import React, { useState } from 'react';
import {
  Vehicle,
  RideRequest,
  SimulationEvent,
} from '@shared/types';
import {
  Bus,
  Users,
  Navigation,
  Clock,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ChevronRight,
  BatteryCharging,
  Gauge,
  Radio,
  UserCheck,
  Ban,
  ArrowUpRight,
} from 'lucide-react';

interface FleetSidebarProps {
  vehicles: Vehicle[];
  requests: RideRequest[];
  events: SimulationEvent[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string | null) => void;
  selectedRequestId: string | null;
  onSelectRequest: (id: string | null) => void;
  onOpenDriverDashboard: (vehicleId: string) => void;
  onOpenStudentView: () => void;
}

export const FleetSidebar: React.FC<FleetSidebarProps> = ({
  vehicles,
  requests,
  events,
  selectedVehicleId,
  onSelectVehicle,
  selectedRequestId,
  onSelectRequest,
  onOpenDriverDashboard,
  onOpenStudentView,
}) => {
  const [activeTab, setActiveTab] = useState<'fleet' | 'requests' | 'events'>('fleet');
  const [requestFilter, setRequestFilter] = useState<'all' | 'rejected' | 'cancelled' | 'active'>('all');

  const activeRequests = requests.filter(
    (r) => r.status === 'assigned' || r.status === 'picked_up' || r.status === 'pending'
  );
  const rejectedRequests = requests.filter((r) => r.status === 'rejected');
  const cancelledRequests = requests.filter((r) => r.status === 'cancelled');

  const filteredRequests = requests.filter((r) => {
    if (requestFilter === 'rejected') return r.status === 'rejected';
    if (requestFilter === 'cancelled') return r.status === 'cancelled';
    if (requestFilter === 'active')
      return r.status === 'assigned' || r.status === 'picked_up' || r.status === 'pending';
    return true;
  });

  return (
    <aside className="w-96 flex-shrink-0 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-hidden select-none">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 p-1">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex-1 py-2 rounded-md text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
            activeTab === 'fleet'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Bus className="w-3.5 h-3.5" />
          <span>Fleet ({vehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-2 rounded-md text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
            activeTab === 'requests'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Requests ({requests.length})</span>
          {rejectedRequests.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-2 rounded-md text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
            activeTab === 'events'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Live Feed</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* TAB 1: FLEET VIEW */}
        {activeTab === 'fleet' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Active Shuttles ({vehicles.length})</span>
              <span className="text-[11px] text-emerald-400 font-medium">All GPS Connected</span>
            </div>

            {vehicles.map((veh) => {
              const isSelected = veh.id === selectedVehicleId;
              const occupancyPct = Math.round((veh.seatsOccupied / veh.capacity) * 100);

              let badgeBorder = 'border-blue-500/40 bg-blue-950/20';
              let accentColor = 'text-blue-400';
              if (veh.id === 'veh_s2') {
                badgeBorder = 'border-emerald-500/40 bg-emerald-950/20';
                accentColor = 'text-emerald-400';
              } else if (veh.id === 'veh_s3') {
                badgeBorder = 'border-amber-500/40 bg-amber-950/20';
                accentColor = 'text-amber-400';
              }

              return (
                <div
                  key={veh.id}
                  onClick={() => onSelectVehicle(isSelected ? null : veh.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-slate-800/90 shadow-lg ring-1 ring-blue-500/50'
                      : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Vehicle Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold text-sm text-slate-100`}>{veh.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                          {veh.plateNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span className="capitalize text-emerald-400 font-semibold flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>{veh.status}</span>
                        </span>
                        <span>•</span>
                        <span className="font-mono">{veh.speedKmh || 22} km/h</span>
                        <span>•</span>
                        <span className="flex items-center space-x-0.5 text-slate-300">
                          <BatteryCharging className="w-3 h-3 text-emerald-400" />
                          <span>{veh.batteryPercent || 85}%</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDriverDashboard(veh.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-blue-600 text-slate-300 hover:text-white transition text-[10px] font-bold flex items-center space-x-1"
                      title="Open Driver In-Vehicle Terminal"
                    >
                      <span>Driver View</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Mandatory Requirement: Seats Occupied & Seats Remaining */}
                  <div className="mt-3 p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-300 font-medium">Capacity Status:</span>
                      </div>
                      <span className="font-mono font-bold text-xs">
                        <span className="text-emerald-400">{veh.seatsOccupied} occupied</span>
                        <span className="text-slate-500"> / </span>
                        <span className="text-cyan-400">{veh.seatsRemaining} remaining</span>
                      </span>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          occupancyPct > 80
                            ? 'bg-red-500'
                            : occupancyPct > 50
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Mandatory Requirement: Next Stop & ETA */}
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-slate-950/50 border border-slate-800/60">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide flex items-center space-x-1">
                        <Navigation className="w-3 h-3 text-blue-400" />
                        <span>Next Stop</span>
                      </div>
                      <div className="font-bold text-slate-200 mt-0.5 truncate text-[11px]" title={veh.nextStop}>
                        {veh.nextStop}
                      </div>
                    </div>

                    <div className="p-2 rounded bg-slate-950/50 border border-slate-800/60">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>ETA</span>
                      </div>
                      <div className="font-bold font-mono text-amber-300 mt-0.5 text-xs">
                        {veh.eta}
                      </div>
                    </div>
                  </div>

                  {/* Route Waypoint strip */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                    <span className="text-slate-500">Route: </span>
                    {veh.route.map((w, i) => (
                      <span
                        key={i}
                        className={`${
                          i === veh.currentWaypointIndex
                            ? 'text-yellow-400 font-bold underline'
                            : 'text-slate-400'
                        }`}
                      >
                        {w.name.split('(')[0].trim()}
                        {i < veh.route.length - 1 ? ' → ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Quick Action: Student Demand View */}
            <div className="pt-2">
              <button
                onClick={onOpenStudentView}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-900/60 to-indigo-900/60 hover:from-blue-800 hover:to-indigo-800 border border-blue-700/60 text-white font-bold text-xs flex items-center justify-between transition shadow-md"
              >
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>Student View: Check Nearby Demand</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: RIDE REQUESTS (Active, Cancelled, Rejected with Reasons) */}
        {activeTab === 'requests' && (
          <div className="space-y-3">
            {/* Filter pills */}
            <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setRequestFilter('all')}
                className={`flex-1 py-1 rounded font-semibold transition ${
                  requestFilter === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({requests.length})
              </button>
              <button
                onClick={() => setRequestFilter('rejected')}
                className={`flex-1 py-1 rounded font-semibold transition ${
                  requestFilter === 'rejected'
                    ? 'bg-amber-900/80 text-amber-200'
                    : 'text-amber-400 hover:text-amber-200'
                }`}
              >
                Rejected ({rejectedRequests.length})
              </button>
              <button
                onClick={() => setRequestFilter('cancelled')}
                className={`flex-1 py-1 rounded font-semibold transition ${
                  requestFilter === 'cancelled'
                    ? 'bg-red-900/80 text-red-200'
                    : 'text-red-400 hover:text-red-200'
                }`}
              >
                Cancelled ({cancelledRequests.length})
              </button>
            </div>

            {/* Requests List */}
            <div className="space-y-2.5">
              {filteredRequests.map((req) => {
                const isSelected = req.id === selectedRequestId;
                const isRejected = req.status === 'rejected';
                const isCancelled = req.status === 'cancelled';
                const isPickedUp = req.status === 'picked_up';

                return (
                  <div
                    key={req.id}
                    onClick={() => onSelectRequest(isSelected ? null : req.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isRejected
                        ? 'border-amber-800/80 bg-amber-950/20'
                        : isCancelled
                        ? 'border-red-800/80 bg-red-950/20'
                        : isSelected
                        ? 'border-cyan-500 bg-slate-800/90 shadow'
                        : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-xs text-slate-100 flex items-center space-x-1.5">
                        <span>👤</span>
                        <span>{req.passengerName}</span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isRejected
                            ? 'bg-amber-900/80 text-amber-300 border border-amber-700'
                            : isCancelled
                            ? 'bg-red-900/80 text-red-300 border border-red-700'
                            : isPickedUp
                            ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                            : 'bg-blue-900/80 text-blue-300 border border-blue-700'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    {/* Mandatory Requirement: Rejection reasons displayed next to the request */}
                    {isRejected && (
                      <div className="mt-2 p-2 rounded-lg bg-amber-950/70 border border-amber-600/80 text-xs">
                        <div className="flex items-center space-x-1.5 text-amber-300 font-bold mb-0.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Rejection Reason:</span>
                        </div>
                        <div className="text-amber-200 font-medium pl-5 text-[11px]">
                          "{req.rejectionReason}"
                        </div>
                      </div>
                    )}

                    {/* Mandatory Requirement: Cancelled rides and reason */}
                    {isCancelled && (
                      <div className="mt-2 p-2 rounded-lg bg-red-950/70 border border-red-600/80 text-xs">
                        <div className="flex items-center space-x-1.5 text-red-300 font-bold mb-0.5">
                          <Ban className="w-3.5 h-3.5 text-red-400" />
                          <span>Cancellation Details:</span>
                        </div>
                        <div className="text-red-200 font-medium pl-5 text-[11px]">
                          {req.cancellationReason || 'Ride cancelled'}
                        </div>
                      </div>
                    )}

                    {/* Route Details */}
                    <div className="mt-2 space-y-1 text-xs text-slate-300">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-emerald-400">●</span>
                        <span className="text-slate-400">From:</span>
                        <span className="font-semibold text-slate-200 truncate">
                          {req.pickupLocationName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-rose-400">■</span>
                        <span className="text-slate-400">To:</span>
                        <span className="font-semibold text-slate-200 truncate">
                          {req.dropoffLocationName}
                        </span>
                      </div>
                    </div>

                    {/* Pooling details */}
                    {req.assignedVehicleId && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Pooled on:</span>
                        <span className="font-bold text-cyan-400 font-mono">
                          {req.assignedVehicleId}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: LIVE EVENT FEED (Pickups, Drops, Blockages, Cancellations) */}
        {activeTab === 'events' && (
          <div className="space-y-2">
            <div className="text-xs text-slate-400 px-1 flex justify-between items-center">
              <span>Real-Time Audit Log</span>
              <span className="text-[10px] text-cyan-400 font-mono">Live Sync</span>
            </div>

            {events.map((ev) => {
              let icon = <Radio className="w-3.5 h-3.5 text-blue-400" />;
              let borderColor = 'border-slate-800';
              let badgeColor = 'text-blue-400 bg-blue-950/60';

              if (ev.type === 'pickup') {
                icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
                borderColor = 'border-emerald-800/60';
                badgeColor = 'text-emerald-400 bg-emerald-950/60';
              } else if (ev.type === 'drop') {
                icon = <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />;
                borderColor = 'border-teal-800/60';
                badgeColor = 'text-teal-400 bg-teal-950/60';
              } else if (ev.type === 'blockage') {
                icon = <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
                borderColor = 'border-red-800/80';
                badgeColor = 'text-red-400 bg-red-950/80';
              } else if (ev.type === 'cancellation') {
                icon = <XCircle className="w-3.5 h-3.5 text-rose-400" />;
                borderColor = 'border-rose-800/60';
                badgeColor = 'text-rose-400 bg-rose-950/60';
              } else if (ev.type === 'rejection') {
                icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
                borderColor = 'border-amber-800/60';
                badgeColor = 'text-amber-400 bg-amber-950/60';
              }

              return (
                <div
                  key={ev.id}
                  className={`p-2.5 rounded-lg bg-slate-950/60 border ${borderColor} space-y-1 text-xs`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 font-bold text-slate-200">
                      {icon}
                      <span>{ev.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      T+{ev.timestamp}s
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 pl-5">
                    {ev.description}
                  </div>
                  {ev.locationName && (
                    <div className="text-[10px] text-slate-500 pl-5 flex items-center space-x-1">
                      <span>📍</span>
                      <span>{ev.locationName}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fleet Summary Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-xs space-y-1 text-slate-400">
        <div className="flex justify-between items-center font-medium">
          <span>Active Fleet Occupancy:</span>
          <span className="font-bold text-slate-200">
            {vehicles.reduce((acc, v) => acc + v.seatsOccupied, 0)} /{' '}
            {vehicles.reduce((acc, v) => acc + v.capacity, 0)} seats
          </span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span>Rejections / Cancellations:</span>
          <span className="font-mono text-amber-400">
            {rejectedRequests.length} rej / {cancelledRequests.length} canc
          </span>
        </div>
      </div>
    </aside>
  );
};

