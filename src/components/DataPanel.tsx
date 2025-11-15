import { useEffect, useRef, useState, useMemo } from "react";
import type { FC } from "react";
import type { EarthquakeProperties } from "../types/earthquake";
import { useSelectedContext } from "../context/SelectedContext";
import useSelectionStore from "../stores/selectionStore";

type Props = {
  data: EarthquakeProperties[];
  onSelect?: (d: EarthquakeProperties | null) => void; // props pattern
};

const DataPanel: FC<Props> = ({ data, onSelect }) => {
  const { selected: ctxSelected, setSelected } = useSelectedContext();
  const storeSelected = useSelectionStore((s) => s.selected);
  const storeSet = useSelectionStore((s) => s.setSelected);

  const rowRefs = useRef(new Map<string, HTMLTableRowElement>());

  // Keep a small, focused set of columns for the table (user requested)
  const cols: Record<string, string> = {
    time: "Time (EST)",
    longitude: "Longitude",
    latitude: "Latitude",
    depth: "Depth (km)",
    mag: "Magnitude",
    place: "Place",
  };

  // Pagination state (client-side)
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(50);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(data.length / pageSize)),
    [data.length, pageSize]
  );

  // effectivePage clamps the current page into valid range without synchronous setState
  const effectivePage = Math.max(0, Math.min(page, totalPages - 1));

  // Compute rows for current page
  const pageRows = useMemo(() => {
    const start = effectivePage * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, effectivePage, pageSize]);

  // When selection changes, ensure the selected row is on the visible page — schedule page change asynchronously
  useEffect(() => {
    const selId = ctxSelected?.id ?? storeSelected?.id ?? null;
    if (!selId) return;
    const idx = data.findIndex((d) => d.id === selId);
    if (idx === -1) return;
    const selPage = Math.floor(idx / pageSize);
    if (selPage !== effectivePage) {
      // schedule update to avoid synchronous setState in effect
      setTimeout(() => setPage(selPage), 0);
    }
  }, [ctxSelected?.id, storeSelected?.id, data, pageSize, effectivePage]);

  // scroll into view when selection changes (chart -> table interaction)
  useEffect(() => {
    const id = ctxSelected?.id ?? storeSelected?.id ?? null;
    if (!id) return;
    const el = rowRefs.current.get(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // subtle highlight: focus
      el.focus({ preventScroll: true });
    }
  }, [ctxSelected?.id, storeSelected?.id]);

  const handleRowClick = (d: EarthquakeProperties) => {
    // props pattern
    onSelect?.(d);
    // context
    setSelected(d);
    // zustand
    storeSet(d);
  };

  // helper to format time strings into `Nov 15, 2025 09:03:25`
  function formatTime(value: unknown): string {
    if (!value && value !== 0) return "";
    const s = String(value);
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    // date part: Nov 15, 2025
    const datePart = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
    // time part: 09:03:25 (24-hour)
    const timePart = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
      .format(d)
      .replace(/,/g, "");

    return `${datePart} ${timePart}`;
  }

  return (
    <div className="data-panel" style={{ padding: 12, overflow: "auto" }}>
      {/* Pagination controls */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page <= 0}
        >
          Prev
        </button>
        <div>
          Page {effectivePage + 1} / {totalPages}
        </div>
        <button
          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
        <div style={{ marginLeft: "auto" }}>
          Rows per page:{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {Object.entries(cols).map(([c, label]) => (
              <th
                key={c}
                style={{
                  textAlign: "left",
                  padding: 6,
                  borderBottom: "1px solid #ddd",
                }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageRows.map((row) => (
            <tr
              key={row.id}
              tabIndex={-1}
              ref={(el) => {
                if (el) rowRefs.current.set(row.id, el);
                else rowRefs.current.delete(row.id);
              }}
              onClick={() => handleRowClick(row)}
              style={{
                background:
                  ctxSelected?.id === row.id || storeSelected?.id === row.id
                    ? "#e8f0fe"
                    : "transparent",
                cursor: "pointer",
              }}
            >
              {Object.entries(cols).map(([c]) => (
                <td
                  key={c}
                  style={{ padding: 6, borderBottom: "1px solid #f2f2f2" }}
                >
                  {c === "time"
                    ? formatTime(
                        (row as unknown as Record<string, unknown>)[c] ?? ""
                      )
                    : // numeric columns: show as numbers where possible
                      String(
                        (row as unknown as Record<string, unknown>)[c] ?? ""
                      )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataPanel;
