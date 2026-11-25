import React, { useState } from 'react';
import { CampusLocation } from '@shared/types';
import {
  X,
  Compass,
  MapPin,
  TrendingUp,
  Send,
  CheckCircle2,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';
import { simulationEngine } from '../simulation/deterministicEngine';

interface StudentDemandViewProps {
  locations: CampusLocation[];
  onClose: () => void;
}

export const StudentDemandView: React.FC<StudentDemandViewProps> = ({
  locations,
  onClose,
}) => {
  const [pickupId, setPickupId] = useState(locations[0]?.id || '');
  const [dropoffId, setDropoffId] = useState(locations[3]?.id || '');
  const [passengerName, setPassengerName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Simulated demand clusters at campus hubs
  const demandClusters = [
    { name: 'Hostel A & B Zone', demandLevel: 'Very High', waitEstimate: '2-4 mins', requestsWaiting: 6, color: 'text-rose-400 bg-rose-950/60 border-rose-800' },
    { name: 'Central Library Hub', demandLevel: 'High', waitEstimate: '1-3 mins', requestsWaiting: 4, color: 'text-amber-400 bg-amber-950/60 border-amber-800' },
    { name: 'Central Cafeteria Plaza', demandLevel: 'Moderate', waitEstimate: '3-5 mins', requestsWaiting: 3, color: 'text-blue-400 bg-blue-950/60 border-blue-800' },
    { name: 'Academic Block 1 & 2', demandLevel: 'High', waitEstimate: '2 mins', requestsWaiting: 5, color: 'text-amber-400 bg-amber-950/60 border-amber-800' },
    { name: 'Sports Complex', demandLevel: 'Low', waitEstimate: '5 mins', requestsWaiting: 1, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' },
  ];

  const handleRequestRide = (e: React.FormEvent) => {
    e.preventDefault();
    const name = passengerName.trim() || 'Student Rider';
    simulationEngine.injectRideRequest(name);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Student Campus Mobility Portal
              </h3>
              <p className="text-xs text-slate-400">
                Live Zone Demand Heatmap & Dynamic Ride Booking
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

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Demand Clusters */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 mb-2.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Campus Zone Demand Heatmap</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {demandClusters.map((cluster, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border ${cluster.color} flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{cluster.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded uppercase">
                      {cluster.demandLevel}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Avg Wait: {cluster.waitEstimate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>{cluster.requestsWaiting} riders</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Request Form */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center space-x-1.5 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Simulate Real-Time Passenger Booking</span>
            </h4>

            {submitted ? (
              <div className="p-4 rounded-lg bg-emerald-950/80 border border-emerald-600 text-center text-xs text-emerald-200 font-bold flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Ride request pooled into live simulation fleet!</span>
              </div>
            ) : (
              <form onSubmit={handleRequestRide} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Student Name / Roll ID
                  </label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="e.g. Diya Sen (Roll #2411)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      Pickup Location
                    </label>
                    <select
                      value={pickupId}
                      onChange={(e) => setPickupId(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500 text-xs font-medium"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      Dropoff Destination
                    </label>
                    <select
                      value={dropoffId}
                      onChange={(e) => setDropoffId(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500 text-xs font-medium"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Pool Ride with Nearest Shuttle</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

