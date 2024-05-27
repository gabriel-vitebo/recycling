import React, { ChangeEvent, useEffect, useState } from "react";

import './styles.css'
import logo from '../../assets/logo.svg'
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

const FindPoint = () => {
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate();

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

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value

    setSelectedUf(uf)
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value

    setSelectedCity(city)
  }

  function createUrl() {

    const params = new URLSearchParams({
      city: selectedCity,
      uf: selectedUf
    })

    return `/view-points?${params.toString()}`
  }

  function handleSearchClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (selectedUf === '0' || selectedCity === '0') {
      event.preventDefault();
      setError("Por favor, selecione um estado e uma cidade.");
    } else {
      setError(null);
      navigate(createUrl());
    }
  }

  return (
    <div id="page-find-point">
      <div className="content">
        <header>
          <img src={logo} alt="Recycling Logo" />
          <Link to='/'>
            <FiArrowLeft />
            Voltar para home
          </Link>
        </header>

        <main>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
          <form>
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
          </form>
          {error && <p className="error">{error}</p>}
          <Link to={createUrl()} onClick={handleSearchClick} >
            <span>
              <FiSearch />
            </span>
            <strong>Procurar Ponto de Coleta</strong>
          </Link>
        </main>
      </div>
    </div>
  )
}

export default FindPoint
