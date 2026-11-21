import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from "react";

type DialogProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  closeLabel: string;
  primaryLabel: string;
  onClose: () => void;
  onPrimary: () => void;
};

export function Dialog({
  open,
  title,
  children,
  closeLabel,
  primaryLabel,
  onClose,
  onPrimary,
}: DialogProps) {
  const titleId = useId();
  const bodyId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const onPrimaryRef = useRef(onPrimary);
  onCloseRef.current = onClose;
  onPrimaryRef.current = onPrimary;

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    triggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!dialog.open) dialog.showModal();
    const initialFocus = dialog.querySelector<HTMLElement>("[data-autofocus]");
    (initialFocus ?? dialog.querySelector<HTMLElement>("button, input, select, textarea, [href]"))?.focus();
    const onCancel = (event: Event) => {
      event.preventDefault();
      onCloseRef.current();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("keydown", onKeyDown);
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      const trigger = triggerRef.current;
      if (trigger) {
        window.requestAnimationFrame(() => {
          if (trigger.isConnected) trigger.focus();
        });
      }
      triggerRef.current = null;
    };
  }, [open]);

  if (!open) return null;

  function closeFromBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const outside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;
    if (outside) onCloseRef.current();
  }

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      onMouseDown={closeFromBackdrop}
    >
      <h2 id={titleId}>{title}</h2>
      <div id={bodyId} className="dialog-body">
        {children}
      </div>
      <div className="dialog-actions">
        <button
          type="button"
          className="btn btn-secondary"
          data-autofocus
          onClick={() => onCloseRef.current()}
        >
          {closeLabel}
        </button>
        <button type="button" className="btn btn-primary" onClick={() => onPrimaryRef.current()}>
          {primaryLabel}
        </button>
      </div>
    </dialog>
  );
}

export function Tag({
  priority,
  status,
  children,
}: {
  priority?: string;
  status?: string;
  children: ReactNode;
}) {
  return (
    <span className="tag" data-priority={priority} data-status={status}>
      {children}
    </span>
  );
}
