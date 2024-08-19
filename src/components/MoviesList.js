import Movie from "./Movie";
const MoviesList = (props) => {
  return (
    <ul>
      {props.movies.map((movie) => (
        <div>
          <Movie
            title={movie.title}
            releaseDate={movie.releaseDate}
            openingText={movie.openingText}
          />
          <button onClick={() => props.onDeleteMovie(movie.id)}>Delete</button>
        </div>
      ))}
    </ul>
  );
};

export default MoviesList;
