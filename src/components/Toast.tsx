import { useEffect, useRef } from "react";

type ToastProps = {
  message: string | null;
  onClose: () => void;
};

export function Toast({ message, onClose }: ToastProps) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (message === null) return;
    const id = window.setTimeout(() => onCloseRef.current(), 4000);
    return () => window.clearTimeout(id);
  }, [message]);

  return (
    <div className="toast-slot" aria-live="polite">
      {message !== null ? (
        <div className="toast" role="status">
          <p>{message}</p>
          <button type="button" className="btn btn-quiet" onClick={onClose}>
            关闭
          </button>
        </div>
      ) : null}
    </div>
  );
}
