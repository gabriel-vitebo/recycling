import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import logo from '../../assets/logo.svg'
import loadingLogo from '../../assets/loading-logo.svg'


import './styles.css'
import { api } from '../../services/api'
import { AxiosResponse } from 'axios'
import MapIcon from '../../components/map-icon'

interface Item {
  id: string,
  title: string,
  image_url: string
}

interface Point {
  id: string,
  image: string,
  name: string,
  latitude: number,
  longitude: number,
}


const ViewPoints = () => {
  const [items, setItems] = useState<Item[]>([])
  const [points, setPoints] = useState<Point[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])


  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('items').then((response: AxiosResponse) => {
      setItems(response.data.serializedItems)
    })
  }, [])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setInitialPosition([latitude, longitude])
        setIsLoading(false)
      },
      (error) => {
        console.error("Erro ao obter a localização: ", error)
        setInitialPosition([-23.1799079, -45.8253392])
        setIsLoading(false)
      }
    )
  }, [])

  useEffect(() => {
    api.get('points', {
      params: {
        city: 'São José dos Campos',
        uf: 'SP',
        items: 'Pilhas e Baterias, Resíduos Eletrônicos'
      }
    }).then(response => {
      console.log(response.data.recyclingPoint)
      setPoints(response.data.recyclingPoint)
    })
  }, [])
  console.log(points)

  function handleSelectItem(id: string) {
    const alreadySelected = selectedItems.findIndex(item => item === id)

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id)

      setSelectedItems(filteredItems)
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  if (isLoading) {
    return (
      <div className='loadingLogo'>
        <img src={loadingLogo} alt="Logo do Recycling" />
        <span>Carregando app...</span>
      </div>
    )
  }


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
          <MapContainer center={initialPosition} zoom={15} >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
              points.map((point) => (
                <Marker
                  key={point.id}
                  position={[point.latitude, point.longitude]}
                >
                  <Popup>
                    <MapIcon image={point.image} title={point.name} />
                  </Popup>
                </Marker>
              ))
            }
          </MapContainer>
        </fieldset>

        <fieldset>
          <ul className='items-grid'>
            {items.map(item => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
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