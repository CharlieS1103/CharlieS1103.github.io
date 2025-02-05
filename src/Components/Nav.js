import React, { useState } from 'react';
import "../styles/Nav.scss";
import { Link } from "react-router-dom";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="navigation">
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={isOpen ? 'open' : ''}>
        <li><Link to="#home">Home</Link></li>
        <li><Link to="#about">About</Link></li>
        <li><Link to="#projects">Projects</Link></li>
        <li><Link to="#contact">Contact</Link></li>
        <li><Link to="#/roommate-quiz">Roommate Quiz</Link></li>
      </ul>
    </div>
  );
}

export default Nav;