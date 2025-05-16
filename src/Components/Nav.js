import React, { useState } from 'react';
import "../styles/Nav.scss";
/*import { Link } from "react-router-dom";
import SignupModal from './SignupModal';*/

function Nav() {
  /*
 
  const [isSignupOpen, setSignupOpen] = useState(false);


  const openSignup = () => setSignupOpen(true);
  const closeSignup = () => setSignupOpen(false);
*/
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
        <li>
          <a href="#poem">poem</a>
        </li>
       {/* <li>
          <a href="#essays">essays</a>
        </li> */}

       {/* <li>
          <button className="nav-btn" onClick={openSignup}>signup</button>
        </li> */}

      </ul>
     {/* <SignupModal isOpen={isSignupOpen} onClose={closeSignup} /> */}
    </div>
  );
}

export default Nav;