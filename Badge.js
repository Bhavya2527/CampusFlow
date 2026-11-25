/**
 * CampusFlow Shared Component: Badge
 * Created by: Member 1 (Design Systems Lead)
 */

export function Badge({
  text = "",
  type = "default", // 'status' | 'demand' | 'tag' | 'default'
  value = "",
  size = "sm", // 'sm' | 'md'
  icon = "",
  className = ""
}) {
  let styleClasses = "bg-slate-100 text-slate-700 border border-slate-200";

  // Standard Status Badges
  if (type === "status") {
    switch ((value || text).toUpperCase()) {
      case "CONFIRMED":
        styleClasses = "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium";
        break;
      case "IN_TRANSIT":
        styleClasses = "bg-sky-50 text-sky-700 border-sky-200 font-medium animate-pulse";
        break;
      case "COMPLETED":
        styleClasses = "bg-slate-100 text-slate-700 border-slate-200";
        break;
      case "CANCELLED":
        styleClasses = "bg-rose-50 text-rose-700 border-rose-200 line-through";
        break;
      case "OPEN":
        styleClasses = "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium";
        break;
      case "FILLING_FAST":
        styleClasses = "bg-amber-50 text-amber-700 border-amber-300 font-semibold";
        break;
      case "SOLD_OUT":
        styleClasses = "bg-rose-50 text-rose-700 border-rose-200 font-medium";
        break;
      default:
        styleClasses = "bg-slate-100 text-slate-700 border-slate-200";
    }
  }

  // Demand Level Badges
  if (type === "demand") {
    switch ((value || text).toUpperCase()) {
      case "LOW":
        styleClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
        break;
      case "MODERATE":
        styleClasses = "bg-blue-50 text-blue-700 border-blue-200";
        break;
      case "HIGH":
        styleClasses = "bg-amber-50 text-amber-800 border-amber-300 font-medium";
        break;
      case "SURGE":
        styleClasses = "bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse";
        break;
    }
  }

  // Special Safety / Feature Tags
  if (type === "tag") {
    if (value === "women-only" || text.toLowerCase().includes("women") || text.toLowerCase().includes("saferide")) {
      styleClasses = "bg-pink-50 text-pink-700 border-pink-200 font-medium";
    } else if (text.toLowerCase().includes("ev") || text.toLowerCase().includes("electric")) {
      styleClasses = "bg-teal-50 text-teal-700 border-teal-200 font-medium";
    } else {
      styleClasses = "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
  }

  const sizeClass = size === "sm" 
    ? "px-2 py-0.5 text-xs rounded-full gap-1" 
    : "px-2.5 py-1 text-sm rounded-full gap-1.5";

  return `
    <span class="inline-flex items-center border shrink-0 ${sizeClass} ${styleClasses} ${className}">
      ${icon ? `<span class="shrink-0 flex items-center">${icon}</span>` : ""}
      <span>${text}</span>
    </span>
  `;
}
