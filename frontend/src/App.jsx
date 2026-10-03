import { useCallback, useEffect, useState } from "react";
import Wrapped from "./components/Wrapped";
import UploadScreen from "./components/UploadScreen";

const API_URL =
  import.meta.env.VITE_API_URL || "https://netflix-wrapped.onrender.com";
function App() {
  const [summary, setSummary] = useState(null);
  const [topSeries, setTopSeries] = useState({});
  const [genres, setGenres] = useState({});
  const [streak, setStreak] = useState(null);
  const [insights, setInsights] = useState(null);
  const [binge, setBinge] = useState(null);
  const [viewingByDay, setViewingByDay] = useState({});

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  const [sessionId] = useState(() => {
    let id = localStorage.getItem("netflix_session_id");

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("netflix_session_id", id);
    }

    return id;
  });

  const apiUrl = useCallback(
    (endpoint) =>
      `${API_URL}${endpoint}?session_id=${encodeURIComponent(sessionId)}`,
    [sessionId]
  );

  const fetchJson = async (endpoint) => {
    const response = await fetch(apiUrl(endpoint));

    if (!response.ok) {
      throw new Error("No analysis found.");
    }

    return response.json();
  };

  const fetchWrappedData = useCallback(async () => {
    try {
      const [
        summaryData,
        topSeriesData,
        genresData,
        viewingByDayData,
        streakData,
        insightsData,
        bingeData,
      ] = await Promise.all([
        fetchJson("/api/summary"),
        fetchJson("/api/top-series"),
        fetchJson("/api/genres"),
        fetchJson("/api/viewing-by-day"),
        fetchJson("/api/streak"),
        fetchJson("/api/insights"),
        fetchJson("/api/binge"),
      ]);

      setSummary(summaryData);
      setTopSeries(topSeriesData);
      setGenres(genresData);
      setViewingByDay(viewingByDayData);
      setStreak(streakData);
      setInsights(insightsData);
      setBinge(bingeData);
    } catch {
      // No uploaded dataset yet: stay on the upload screen.
      setSummary(null);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchWrappedData();
  }, [fetchWrappedData]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setUploadMessage("");
    setUploadError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploadMessage("Analyzing...");
      setUploadError("");

      const response = await fetch(
        `${API_URL}/api/upload?session_id=${encodeURIComponent(sessionId)}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed.");
      }

      setSelectedFile(null);
      setUploadMessage("");

      await fetchWrappedData();
    } catch (error) {
      setUploadMessage("");
      setUploadError(error.message);
    }
  };

  const mostActiveDay = Object.entries(viewingByDay).reduce(
    (max, [day, count]) =>
      count > max.count ? { day, count } : max,
    { day: "", count: 0 }
  );

  return (
    <>
      {!summary ? (
        <UploadScreen
          selectedFile={selectedFile}
          uploadMessage={uploadMessage}
          uploadError={uploadError}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
        />
      ) : (
        <Wrapped
          summary={summary}
          topSeries={topSeries}
          insights={insights}
          genres={genres}
          binge={binge}
          mostActiveDay={mostActiveDay}
          streak={streak}
        />
      )}
    </>
  );
}

export default App;
