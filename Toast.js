/**
 * CampusFlow Shared Component: Toast Notifications
 * Created by: Member 1 (Design Systems Lead)
 */

import { Icons } from './Icons.js';

let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer || !document.body.contains(toastContainer)) {
    toastContainer = document.createElement("div");
    toastContainer.id = "cf-toast-container";
    toastContainer.className = "fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0";
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast({
  message = "",
  type = "info", // 'success' | 'error' | 'warning' | 'info'
  duration = 4000
}) {
  const container = ensureToastContainer();

  const toast = document.createElement("div");
  toast.className = "pointer-events-auto flex items-start p-4 rounded-xl shadow-lg border text-sm transition-all duration-300 transform translate-y-2 opacity-0 animate-fade-in";

  let bgClass = "bg-white border-slate-200 text-slate-800";
  let iconHtml = Icons.Info("w-5 h-5 text-blue-500 shrink-0 mt-0.5");

  if (type === "success") {
    bgClass = "bg-emerald-50 border-emerald-200 text-emerald-900";
    iconHtml = Icons.CheckCircle("w-5 h-5 text-emerald-600 shrink-0 mt-0.5");
  } else if (type === "error") {
    bgClass = "bg-rose-50 border-rose-200 text-rose-900";
    iconHtml = Icons.XCircle("w-5 h-5 text-rose-600 shrink-0 mt-0.5");
  } else if (type === "warning") {
    bgClass = "bg-amber-50 border-amber-200 text-amber-900";
    iconHtml = Icons.AlertTriangle("w-5 h-5 text-amber-600 shrink-0 mt-0.5");
  }

  toast.className = `pointer-events-auto flex items-start space-x-3 p-4 rounded-xl shadow-lg border text-sm transition-all duration-300 ${bgClass}`;
  toast.innerHTML = `
    ${iconHtml}
    <div class="flex-1 font-medium leading-snug">${message}</div>
    <button class="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer">
      ${Icons.X("w-4 h-4")}
    </button>
  `;

  const closeBtn = toast.querySelector("button");
  const removeToast = () => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 250);
  };

  closeBtn.addEventListener("click", removeToast);
  container.appendChild(toast);

  // Auto dismiss
  if (duration > 0) {
    setTimeout(removeToast, duration);
  }
}
