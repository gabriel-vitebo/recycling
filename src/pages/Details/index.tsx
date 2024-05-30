import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import { api } from '../../services/api'

import { Link, useParams } from "react-router-dom";

import logo from '../../assets/logo.svg'
import './styles.css'

interface Data {
  recyclingPoint: {
    image: string,
    name: string,
    email: string,
    whatsapp: string,
    city: string,
    uf: string,
  },
  items: {
    title: string,
    image_url: string
  }[]
}

const Details = () => {
  const { id } = useParams<{ id: string }>()

  const [data, setData] = useState<Data>({} as Data)

  useEffect(() => {
    api.get(`points/${id}`).then(response => {
      setData(response.data)
    })
  }, [id])

  function handleSendEmail(recipient: string, subject: string) {
    window.open(`mailto:${recipient}?subject=${encodeURIComponent(subject)}`, '_blank')
  }

  function handleWathsapp() {
    window.open(`whatsapp://send?phone=${data.recyclingPoint.whatsapp}`, '_blank')
  }

  if (!data.recyclingPoint) {
    return <div>Carregando...</div>;
  }

  return (
    <div id="page-details">
      <div className="content">
        <header>
          <img src={logo} alt="Recycling Logo" />
          <Link to='/view-point'>
            <FiArrowLeft />
            Voltar para home
          </Link>
        </header>
        <main>
          <img src={data.recyclingPoint.image} alt={`Imagem do ponto de coleta ${data.recyclingPoint.name}`} />
          <h1>{data.recyclingPoint.name}</h1>
          <ul className='items-grid'>
            {data.items.map(item => (
              <li
                key={item.title}
              >
                <img src={item.image_url} alt={`Imagem do item ${item.title}`} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
          <div className="address">
            <h2>Endereço</h2>
            <p>{`${data.recyclingPoint.city}, ${data.recyclingPoint.uf}`}</p>
          </div>
          <div className="buttons">
            <button onClick={() => handleWathsapp()}>
              <span>
                <FaWhatsapp />
              </span>
              <strong>Whatsapp</strong>
            </button>
            <button onClick={() => handleSendEmail(
              data.recyclingPoint.email,
              `Interesse na coleta no ponto ${data.recyclingPoint.name}`
            )}>
              <span>
                <TfiEmail />
              </span>
              <strong>Email</strong>
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Details
