/**
 * CampusFlow Advance Booking Calendar Component
 * Responsibility: Member 2 (Student Ride Booking Experience)
 * 
 * Provides quick date chips and advance calendar date selection (up to 14 days)
 * with dynamic early-bird discount indicator.
 */

import { Icons } from '../../components/shared/Icons.js';

export function AdvanceBookingCalendar({
  selectedDate = new Date().toISOString().split('T')[0],
  onDateChange = () => {}
}) {
  const container = document.createElement("div");
  container.className = "space-y-2";

  // Generate the next 5 days for quick chips
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = i === 0;
    const isTomorrow = i === 1;

    let dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    let dateLabel = `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })}`;

    if (isToday) dayLabel = "Today";
    else if (isTomorrow) dayLabel = "Tomorrow";

    days.push({
      dateStr,
      dayLabel,
      dateLabel,
      isAdvanceDiscount: i >= 2
    });
  }

  // Max selectable date: 14 days ahead
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 14);
  const maxDateStr = maxDate.toISOString().split('T')[0];
  const minDateStr = today.toISOString().split('T')[0];

  const isSelectedAdvance = (() => {
    const sel = new Date(selectedDate);
    const tod = new Date(minDateStr);
    const diffDays = Math.round((sel - tod) / (1000 * 60 * 60 * 24));
    return diffDays >= 2;
  })();

  container.innerHTML = `
    <div class="flex items-center justify-between">
      <label class="block text-xs font-semibold text-slate-700 tracking-wide uppercase flex items-center space-x-1.5">
        ${Icons.Calendar("w-3.5 h-3.5 text-emerald-600")}
        <span>Advance Booking Calendar</span>
      </label>
      ${isSelectedAdvance ? `
        <span class="inline-flex items-center px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
          🎉 10% Early-Bird Discount
        </span>
      ` : ""}
    </div>

    <!-- Quick Date Chips Row -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      ${days.map(d => {
        const isSelected = d.dateStr === selectedDate;
        return `
          <button type="button" data-date="${d.dateStr}" class="date-chip shrink-0 px-3.5 py-2 rounded-xl border text-center transition-all cursor-pointer touch-target ${
            isSelected 
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' 
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          }">
            <div class="text-[11px] font-bold ${isSelected ? 'text-emerald-100' : 'text-slate-500'} uppercase">${d.dayLabel}</div>
            <div class="text-xs font-bold leading-tight mt-0.5">${d.dateLabel}</div>
            ${d.isAdvanceDiscount ? `<div class="text-[9px] font-bold text-amber-300 mt-0.5">-10%</div>` : ''}
          </button>
        `;
      }).join('')}

      <!-- Custom Date Picker Trigger -->
      <div class="relative shrink-0">
        <input 
          type="date" 
          id="custom-advance-date-input" 
          min="${minDateStr}" 
          max="${maxDateStr}" 
          value="${selectedDate}"
          class="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
        />
        <button type="button" class="px-3.5 py-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100 text-center transition-all touch-target h-full flex flex-col items-center justify-center">
          <div class="text-[11px] font-semibold text-slate-400">More</div>
          <div class="text-xs font-bold text-emerald-700 flex items-center space-x-1">
            ${Icons.Calendar("w-3 h-3")}
            <span>Select</span>
          </div>
        </button>
      </div>
    </div>
  `;

  // Attach event handlers
  container.querySelectorAll(".date-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const date = btn.getAttribute("data-date");
      onDateChange(date);
    });
  });

  const customInput = container.querySelector("#custom-advance-date-input");
  customInput.addEventListener("change", (e) => {
    if (e.target.value) {
      onDateChange(e.target.value);
    }
  });

  return container;
}
