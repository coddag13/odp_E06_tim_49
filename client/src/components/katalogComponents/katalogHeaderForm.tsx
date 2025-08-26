import type { ReactNode } from "react";

export function KatalogHeader({
  isAuthenticated,
  role,
  onLogout,
  onGoAdd,
  leftActionsWhenGuest,
}: {
  isAuthenticated: boolean;
  role?: string | null;
  onLogout: () => void;
  onGoAdd: () => void;
  leftActionsWhenGuest?: ReactNode;
}) {
  return (
    <header className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-xl sm:text-2xl font-extrabold">
        ODP Katalog{isAuthenticated ? " — Dobrodošli" : ""}
        {isAuthenticated && role === "admin" ? " (Admin)" : ""}
      </h1>

      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <button
              onClick={onGoAdd}
              className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              + Add
            </button>
          )}
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition"
          >
            Odjava
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">{leftActionsWhenGuest}</div>
      )}
    </header>
  );
}