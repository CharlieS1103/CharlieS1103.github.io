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
      <li>
          <a href="#home">home</a>
        </li>
        <li>
          <a href="#about">about</a>
        </li>
        <li>
          <a href="#projects">projects</a>
        </li>
        <li>
          <a href="#contact">contact</a>
        </li>
      </ul>
    </div>
  );
}

export default Nav;