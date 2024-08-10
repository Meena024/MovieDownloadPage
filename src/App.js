import React, { useState, useRef } from "react";
import MoviesList from "./components/MoviesList";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const retryIntervalRef = useRef(null);

  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);
    setRetrying(false);
    try {
      const response = await fetch("https://swapi.dev/api/film/");
      if (!response.ok) {
        throw new Error("Something went wrong... Retrying");
      }
      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
      setIsLoading(false);
      clearInterval(retryIntervalRef.current);
    } catch (err) {
      setError(err.message);
      if (!retrying) {
        setRetrying(true);
        retryIntervalRef.current = setInterval(fetchMoviesHandler, 5000);
      }
      setIsLoading(false);
    }
  }

  function cancelRetryHandler() {
    clearInterval(retryIntervalRef.current);
    setRetrying(false);
    setError("Retrying cancelled.");
  }

  let content = <p>Found no movies!</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = (
      <div>
        <p>{error}</p>
        {retrying && <button onClick={cancelRetryHandler}>Cancel Retry</button>}
      </div>
    );
  }

  if (isLoading) {
    content = <p>Loading... </p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} disabled={retrying}>
          Fetch Movies
        </button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
