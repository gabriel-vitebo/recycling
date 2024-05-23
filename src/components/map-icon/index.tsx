import React from "react";

interface Props {
  image: string
  title: string
}

const MapIcon: React.FC<Props> = ({ image, title }) => {
  return (
    <div id="map-icon-container">
      <img src={image} alt={`Imagem do ponto do coleta do ${title}`} />
      <h2>{title}</h2>
    </div>
  )
}

export default MapIcon