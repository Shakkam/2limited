"use client";

// Drop-in replacement for a plain <button type="submit"> that asks for
// confirmation first — used on every "Supprimer" button in the backoffice,
// since deleting a show/track/photo/gear item is immediate and permanent
// (no undo, no trash).
export default function ConfirmSubmitButton({ confirmMessage = "Confirmer la suppression ?", className, children }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
