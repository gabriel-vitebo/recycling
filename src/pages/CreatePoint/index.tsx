import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

import './styles.css'

import logo from '../../assets/logo.svg'

const CreatePoint = () => {

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="recycling logo" />
        <Link to='/'>
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form >
        <h1>Cadastro do <br /> ponto de Coleta</h1>
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
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
              />
            </div>
            <div className="field">
              <label htmlFor="Whatsapp">Whatsapp</label>
              <input
                type="text"
                name="Whatsapp"
                id="Whatsapp"
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <MapContainer bounds={[-23.1798188, -45.8257099]} boundsOptions={15}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[-23.1798188, -45.8257099]} />
          </MapContainer>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (uf)</label>
              <select name="uf" id="uf">
                <option value="0">Selecione uma UF</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city">
                <option value="0">Selecione uma cidade</option>
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
            <li className="selected">
              <img src="http://localhost:3333/uploads/lampadas.svg" alt="teste" />
              <span>Óleo de Cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/lampadas.svg" alt="teste" />
              <span>Óleo de Cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/lampadas.svg" alt="teste" />
              <span>Óleo de Cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/lampadas.svg" alt="teste" />
              <span>Óleo de Cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/lampadas.svg" alt="teste" />
              <span>Óleo de Cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/lampadas.svg" alt="teste" />
              <span>Óleo de Cozinha</span>
            </li>
          </ul>
        </fieldset>

        <button type="submit">Cadastrar Ponto de Coleta</button>
      </form>
    </div>
  )
}

export default CreatePoint

