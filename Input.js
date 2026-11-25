/**
 * CampusFlow Shared Component: Form Controls (Input, Select, Switch)
 * Created by: Member 1 (Design Systems Lead)
 */

export function Select({
  label = "",
  id = "",
  options = [], // [{ value, label, sublabel, icon }]
  value = "",
  placeholder = "Select an option",
  icon = "",
  helperText = "",
  error = "",
  className = "",
  onChange = () => {}
}) {
  const container = document.createElement("div");
  container.className = `w-full space-y-1.5 ${className}`;

  container.innerHTML = `
    ${label ? `<label for="${id}" class="block text-xs font-semibold text-slate-700 tracking-wide uppercase">${label}</label>` : ""}
    <div class="relative">
      ${icon ? `<div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">${icon}</div>` : ""}
      <select id="${id}" class="w-full ${icon ? 'pl-10' : 'pl-3.5'} pr-10 py-2.5 text-sm font-medium bg-white border ${error ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'} rounded-xl shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-offset-1 text-slate-800 transition-all touch-target cursor-pointer">
        ${placeholder ? `<option value="" disabled ${!value ? 'selected' : ''}>${placeholder}</option>` : ""}
        ${options.map(opt => `
          <option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>
            ${opt.label}${opt.sublabel ? ` (${opt.sublabel})` : ''}
          </option>
        `).join("")}
      </select>
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    ${error ? `<p class="text-xs text-rose-600 font-medium">${error}</p>` : helperText ? `<p class="text-xs text-slate-500">${helperText}</p>` : ""}
  `;

  const selectEl = container.querySelector("select");
  selectEl.addEventListener("change", (e) => onChange(e.target.value, e));

  return container;
}

export function ToggleSwitch({
  id = "",
  label = "",
  description = "",
  checked = false,
  badge = "",
  variant = "emerald", // 'emerald' | 'pink'
  onChange = () => {}
}) {
  const container = document.createElement("label");
  container.className = `flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none ${checked ? (variant === 'pink' ? 'bg-pink-50/60 border-pink-300' : 'bg-emerald-50/60 border-emerald-300') : 'bg-white border-slate-200 hover:border-slate-300'}`;

  const activeColor = variant === "pink" ? "bg-pink-600" : "bg-emerald-600";

  container.innerHTML = `
    <div class="flex items-center space-x-3 pr-3">
      <div class="space-y-0.5">
        <div class="flex items-center space-x-2">
          <span class="text-sm font-semibold text-slate-800">${label}</span>
          ${badge ? badge : ""}
        </div>
        ${description ? `<p class="text-xs text-slate-500">${description}</p>` : ""}
      </div>
    </div>
    <div class="relative inline-flex items-center shrink-0">
      <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} class="sr-only peer">
      <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:${activeColor}"></div>
    </div>
  `;

  const inputEl = container.querySelector("input");
  inputEl.addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      container.className = `flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none ${variant === 'pink' ? 'bg-pink-50/60 border-pink-300' : 'bg-emerald-50/60 border-emerald-300'}`;
    } else {
      container.className = "flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none bg-white border-slate-200 hover:border-slate-300";
    }
    onChange(isChecked, e);
  });

  return container;
}
