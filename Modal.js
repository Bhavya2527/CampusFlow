/**
 * CampusFlow Shared Component: Modal Dialog
 * Created by: Member 1 (Design Systems Lead)
 */

import { Icons } from './Icons.js';

export function openModal({
  title = "",
  contentHtml = "",
  actions = [], // [{ label, variant, onClick }]
  size = "md", // 'sm' | 'md' | 'lg'
  onClose = () => {}
}) {
  const existing = document.getElementById("cf-modal-overlay");
  if (existing) existing.remove();

  const maxWClass = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl"
  }[size] || "max-w-lg";

  const overlay = document.createElement("div");
  overlay.id = "cf-modal-overlay";
  overlay.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in";

  overlay.innerHTML = `
    <div class="relative w-full ${maxWClass} bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
        <h3 class="text-base font-bold text-slate-800">${title}</h3>
        <button id="cf-modal-close-btn" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
          ${Icons.X("w-5 h-5")}
        </button>
      </div>

      <!-- Content -->
      <div id="cf-modal-body" class="px-6 py-5 overflow-y-auto space-y-4">
        ${contentHtml}
      </div>

      <!-- Footer Actions -->
      <div id="cf-modal-footer" class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => {
    overlay.remove();
    onClose();
  };

  overlay.querySelector("#cf-modal-close-btn").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  const footer = overlay.querySelector("#cf-modal-footer");
  actions.forEach(action => {
    const btn = document.createElement("button");
    const variantStyles = {
      primary: "bg-emerald-600 hover:bg-emerald-700 text-white",
      danger: "bg-rose-600 hover:bg-rose-700 text-white",
      secondary: "bg-slate-200 hover:bg-slate-300 text-slate-700",
      outline: "border border-slate-300 hover:bg-slate-100 text-slate-700"
    }[action.variant || "secondary"];

    btn.className = `px-4 py-2 text-sm font-semibold rounded-xl cursor-pointer transition-colors ${variantStyles}`;
    btn.textContent = action.label;
    btn.addEventListener("click", async () => {
      if (action.onClick) {
        const res = await action.onClick();
        if (res !== false) close();
      } else {
        close();
      }
    });
    footer.appendChild(btn);
  });

  return { close, element: overlay };
}
