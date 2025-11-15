import { useMemo, useState } from "react";
import type { FC } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { EarthquakeProperties } from "../types/earthquake";
import { useSelectedContext } from "../context/SelectedContext";
import useSelectionStore from "../stores/selectionStore";

type Props = {
  data: EarthquakeProperties[];
  // optional callbacks to demonstrate props pattern
  onSelect?: (e: EarthquakeProperties | null) => void;
};

const numericKeys: Array<keyof EarthquakeProperties> = [
  "latitude",
  "longitude",
  "depth",
  "mag",
  "nst",
  "gap",
  "dmin",
  "rms",
  "horizontalError",
  "depthError",
  "magError",
  "magNst",
];

const ChartPanel: FC<Props> = ({ data, onSelect }) => {
  // Local state for axis selection (props pattern demo)
  const [xKey, setXKey] = useState<keyof EarthquakeProperties>("longitude");
  const [yKey, setYKey] = useState<keyof EarthquakeProperties>("latitude");

  // Context + Zustand (shared state demos)
  const { selected: ctxSelected, setSelected: ctxSetSelected } =
    useSelectedContext();
  const storeSelected = useSelectionStore((s) => s.selected);
  const storeSet = useSelectionStore((s) => s.setSelected);

  // derived points for the chart
  const points = useMemo(
    () =>
      data.map((d) => ({
        x: Number(d[xKey]) || 0,
        y: Number(d[yKey]) || 0,
        id: d.id,
        place: d.place,
        mag: d.mag,
        raw: d,
      })),
    [data, xKey, yKey]
  );

  const handlePointClick = (p?: { raw?: EarthquakeProperties } | null) => {
    const quake: EarthquakeProperties | null = (p && p.raw) ?? null;
    // props pattern
    onSelect?.(quake);
    // context pattern
    ctxSetSelected(quake);
    // zustand pattern
    storeSet(quake);
  };

  return (
    <div className="chart-panel" style={{ padding: 12 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <label>
          X:
          <select
            value={String(xKey)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setXKey(e.target.value as keyof EarthquakeProperties)
            }
          >
            {numericKeys.map((k) => (
              <option key={String(k)} value={String(k)}>
                {String(k)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Y:
          <select
            value={String(yKey)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setYKey(e.target.value as keyof EarthquakeProperties)
            }
          >
            {numericKeys.map((k) => (
              <option key={String(k)} value={String(k)}>
                {String(k)}
              </option>
            ))}
          </select>
        </label>
        <div style={{ marginLeft: "auto", alignSelf: "center" }}>
          Selected ID: {ctxSelected?.id ?? storeSelected?.id ?? "—"}
        </div>
      </div>

      <div style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name={String(xKey)} />
            <YAxis type="number" dataKey="y" name={String(yKey)} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value: unknown, name: unknown, props: unknown) => {
                // show mag and place when available
                if (props && typeof props === "object") {
                  const p = props as { payload?: { id?: string } };
                  if (p.payload && p.payload.id)
                    return [`id: ${p.payload.id}`, ""];
                }
                return [String(value), String(name)];
              }}
            />
            <Scatter
              data={points}
              fill="#1976d2"
              onClick={(e) => handlePointClick(e?.payload ?? null)}
              onMouseEnter={() => {}}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartPanel;
