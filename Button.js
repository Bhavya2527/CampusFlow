/**
 * CampusFlow Shared Component: Button
 * Created by: Member 1 (Design Systems Lead)
 */

export function Button({
  text = "",
  variant = "primary", // 'primary' | 'secondary' | 'women-safe' | 'danger' | 'outline' | 'ghost'
  size = "md", // 'sm' | 'md' | 'lg'
  icon = "",
  iconPosition = "left",
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick = () => {},
  className = "",
  id = "",
  type = "button"
}) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 touch-target cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5 font-semibold"
  }[size] || "px-4 py-2 text-sm gap-2";

  const variantClasses = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow focus:ring-emerald-500",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400",
    "women-safe": "bg-pink-600 hover:bg-pink-700 text-white shadow-sm hover:shadow focus:ring-pink-500",
    danger: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500",
    outline: "border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-emerald-500",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-300"
  }[variant] || "bg-emerald-600 text-white";

  const widthClass = fullWidth ? "w-full" : "";

  const buttonEl = document.createElement("button");
  buttonEl.type = type;
  if (id) buttonEl.id = id;
  buttonEl.disabled = disabled || loading;
  buttonEl.className = `${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`;

  if (loading) {
    buttonEl.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <span>Loading...</span>
    `;
  } else {
    buttonEl.innerHTML = `
      ${icon && iconPosition === "left" ? `<span class="shrink-0 flex items-center">${icon}</span>` : ""}
      <span>${text}</span>
      ${icon && iconPosition === "right" ? `<span class="shrink-0 flex items-center">${icon}</span>` : ""}
    `;
  }

  buttonEl.addEventListener("click", (e) => {
    if (!disabled && !loading) onClick(e);
  });

  return buttonEl;
}
