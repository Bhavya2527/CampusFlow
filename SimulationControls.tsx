import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  AlertOctagon,
  UserPlus,
  Ban,
  Clock,
  Zap,
} from 'lucide-react';
import { simulationEngine } from '../simulation/deterministicEngine';

interface SimulationControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  speedMultiplier: 1 | 2 | 4;
  simTime: number;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  isPaused,
  speedMultiplier,
  simTime,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between shadow-lg backdrop-blur-md z-30 select-none">
      {/* Brand & Stage Clock */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-md">
            CF
          </div>
          <div>
            <div className="text-sm font-black tracking-tight text-white flex items-center space-x-1.5">
              <span>CampusFlow</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 border border-blue-800">
                LIVE FLEET
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              PS 10 • Dynamic Campus Ride Pooling
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800" />

        {/* Sim Clock */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1 rounded-md border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <div className="text-xs font-mono font-bold text-slate-200">
            {formatTime(simTime)}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            (Tick #{Math.floor(simTime)})
          </span>
        </div>
      </div>

      {/* Primary Simulation Controls (Start, Pause, Reset, Speed) */}
      <div className="flex items-center space-x-3 my-1">
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 shadow-inner">
          {isPaused ? (
            <button
              onClick={() => simulationEngine.start()}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
              title="Start / Resume Simulation"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={() => simulationEngine.pause()}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-sm"
              title="Pause Simulation"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {/* Reset button: returns the map to seed state */}
          <button
            onClick={() => simulationEngine.reset()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            title="Reset Simulation to Seed State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Speed Multiplier: 1x, 2x, 4x */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 px-1 font-semibold flex items-center space-x-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Speed:</span>
          </span>
          {([1, 2, 4] as const).map((spd) => (
            <button
              key={spd}
              onClick={() => simulationEngine.setSpeed(spd)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition ${
                speedMultiplier === spd
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Stage Interactive Demo Triggers */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => simulationEngine.toggleRoadBlock()}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-red-950/80 hover:bg-red-900/90 text-red-200 border border-red-700/80 text-xs font-semibold transition shadow-sm"
          title="Toggle Road Segment Blockage to demonstrate dynamic vehicle detour"
        >
          <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
          <span>Toggle Road Block</span>
        </button>

        <button
          onClick={() => simulationEngine.cancelRide('req_aman')}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-amber-950/80 hover:bg-amber-900/90 text-amber-200 border border-amber-700/80 text-xs font-semibold transition shadow-sm"
          title="Simulate Passenger Ride Cancellation"
        >
          <Ban className="w-3.5 h-3.5 text-amber-400" />
          <span>Cancel Ride</span>
        </button>

        <button
          onClick={() => simulationEngine.injectRideRequest()}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-blue-950/80 hover:bg-blue-900/90 text-blue-200 border border-blue-700/80 text-xs font-semibold transition shadow-sm"
          title="Inject New Ride Request (Tests pooling and rejection capacity)"
        >
          <UserPlus className="w-3.5 h-3.5 text-blue-400" />
          <span>+ Inject Request</span>
        </button>
      </div>
    </div>
  );
};

