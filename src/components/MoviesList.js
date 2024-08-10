import Movie from "./Movie";
const MoviesList = (props) => {
  return (
    <ul>
      {props.movies.map((movie) => (
        <Movie
          title={movie.title}
          releaseDate={movie.release}
          openingText={movie.openingText}
        />
      ))}
    </ul>
  );
};

export default MoviesList;
