import React, { useState, useRef, useEffect, useCallback } from "react";
import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [retrying, setRetrying] = useState(false);
  const retryIntervalRef = useRef(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRetrying(false);
    try {
      const response = await fetch(
        "https://react-http-91c04-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong... Retrying");
      }
      const data = await response.json();
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);
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
  }, [retrying]);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-http-91c04-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    fetchMoviesHandler();
  }
  async function deleteMovieHandler(movieId) {
    try {
      const response = await fetch(
        `https://react-http-91c04-default-rtdb.firebaseio.com/movies/${movieId}.json`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the movie.");
      }

      // Update the movies state after deleting the movie
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId)
      );
    } catch (err) {
      setError(err.message);
    }
  }
  function cancelRetryHandler() {
    clearInterval(retryIntervalRef.current);
    setRetrying(false);
    setError("Retrying cancelled.");
  }

  let content = <p>Found no movies!</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />;
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
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
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
