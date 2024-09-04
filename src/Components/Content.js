//@ts-check

import React from "react";
import Nav from "./Nav.js";
import { Projects, About, Home } from "./Sections/index.js";
function Content() {
  return (
    <>
      <div className="scrolls">
        <div className="up">
          <span>↑</span>
          <div className="center">
            <span>mouse scrolling</span>
          </div>
        </div>
        <div className="down">
          <span>↓</span>
        </div>
      </div>
      <div className="smooth">
        <Nav></Nav>
        <section id="home">
          <Home></Home>
        </section>
        <section id="about">
          <About></About>
        </section>
        <section id="projects">
          <Projects></Projects>
        </section>
        <section id="contact">
          <h2>charliejsimons@gmail.com<br></br> OR <br></br> csimons4@uvm.edu</h2>
        </section>
      </div>
    </>
  );
}
export default Content;
