/**
 * CampusFlow Route Demand Preview Component
 * Responsibility: Member 2 (Student Ride Booking Experience)
 * 
 * Displays dynamic route demand level, surge multiplier, active student interest,
 * peak hours, and cost-saving alternative slot suggestions.
 */

import { Icons } from '../../components/shared/Icons.js';
import { Badge } from '../../components/shared/Badge.js';

export function RouteDemandPreview(demandData) {
  if (!demandData) return "";

  const isSurge = demandData.demandLevel === 'SURGE' || demandData.demandLevel === 'HIGH';

  return `
    <div class="rounded-2xl border ${isSurge ? 'border-amber-200 bg-amber-50/40' : 'border-slate-200 bg-white'} p-4 sm:p-5 shadow-xs transition-all duration-200">
      
      <!-- Top Row: Route Demand Overview -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b ${isSurge ? 'border-amber-200/60' : 'border-slate-100'}">
        <div class="flex items-center space-x-2.5">
          <div class="p-2 rounded-xl ${isSurge ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}">
            ${Icons.TrendingUp("w-5 h-5")}
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h4 class="text-sm font-bold text-slate-800">Route Demand Preview</h4>
              ${Badge({
                type: "demand",
                value: demandData.demandLevel,
                text: `${demandData.demandLevel} DEMAND`
              })}
            </div>
            <p class="text-xs text-slate-500 mt-0.5">${demandData.pickupName} → ${demandData.destinationName}</p>
          </div>
        </div>

        <!-- Demand Metrics -->
        <div class="flex items-center space-x-4 text-xs">
          <div class="bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200/80">
            <span class="text-slate-500">Live Traffic:</span>
            <strong class="text-slate-800 ml-1 font-bold">${demandData.activeStudentRequests} students</strong>
          </div>
          <div class="bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200/80">
            <span class="text-slate-500">Pricing Factor:</span>
            <strong class="${demandData.surgeMultiplier > 1.0 ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'} ml-1">
              ${demandData.surgeMultiplier}x
            </strong>
          </div>
        </div>
      </div>

      <!-- Route Demand Meter Bar -->
      <div class="py-3">
        <div class="flex justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
          <span>Corridor Congestion Index</span>
          <span class="font-bold text-slate-700">${demandData.demandScore} / 100</span>
        </div>
        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
          <div class="bg-emerald-500 h-full" style="width: ${Math.min(45, demandData.demandScore)}%"></div>
          <div class="bg-amber-400 h-full" style="width: ${Math.max(0, Math.min(30, demandData.demandScore - 45))}%"></div>
          <div class="bg-rose-500 h-full" style="width: ${Math.max(0, demandData.demandScore - 75)}%"></div>
        </div>
      </div>

      <!-- Peak Hours & Recommendation -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
        
        <!-- Peak Commute Windows -->
        <div class="p-3 bg-white/90 rounded-xl border border-slate-200/70 space-y-1.5">
          <span class="font-bold text-slate-700 flex items-center space-x-1">
            ${Icons.Clock("w-3.5 h-3.5 text-slate-400")}
            <span>Peak Campus Commute Windows</span>
          </span>
          <div class="space-y-1 text-slate-600">
            ${demandData.peakHours.map(ph => `
              <div class="flex justify-between items-center text-[11px]">
                <span class="${ph.isPeak ? 'font-semibold text-slate-800' : 'text-slate-500'}">${ph.time}</span>
                <span class="${ph.isPeak ? 'text-rose-600 font-bold' : 'text-slate-400'}">${ph.isPeak ? 'High Rush' : 'Moderate'}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Smart Saver Recommendation -->
        <div class="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 flex flex-col justify-between">
          <div>
            <span class="font-bold text-emerald-900 flex items-center space-x-1">
              ${Icons.Zap("w-3.5 h-3.5 text-emerald-600")}
              <span>Smart Saver Suggestion</span>
            </span>
            <p class="text-emerald-800 mt-1 text-[11px]">
              ${demandData.recommendedAlternativeTime}
            </p>
          </div>
          <p class="text-[10px] text-emerald-700 mt-2 font-medium">
            💡 Shifting travel by 15-30 mins guarantees more seating options and regular base fares.
          </p>
        </div>

      </div>

    </div>
  `;
}
