import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { MapContainer, TileLayer, Marker, useMapEvent } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import axios, { AxiosResponse } from 'axios'
import { api } from '../../services/api'
import logo from '../../assets/logo.svg'
import './styles.css'
import Dropzone from '../../components/drop-zone'

interface Item {
  id: string,
  title: string,
  image_url: string
}

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

type MapEventsHandlerProps = {
  handleMapClick: (event: LeafletMouseEvent) => void;
};

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

  const [inputData, setInputData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  })

  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<File>()

  const navigate = useNavigate()

  useEffect(() => {
    api.get('items').then((response: AxiosResponse) => {
      setItems(response.data.serializedItems)
    })
  }, [])

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla)

        setUfs(ufInitials)
      })
  }, [])

  useEffect(() => {
    if (selectedUf === '0') {
      return
    }
    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome)

        setCities(cityNames)
      })

  }, [selectedUf])

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

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value

    setSelectedUf(uf)
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value

    setSelectedCity(city)
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setInputData({ ...inputData, [name]: value })
  }

  function handleSelectItem(id: string) {
    const alreadySelected = selectedItems.findIndex(item => item === id)

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id)

      setSelectedItems(filteredItems)
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleMapClick = (event: LeafletMouseEvent) => {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])
  }

  const MapEventsHandler: React.FC<MapEventsHandlerProps> = ({ handleMapClick }) => {
    useMapEvent(
      'click', (event) => handleMapClick(event)
    )
    return null
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const { name, email, whatsapp } = inputData
    const uf = selectedUf
    const city = selectedCity
    const [latitude, longitude] = selectedPosition
    const itemsIds = selectedItems

    if (!name || !email || !whatsapp || uf === '0' || city === '0' || latitude === 0 || longitude === 0 || items.length === 0) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const data = new FormData()
    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    itemsIds.forEach(item => data.append('itemsIds[]', item));

    if (selectedFile) {
      data.append('image', selectedFile)
    }

    try {
      await api.post('points', data)
      alert('Ponto de coleta cadastrado')

      navigate(-1)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data)
        alert('Houve um erro ao cadastrar o ponto de coleta: ' + (error.response?.data.message || 'Erro desconhecido'))
      } else {
        console.error('Unexpected error:', error)
        alert('Ocorreu um erro inesperado')
      }
    }
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="recycling logo" />
        <Link to='/'>
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de Coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile} />


        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da Entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          <MapContainer center={initialPosition} zoom={15} >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEventsHandler handleMapClick={handleMapClick} />
            <Marker position={selectedPosition} />
          </MapContainer>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (uf)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectUf}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de Coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

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

        <button type="submit">Cadastrar Ponto de Coleta</button>
      </form>
    </div>
  )
}

export default CreatePoint

// 42