import "./UploadScreen.css";

function UploadScreen({
  selectedFile,
  uploadMessage,
  uploadError,
  handleFileChange,
  handleUpload,
}) {
  return (
    <main className="upload-screen">
      <div className="upload-screen-content">

        <h1 className="upload-title">
          NETFLIX
          <br />
          WRAPPED
        </h1>

        <p className="upload-subtitle">
          Your Year In Streaming
        </p>

        <div className="upload-control">

          <input
            id="netflix-file"
            className="upload-file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />

          <label
            htmlFor="netflix-file"
            className={`upload-file-label ${
              selectedFile ? "has-file" : ""
            }`}
          >
            <span className="upload-file-label-main">
              {selectedFile
                ? selectedFile.name
                : "CHOOSE YOUR NETFLIX CSV"}
            </span>

            {!selectedFile && (
              <span className="upload-file-label-small">
                NETFLIX VIEWING HISTORY
              </span>
            )}
          </label>

          <button
            type="button"
            className="upload-generate-button"
            onClick={handleUpload}
          >
            GENERATE WRAPPED
          </button>

        </div>

        {uploadMessage && (
          <p className="upload-status upload-success">
            {uploadMessage}
          </p>
        )}

        {uploadError && (
          <p className="upload-status upload-error">
            {uploadError}
          </p>
        )}

      </div>
    </main>
  );
}

export default UploadScreen;
