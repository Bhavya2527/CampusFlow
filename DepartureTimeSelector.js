/**
 * CampusFlow Departure Time Selection Component
 * Responsibility: Member 2 (Student Ride Booking Experience)
 * 
 * Provides commute time slot filtering:
 * Morning Commute, Afternoon Classes, Evening Rush, Night SafeRide
 */

import { Icons } from '../../components/shared/Icons.js';

export function DepartureTimeSelector({
  selectedCategory = 'ALL',
  onChange = () => {}
}) {
  const container = document.createElement("div");
  container.className = "space-y-1.5";

  const categories = [
    { id: 'ALL', label: 'All Slots', icon: Icons.Clock("w-3.5 h-3.5") },
    { id: 'MORNING', label: 'Morning (6 AM - 12 PM)', icon: '🌅' },
    { id: 'AFTERNOON', label: 'Afternoon (12 PM - 5 PM)', icon: '☀️' },
    { id: 'EVENING', label: 'Evening Rush (5 PM - 9 PM)', icon: '🌆' },
    { id: 'NIGHT', label: 'Night SafeRide (9 PM - 6 AM)', icon: '🌙' }
  ];

  container.innerHTML = `
    <label class="block text-xs font-semibold text-slate-700 tracking-wide uppercase flex items-center space-x-1.5">
      ${Icons.Clock("w-3.5 h-3.5 text-emerald-600")}
      <span>Departure Time Window</span>
    </label>
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      ${categories.map(cat => {
        const isSelected = cat.id === selectedCategory;
        return `
          <button type="button" data-category="${cat.id}" class="time-cat-chip shrink-0 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer touch-target flex items-center space-x-1.5 ${
            isSelected 
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          }">
            <span>${cat.icon}</span>
            <span>${cat.label}</span>
          </button>
        `;
      }).join('')}
    </div>
  `;

  container.querySelectorAll(".time-cat-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-category");
      onChange(cat);
    });
  });

  return container;
}
