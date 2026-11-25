/**
 * CampusFlow Shared Component: Tabs Navigation
 * Created by: Member 1 (Design Systems Lead)
 */

export function Tabs({
  tabs = [], // [{ id, label, icon, badge }]
  activeTab = "",
  onChange = () => {}
}) {
  const nav = document.createElement("div");
  nav.className = "flex space-x-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 overflow-x-auto scrollbar-none";

  tabs.forEach(tab => {
    const isActive = tab.id === activeTab;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer touch-target ${
      isActive 
        ? "bg-white text-emerald-800 shadow-sm" 
        : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
    }`;

    btn.innerHTML = `
      ${tab.icon ? `<span class="shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-500'}">${tab.icon}</span>` : ""}
      <span>${tab.label}</span>
      ${tab.badge !== undefined && tab.badge !== null ? `
        <span class="ml-1.5 px-2 py-0.5 text-xs rounded-full font-bold ${
          isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
        }">${tab.badge}</span>
      ` : ""}
    `;

    btn.addEventListener("click", () => {
      onChange(tab.id);
    });

    nav.appendChild(btn);
  });

  return nav;
}
