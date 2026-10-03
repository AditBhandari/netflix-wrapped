
import re
from pathlib import Path
from collections import Counter
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
CATALOG_PATH = BASE_DIR / "data" / "netflix_titles.csv"
TITLE_GENRE_PATH = BASE_DIR / "data" / "title_genres.csv"


def get_series_name(title):
    if not isinstance(title, str):
        return None
    patterns = [
        r"^(.*?):\s*Season\s+\d+\b",
        r"^(.*?):\s*Limited Series:\s*",
        r"^(.*?):\s*Limited Series\s*$",
    ]
    for pattern in patterns:
        match = re.match(pattern, title, flags=re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return None


def _base_title(title):
    series = get_series_name(title)
    return series if series else str(title).strip()


def _load_catalog():
    if not CATALOG_PATH.exists():
        return None
    try:
        catalog = pd.read_csv(CATALOG_PATH)
        if "title" not in catalog.columns or "listed_in" not in catalog.columns:
            return None
        catalog["Match_Title"] = catalog["title"].astype(str).str.strip().str.lower()
        return catalog
    except Exception:
        return None


def _load_title_genres():
    if not TITLE_GENRE_PATH.exists():
        return {}
    try:
        data = pd.read_csv(TITLE_GENRE_PATH)
        return {
            str(row["title"]).strip().lower(): str(row["genres"]).strip()
            for _, row in data.iterrows()
            if pd.notna(row.get("title")) and pd.notna(row.get("genres"))
        }
    except Exception:
        return {}


def load_and_process_history(path):
    df = pd.read_csv(path)
    df.columns = [str(c).strip() for c in df.columns]

    title_col = next((c for c in df.columns if c.lower() == "title"), None)
    date_col = next((c for c in df.columns if c.lower() == "date"), None)
    if not title_col or not date_col:
        raise ValueError("CSV must contain Title and Date columns.")

    df = df[[title_col, date_col]].copy()
    df.columns = ["Title", "Date"]
    df["Title"] = df["Title"].astype(str).str.strip()
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df = df.dropna(subset=["Date"])
    df = df[df["Title"].ne("")].copy()

    df["Series"] = df["Title"].apply(get_series_name)
    df["Type"] = df["Series"].apply(lambda x: "TV Show" if pd.notna(x) else "Movie")
    df["Match_Title"] = df["Title"].apply(_base_title).str.lower()
    return df.reset_index(drop=True)


def get_summary(df):
    return {
        "total_records": int(len(df)),
        "unique_titles": int(df["Match_Title"].nunique()),
        "unique_viewing_days": int(df["Date"].dt.date.nunique()),
    }


def get_top_series(df, n=5):
    counts = df.loc[df["Type"] == "TV Show", "Series"].value_counts().head(n)
    return {str(k): int(v) for k, v in counts.items()}


def get_top_movies(df, n=5):
    counts = df.loc[df["Type"] == "Movie", "Match_Title"].value_counts().head(n)
    return {str(k): int(v) for k, v in counts.items()}


def get_viewing_by_day(df):
    order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    counts = df["Date"].dt.day_name().value_counts()
    return {day: int(counts.get(day, 0)) for day in order}


def get_viewing_by_month(df):
    counts = df["Date"].dt.to_period("M").astype(str).value_counts().sort_index()
    return {str(k): int(v) for k, v in counts.items()}


def get_streak_info(df):
    dates = sorted(set(df["Date"].dt.date))
    if not dates:
        return {"longest_streak": 0, "current_streak": 0}

    longest = current = 1
    for i in range(1, len(dates)):
        if (dates[i] - dates[i - 1]).days == 1:
            current += 1
        else:
            current = 1
        longest = max(longest, current)

    return {"longest_streak": int(longest), "current_streak": int(current)}


def get_genre_counts(df):
    catalog = _load_catalog()
    fallback = _load_title_genres()
    counts = Counter()

    for _, row in df.iterrows():
        title = str(row["Match_Title"])
        genres = None

        if catalog is not None:
            matches = catalog.loc[catalog["Match_Title"] == title, "listed_in"]
            if not matches.empty:
                genres = matches.iloc[0]

        if genres is None:
            genres = fallback.get(title)

        if genres:
            for genre in str(genres).split(","):
                genre = genre.strip()
                if genre:
                    counts[genre] += 1

    return dict(counts.most_common())


def get_insights(df):
    genre_counts = get_genre_counts(df)
    top_series = get_top_series(df, n=1)
    day_counts = get_viewing_by_day(df)
    streak_info = get_streak_info(df)
    total = len(df)
    movies = int((df["Type"] == "Movie").sum())
    tv_episodes = int((df["Type"] == "TV Show").sum())

    return {
        "favorite_genre": max(genre_counts, key=genre_counts.get) if genre_counts else "N/A",
        "most_watched_show": next(iter(top_series), "N/A"),
        "most_active_day": max(day_counts, key=day_counts.get) if day_counts else "N/A",
        "longest_streak": streak_info["longest_streak"],
        "movies_percentage": round((movies / total) * 100) if total else 0,
        "tv_percentage": round((tv_episodes / total) * 100) if total else 0,
    }


def get_binge_info(df):
    daily_counts = df["Date"].dt.date.value_counts().sort_values(ascending=False)
    if daily_counts.empty:
        return {"episodes": 0, "date": None}
    date = daily_counts.index[0]
    return {"episodes": int(daily_counts.iloc[0]), "date": str(date)}
