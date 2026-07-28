"use client";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle, Trash2, Info } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

const icons = {
  danger: <Trash2 size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Info size={20} />,
};

const colors = {
  danger: "var(--error)",
  warning: "var(--warning)",
  info: "var(--info)",
};

const bgs = {
  danger: "var(--error-bg)",
  warning: "var(--warning-bg)",
  info: "var(--info-bg)",
};

export function ConfirmDialog({
  open, onClose, onConfirm, title, message,
  confirmLabel = "Confirm", cancelLabel = "Cancel",
  variant = "danger", loading
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center gap-4 p-2">
        <div
          className="flex items-center justify-center rounded-2xl"
          style={{ width: 52, height: 52, background: bgs[variant], color: colors[variant] }}
        >
          {icons[variant]}
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{title}</h3>
          <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>{message}</p>
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant="danger" fullWidth onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
