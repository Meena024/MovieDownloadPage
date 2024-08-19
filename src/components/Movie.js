import React from "react";
const Movie = (props) => {
  return (
    <li>
      <h2>{props.title}</h2>
      <p> {props.openingText} </p>
      <h3> {props.releaseDate} </h3>
    </li>
  );
};

export default Movie;
