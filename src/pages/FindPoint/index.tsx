import React from "react";

import './styles.css'
import logo from '../../assets/logo.svg'
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const FindPoint = () => {

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
          <Link to='/view-points'>
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
