import type { Toast } from '../hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
  t: (light: string, dark: string) => string;
}

function ToastItem({ toast, onRemove, t }: { toast: Toast; onRemove: (id: string) => void; t: (light: string, dark: string) => string }) {
  const bgColor = toast.type === 'success' ? 'bg-string-mint' :
                  toast.type === 'error' ? 'bg-red-500' :
                  'bg-gray-500';

  const textColor = toast.type === 'success' ? 'text-string-dark' : 'text-white';

  return (
    <div
      className={`${bgColor} ${textColor} px-4 py-3 rounded-xl shadow-lg text-sm font-medium transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-2`}
      onClick={() => onRemove(toast.id)}
    >
      {toast.message}
    </div>
  );
}

export function ToastContainer({ toasts, onRemove, t }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-2 sm:hidden">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
          t={t}
        />
      ))}
    </div>
  );
}