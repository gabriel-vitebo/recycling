import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";

import { Link } from "react-router-dom";

import logo from '../../assets/logo.svg'
import './styles.css'

const Details = () => {
  return (
    <div id="page-details">
      <div className="content">
        <header>
          <img src={logo} alt="Recycling Logo" />
          <Link to='/'>
            <FiArrowLeft />
            Voltar para home
          </Link>
        </header>
        <main>
          <img src="http://localhost:3333/uploads/03ec7add4560ce570629-profile-png.png" alt="" />
          <h1>Casa do Biel</h1>
          <ul className='items-grid'>
            <li>
              <img src={'imagefake'} alt={`Imagem do item `} />
              <span>Exemplo</span>
            </li>
            <li>
              <img src={'imagefake'} alt={`Imagem do item `} />
              <span>Exemplo</span>
            </li>
          </ul>
          <div className="address">
            <h2>Endereço</h2>
            <p>São Jose dos Campos, São Paulo</p>
          </div>
          <div className="buttons">
            <Link to='/view-points'>
              <span>
                <FaWhatsapp />
              </span>
              <strong>Whatsapp</strong>
            </Link>
            <Link to='/view-points'>
              <span>
                <TfiEmail />
              </span>
              <strong>Email</strong>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Details
