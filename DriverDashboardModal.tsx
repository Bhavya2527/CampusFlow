import React from 'react';
import { Vehicle, RideRequest } from '@shared/types';
import {
  X,
  Navigation,
  Users,
  BatteryCharging,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface DriverDashboardModalProps {
  vehicle: Vehicle | null;
  requests: RideRequest[];
  isRoadBlocked: boolean;
  onClose: () => void;
}

export const DriverDashboardModal: React.FC<DriverDashboardModalProps> = ({
  vehicle,
  requests,
  isRoadBlocked,
  onClose,
}) => {
  if (!vehicle) return null;

  const assignedPassengers = requests.filter(
    (r) => r.assignedVehicleId === vehicle.id && r.status !== 'cancelled'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              🚐
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">{vehicle.name}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                  {vehicle.plateNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                In-Vehicle Driver Terminal • Live Telemetry & Turn-by-Turn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Active Navigation Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950 to-indigo-950 border border-blue-600/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Navigation className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-blue-300 font-bold">
                  Current Turn-By-Turn Waypoint
                </div>
                <div className="text-lg font-black text-white">
                  {vehicle.nextStop}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">ETA to Stop</div>
              <div className="text-xl font-black text-amber-300 font-mono">
                {vehicle.eta}
              </div>
            </div>
          </div>

          {/* Blocked Road Alert if applicable */}
          {isRoadBlocked && (
            <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-500/80 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-200">
                  Campus Corridor Alert:
                </span>{' '}
                <span className="text-amber-300">
                  East Campus Ave (Library - Acad 2) is BLOCKED. System has automatically diverted your routing via SAC Link.
                </span>
              </div>
            </div>
          )}

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 flex items-center space-x-1.5 mb-1">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Seats Occupancy</span>
              </div>
              <div className="text-base font-bold text-white font-mono">
                {vehicle.seatsOccupied} / {vehicle.capacity} seats
              </div>
              <div className="text-[11px] text-emerald-400 mt-0.5">
                {vehicle.seatsRemaining} seats available for pooling
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 flex items-center space-x-1.5 mb-1">
                <BatteryCharging className="w-4 h-4 text-cyan-400" />
                <span>Battery Level</span>
              </div>
              <div className="text-base font-bold text-white font-mono">
                {vehicle.batteryPercent || 88}%
              </div>
              <div className="text-[11px] text-cyan-400 mt-0.5">
                Range: ~42 km remaining
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 flex items-center space-x-1.5 mb-1">
                <Gauge className="w-4 h-4 text-amber-400" />
                <span>Current Speed</span>
              </div>
              <div className="text-base font-bold text-white font-mono">
                {vehicle.speedKmh || 22} km/h
              </div>
              <div className="text-[11px] text-amber-400 mt-0.5">
                Campus Speed Limit: 25 km/h
              </div>
            </div>
          </div>

          {/* Passenger Manifest */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Assigned Passenger Manifest ({assignedPassengers.length})</span>
            </h4>

            {assignedPassengers.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                No active pooled passengers currently assigned.
              </div>
            ) : (
              <div className="space-y-2">
                {assignedPassengers.map((pass) => (
                  <div
                    key={pass.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-100 flex items-center space-x-1.5">
                        <span>👤</span>
                        <span>{pass.passengerName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-2">
                        <span>Pickup: {pass.pickupLocationName}</span>
                        <span>→</span>
                        <span>Drop: {pass.dropoffLocationName}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        pass.status === 'picked_up'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-blue-950 text-blue-300 border border-blue-700'
                      }`}
                    >
                      {pass.status === 'picked_up' ? 'On Board' : 'Awaiting Pickup'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
};

