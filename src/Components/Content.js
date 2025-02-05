// filepath: /Users/charliesimons/Documents/GitHub/spicetify/CharlieS1103.github.io/src/Components/Content.js
//@ts-check

import React from "react";
import Nav from "./Nav.js";
import { Projects, About, Home, Contact, RoommateQuiz } from "./Sections/index.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function Content() {
  return (
    <Router>
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
        <Routes>
          <Route path="/" element={
            <>
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
                <Contact></Contact>
              </section>
            </>
          } />
          <Route path="/roommate-quiz" element={<RoommateQuiz />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Content;