import React from "react";
import { FiLogIn, FiSearch } from 'react-icons/fi'
import { Link } from "react-router-dom";

import './styles.css'

import logo from '../../assets/logo.svg'

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Recycling Logo" />
        </header>

        <main>
          <h1>O melhor lugar para encontrar <br /> coleta de resíduos.</h1>
          <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

          <Link to="/create-point">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastre um ponto de coleta</strong>
          </Link>
          <Link to="/find-point">
            <span>
              <FiSearch />
            </span>
            <strong>Encontre um ponto de coleta</strong>
          </Link>
        </main>
      </div>
    </div>
  )
}

export default Home