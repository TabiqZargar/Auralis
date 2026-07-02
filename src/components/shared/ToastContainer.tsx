import { useToastStore } from "@/store/toastStore";
import { X } from "lucide-react";

const typeStyles: Record<string, string> = {
  success: "border-accent bg-accent/10",
  error: "border-error bg-error/10",
  info: "border-white/10 bg-surface-elevated",
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-20 right-4 z-[100] flex flex-col gap-2"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm animate-in slide-in-from-right ${typeStyles[toast.type] ?? typeStyles.info}`}
          role="status"
        >
          <p className="text-sm text-white">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 rounded p-0.5 text-white/50 transition-colors hover:text-white"
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
