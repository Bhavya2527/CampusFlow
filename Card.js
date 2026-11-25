/**
 * CampusFlow Shared Component: Card
 * Created by: Member 1 (Design Systems Lead)
 */

export function Card({
  children = "",
  className = "",
  padding = "p-5",
  interactive = false,
  bordered = true,
  onClick = null,
  id = ""
}) {
  const borderClass = bordered ? "border border-slate-200" : "";
  const interactiveClass = interactive 
    ? "hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer" 
    : "shadow-sm";

  return `
    <div ${id ? `id="${id}"` : ""} class="bg-white rounded-2xl ${borderClass} ${interactiveClass} ${padding} ${className}">
      ${children}
    </div>
  `;
}
