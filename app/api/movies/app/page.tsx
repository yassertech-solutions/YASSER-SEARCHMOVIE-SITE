
"use client";

import { useEffect, useState } from "react";
import "./globals.css";

const IMG = "https://image.tmdb.org/t/p/";

type Movie = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [category, setCategory] = useState("trending");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Movie | null>(null);
  const [trailer, setTrailer] = useState("");
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadMovies(q = "", cat = category) {
    setLoading(true);
    try {
      const params = q
        ? `q=${encodeURIComponent(q)}`
        : `category=${cat}`;
      const res = await fetch(`/api/movies?${params}`);
      const data = await res.json();
      setMovies(data.results || []);
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovies();
  }, []);

  async function openMovie(movie: Movie) {
    setSelected(movie);
    setTrailer("");

    const type = movie.media_type === "tv" ? "tv" : "movie";

    try {
      const res = await fetch(
        `/api/trailer?id=${movie.id}&type=${type}`
      );
      const data = await res.json();
      setTrailer(data.key || "");
    } catch {
      setTrailer("");
    }
  }

  const hero = movies.find(m => m.backdrop_path);

  return (
    <main>
      <audio
        id="site-music"
        src="https://files.catbox.moe/y1yt0e.mp3"
        loop
      />

      <header className="navbar">
        <div className="brand">
          <img src="https://files.catbox.moe/po3bwx.jpg" />
          <span>YASSER <b>MOVIES</b></span>
        </div>

        <nav>
          <button onClick={() => {
            setCategory("trending");
            setSearch("");
            loadMovies("", "trending");
          }}>Home</button>
          <button onClick={() => {
            setCategory("popular");
            setSearch("");
            loadMovies("", "popular");
          }}>Movies</button>
          <button onClick={() => {
            setCategory("series");
            setSearch("");
            loadMovies("", "series");
          }}>Series</button>
          <button onClick={() => {
            setCategory("top_rated");
            setSearch("");
            loadMovies("", "top_rated");
          }}>Top Rated</button>
        </nav>

        <button
          className="music"
          onClick={() => {
            const audio = document.getElementById(
              "site-music"
            ) as HTMLAudioElement;
            if (playing) audio.pause();
            else audio.play().catch(() => {});
            setPlaying(!playing);
          }}
        >
          {playing ? "Ⅱ MUSIC" : "▶ MUSIC"}
        </button>
      </header>

      <section className="hero"
        style={{
          backgroundImage: hero?.backdrop_path
            ? `linear-gradient(90deg,#080808 5%,transparent 100%),linear-gradient(0deg,#080808,transparent 65%),url(${IMG}original${hero.backdrop_path})`
            : undefined
        }}
      >
        <div className="hero-content">
          <span className="tag">WELCOME TO YASSER MOVIES</span>
          <h1>{hero?.title || hero?.name || "DISCOVER MOVIES"}</h1>
          <p>
            {hero?.overview ||
              "Discover movies, explore TV series and watch official trailers."}
          </p>
          {hero && (
            <button className="red-btn"
              onClick={() => openMovie(hero)}>
              ▶ VIEW DETAILS
            </button>
          )}
        </div>
      </section>

      <section className="content">
        <div className="search-box">
          <input
            placeholder="Search any movie or series..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") loadMovies(search);
            }}
          />
          <button onClick={() => loadMovies(search)}>SEARCH</button>
        </div>

        <div className="section-title">
          <h2>{search ? "SEARCH RESULTS" : category.replace("_", " ").toUpperCase()}</h2>
          <span>YASSER TECH SOLUTION</span>
        </div>

        {loading ? (
          <p className="message">Loading movies...</p>
        ) : (
          <div className="movie-grid">
            {movies.map(movie => (
              <button className="movie-card" key={movie.id}
                onClick={() => openMovie(movie)}>
                <div className="poster">
                  {movie.poster_path ? (
                    <img src={`${IMG}w500${movie.poster_path}`} />
                  ) : <span>NO POSTER</span>}
                  <span className="rating">
                    ★ {movie.vote_average?.toFixed(1)}
                  </span>
                </div>
                <strong>{movie.title || movie.name}</strong>
                <small>
                  {(movie.release_date || movie.first_air_date || "").slice(0, 4)}
                </small>
              </button>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="close"
              onClick={() => setSelected(null)}>✕</button>
            <h2>{selected.title || selected.name}</h2>
            <p>{selected.overview}</p>
            <p>⭐ {selected.vote_average?.toFixed(1)} / 10</p>
            {trailer ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailer}`}
                title="Official movie trailer"
                allowFullScreen
              />
            ) : (
              <p>Trailer haipatikani kwa sasa.</p>
            )}
          </div>
        </div>
      )}

      <footer>
        <p>© 2026 YASSER MOVIE SITE</p>
        <p>POWERED BY YASSER TECH SOLUTION</p>
        <p>CONTACT OWNER: +255 793 785 960</p>
        <a href="https://whatsapp.com/channel/0029VbD1QcaGk1FkH9XpvD3X"
          target="_blank" rel="noreferrer">
          JOIN OUR WHATSAPP CHANNEL
        </a>
      </footer>
    </main>
  );
}
