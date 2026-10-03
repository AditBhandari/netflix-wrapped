import "./Wrapped.css";

function Wrapped({
  summary,
  topSeries,
  insights,
  genres,
  binge,
  mostActiveDay,
  streak,
}) {
  const series = Object.entries(topSeries || {});
  const genreList = Object.entries(genres || {});

  const totalTitles = summary?.total_records || 0;
  const viewingDays = summary?.unique_viewing_days || 0;

  const topShow = series[0]?.[0] || "N/A";
  const topShowCount = series[0]?.[1] || 0;

  const favoriteGenre = insights?.favorite_genre || "N/A";
  const bingeEpisodes = binge?.episodes || 0;
  const bingeDate = binge?.date || "N/A";

  const activeDay = mostActiveDay?.day || "N/A";
  const activeDayCount = mostActiveDay?.count || 0;

  const longestStreak = streak?.longest_streak || 0;

  const moviePercentage = insights?.movies_percentage || 0;
  const tvPercentage = insights?.tv_percentage || 0;

  return (
    <main className="wrapped">

      {/* ==================================================
          01 — INTRO
         ================================================== */}
      <section className="wrapped-screen screen-intro">
        <div className="intro-content">
          <h1>
            NETFLIX
            <br />
            WRAPPED
          </h1>

          <p className="intro-subtitle">
            Your Year In Streaming
          </p>

          <img
            className="intro-dots"
            src="/wrapped/screen1-dots.png"
            alt=""
            aria-hidden="true"
          />
        </div>
      </section>


      {/* ==================================================
          02 — YOUR YEAR
         ================================================== */}
      <section className="wrapped-screen screen-dark screen-year">
        <img
          className="pixel-wave pixel-wave-year"
          src="/wrapped/screen2-pixel-wave.png"
          alt=""
          aria-hidden="true"
        />

        <div className="screen-content year-content">
          <h2 className="screen-heading">
            YOU WATCHED...
          </h2>

          <div className="year-stat">
            <strong>{totalTitles}</strong>
            <span>TITLES</span>
          </div>

          <p className="red-subtitle">
            ACROSS {viewingDays} DAYS
          </p>
        </div>

        <span className="screen-number">02</span>
      </section>


      {/* ==================================================
          03 — #1 SHOW
         ================================================== */}
      <section className="wrapped-screen screen-dark screen-show">
<div className="screen-content show-content">
          <h2 className="screen-heading">
            YOUR #1 SHOW
          </h2>

          <div className="hero-stat">
            <strong>{topShow}</strong>
            <span>{topShowCount} EPISODES</span>
          </div>

          <div className="ranking">
            {series.slice(1, 5).map(([title, count], index) => (
              <div className="ranking-row" key={title}>
                <span className="ranking-title">
                  {index + 2}. {title}
                </span>

                <span className="ranking-count">
                  {count} EP
                </span>
              </div>
            ))}
          </div>
        </div>

        <span className="screen-number">03</span>
      </section>


      {/* ==================================================
          04 — FAVORITE GENRE
         ================================================== */}
      <section className="wrapped-screen screen-dark screen-genre">
        <div className="screen-content genre-content">
          <h2 className="screen-heading">
            YOUR FAVORITE GENRE
          </h2>

          <div className="hero-stat genre-stat">
            <strong>{favoriteGenre}</strong>
            <span>
              {genreList.length > 0 ? genreList[0][1] : 0} WATCHES
            </span>
          </div>

          <div className="ranking">
            {genreList.slice(1, 5).map(([genre, count], index) => (
              <div className="ranking-row" key={genre}>
                <span className="ranking-title">
                  {index + 2}. {genre}
                </span>

                <span className="ranking-count">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <span className="screen-number">04</span>
      </section>


      {/* ==================================================
          05 — BIGGEST BINGE
         ================================================== */}
      <section className="wrapped-screen screen-red screen-binge">
        <div className="red-art red-art-binge" />

        <div className="screen-content centered-content">
          <h2 className="screen-heading dark-heading">
            YOUR BIGGEST BINGE
          </h2>

          <div className="big-number">
            {bingeEpisodes}
          </div>

          <p className="dark-subtitle">
            EPISODES IN ONE DAY
          </p>

          <p className="binge-date">
            {bingeDate}
          </p>
        </div>

        <span className="screen-number dark-number">05</span>
      </section>


      {/* ==================================================
          06 — YOUR NETFLIX DAY
         ================================================== */}
      <section className="wrapped-screen screen-dark screen-day">
        <div className="screen-content day-content">
          <h2 className="screen-heading">
            YOUR NETFLIX DAY
          </h2>

          <div className="hero-stat">
            <strong>{activeDay}</strong>
            <span>{activeDayCount} VIEWING RECORDS</span>
          </div>

          <p className="red-subtitle">
            THAT'S WHEN YOU WATCHED THE MOST.
          </p>
        </div>

        <span className="screen-number">06</span>
      </section>


      {/* ==================================================
          07 — LONGEST STREAK
         ================================================== */}
      <section className="wrapped-screen screen-red screen-streak">
        <div className="red-art red-art-streak" />

        <div className="screen-content centered-content">
          <h2 className="screen-heading dark-heading">
            YOUR LONGEST STREAK
          </h2>

          <div className="big-number">
            {longestStreak}
          </div>

          <p className="dark-subtitle">
            DAYS IN A ROW
          </p>
        </div>

        <span className="screen-number dark-number">07</span>
      </section>


      {/* ==================================================
          08 — NETFLIX PROFILE
         ================================================== */}
      <section className="wrapped-screen screen-dark screen-profile">
        <div className="screen-content profile-content">
          <h2 className="screen-heading">
            YOUR NETFLIX<br />
            PROFILE
          </h2>

          <div className="profile-stats">
            <div>
              <span>FAVORITE GENRE</span>
              <strong>{favoriteGenre}</strong>
            </div>

            <div>
              <span>MOST-WATCHED SHOW</span>
              <strong>{insights?.most_watched_show || topShow}</strong>
            </div>

            <div>
              <span>MOVIES</span>
              <strong>{moviePercentage}%</strong>
            </div>

            <div>
              <span>TV</span>
              <strong>{tvPercentage}%</strong>
            </div>
          </div>
        </div>

        <span className="screen-number">08</span>
      </section>


      {/* ==================================================
          09 — ENDING
         ================================================== */}
      <section className="wrapped-screen screen-red screen-ending">
        <div className="screen-content ending-content">
          <h2 className="ending-title">
            THAT'S A
            <br />
            WRAP.
          </h2>

          <p className="dark-subtitle">
            SEE YOU NEXT YEAR.
          </p>
        </div>
      </section>

    </main>
  );
}

export default Wrapped;
