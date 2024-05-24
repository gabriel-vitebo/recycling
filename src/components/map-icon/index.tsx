import React from "react";
import { Link } from "react-router-dom";

interface Props {
  image: string
  title: string
}

const MapIcon: React.FC<Props> = ({ image, title }) => {
  return (
    <Link to='/details' id="map-icon-container">
      <img src={image} alt={`Imagem do ponto do coleta do ${title}`} />
      <h2>{title}</h2>
    </Link>
  )
}

export default MapIcon