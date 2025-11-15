import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import fetchEarthquakes from "./services/fetchEarthquakes";
import type { EarthquakeProperties } from "./types/earthquake";
import ChartPanel from "./components/ChartPanel";
import DataPanel from "./components/DataPanel";
import { SelectedProvider } from "./context/SelectedContext";
import Loading from "./components/Loading";
import EventDetails from "./components/EventDetails";

export default function App() {
  const DATA_URL_DAY =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv";
  const DATA_URL_MONTH =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv";

  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "month" | null>(
    null
  );
  const DATA_URL = selectedPeriod === "day" ? DATA_URL_DAY : DATA_URL_MONTH;

  const { data, isLoading, error } = useQuery<EarthquakeProperties[], Error>({
    queryKey: ["earthquakes", DATA_URL],
    queryFn: () => fetchEarthquakes(DATA_URL),
    enabled: selectedPeriod !== null,
  });

  return (
    <SelectedProvider>
      {/* Period Selection Overlay */}
      {selectedPeriod === null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: "16px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.8)",
              maxWidth: "500px",
              width: "90%",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.8rem" }}>
              Earthquake Data
            </h2>
            <p style={{ color: "#888", marginBottom: "2rem" }}>
              Select the time period for earthquake data
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setSelectedPeriod("day")}
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1.1rem",
                  borderRadius: "10px",
                  backgroundColor: "#646cff",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  minWidth: "150px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#535bf2";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#646cff";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Last Day
              </button>
              <button
                onClick={() => setSelectedPeriod("month")}
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1.1rem",
                  borderRadius: "10px",
                  backgroundColor: "#646cff",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  minWidth: "150px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#535bf2";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#646cff";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Last Month
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {selectedPeriod !== null && isLoading && <Loading />}

      {/* Error State */}
      {selectedPeriod !== null && (error || !data) && (
        <div className="">Error loading data</div>
      )}

      {/* Main Content */}
      {selectedPeriod !== null && data && (
        <div className="app-shell w-full">
          <div id="root">
            <div className="layout">
              <div className="panel data-panel">
                <div className="panel-header">
                  <div className="panel-title flex justify-center gap-2">
                    <p>Earthquake Chart</p>
                  </div>
                </div>
                <div className="panel-body">
                  <ChartPanel data={data ?? []} />
                </div>
              </div>

              <div className="panel data-panel">
                <div className="panel-header">
                  <EventDetails />
                  <div className="panel-title">Data Table</div>
                  <div className="muted">{data?.length ?? 0} records</div>
                </div>
                <div className="panel-body">
                  <DataPanel data={data ?? []} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SelectedProvider>
  );
}
