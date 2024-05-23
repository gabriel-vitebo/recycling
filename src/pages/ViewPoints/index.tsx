import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import logo from '../../assets/logo.svg'

import './styles.css'
import { api } from '../../services/api'
import { AxiosResponse } from 'axios'
import MapIcon from '../../components/map-icon'

interface Item {
  id: string,
  title: string,
  image_url: string
}


const ViewPoints = () => {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    api.get('items').then((response: AxiosResponse) => {
      setItems(response.data.serializedItems)
    })
  }, [])

  return (
    <div id="page-view-points">
      <header>
        <img src={logo} alt="recycling logo" />
        <Link to='/'>
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form>
        <h1>Bem-Vindo</h1>
        <p>Encontre no mapa um ponto de coleta.</p>

        <fieldset>
          <MapContainer center={[-23.1799079, -45.8253392]} zoom={15} >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[-23.1799079, -45.8253392]}>
              <Popup>
                <MapIcon image={`http://localhost:3333/uploads/03ec7add4560ce570629-profile-png.png`} title={'Casa do Biel'} />
              </Popup>
            </Marker>
          </MapContainer>
        </fieldset>

        <fieldset>
          <ul className='items-grid'>
            {items.map(item => (
              <li key={item.id} >
                <img src={item.image_url} alt={`Imagem do item ${item.title}`} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
      </form>
    </div>
  )
}

export default ViewPoints