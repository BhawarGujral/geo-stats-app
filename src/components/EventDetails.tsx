import { useEffect } from "react";
import type { FC } from "react";
import { useSelectedContext } from "../context/SelectedContext";

function formatTime(value: unknown): string {
  if (!value && value !== 0) return "";
  const s = String(value);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(d)
    .replace(/,/g, "");
  return `${datePart} ${timePart}`;
}

const EventDetails: FC = () => {
  const { selected, clearSelected } = useSelectedContext();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") clearSelected();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clearSelected]);

  if (!selected) return null;

  return (
    <div
      onClick={() => clearSelected()}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 60,
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.6)",
          maxWidth: "900px",
          width: "96%",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>{selected.place ?? "Event details"}</h3>
          <div>
            <button onClick={() => clearSelected()}>Close</button>
          </div>
        </div>

        <dl
          style={{
            marginTop: "0.75rem",
            display: "grid",
            gridTemplateColumns: "140px 1fr",
            gap: "0.5rem",
            textAlign: "left",
          }}
        >
          <dt className="muted">ID</dt>
          <dd>{selected.id}</dd>

          <dt className="muted">Time</dt>
          <dd>{formatTime(selected.time)}</dd>

          <dt className="muted">Updated</dt>
          <dd>{formatTime(selected.updated)}</dd>

          <dt className="muted">Magnitude</dt>
          <dd>
            {typeof selected.mag === "number"
              ? selected.mag.toFixed(2)
              : selected.mag}
          </dd>

          <dt className="muted">Type</dt>
          <dd>{selected.type ?? "-"}</dd>

          <dt className="muted">Depth (km)</dt>
          <dd>{selected.depth ?? "-"}</dd>

          <dt className="muted">Coordinates</dt>
          <dd>
            {selected.latitude}, {selected.longitude}
          </dd>

          <dt className="muted">Status</dt>
          <dd>{selected.status ?? "-"}</dd>

          <dt className="muted">Network</dt>
          <dd>{selected.net ?? "-"}</dd>

          <dt className="muted">Mag source</dt>
          <dd>{selected.magSource ?? "-"}</dd>
        </dl>
      </div>
    </div>
  );
};

export default EventDetails;
