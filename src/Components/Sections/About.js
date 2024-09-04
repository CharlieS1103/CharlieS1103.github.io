//@ts-check

import React from "react";
import "../../styles/About.scss";
function About() {
  return (
    <div className="about">
      <div className="about-content">
        <div className="about-content-text">
          <h1>About: </h1>
          <p>
              Enjoyer of outdoors, skiing, climbing, and working out.
          </p>
          <p>
            My web development skills are based on HTML, CSS, Typescript,
            JavaScript, React, and Node.js. I also have experience with Python
            and Java and have worked on a few projects in rust. I have used MongoDB, Firebase, and
            Supabase.
          </p>
          {/*Add my social links here*/}
          <div className="about-content-social">
            <a
              target="_blank"
              className="github-icon icon"
              href="https://github.com/CharlieS1103"
              rel="noreferrer"
            >
              <img
                src="https://img.icons8.com/color/48/000000/github.png"
                alt="Github icon"
              />
            </a>
            <a
              target="_blank"
              className="linkedin-icon icon"
              href="https://www.linkedin.com/in/charlie-simons-a16a78244/"
              rel="noreferrer"
            >
              <img
                src="https://img.icons8.com/color/48/000000/linkedin.png"
                alt="linkedin icon"
              />
            </a>
            <a
              target="_blank"
              className="spotify-icon icon"
              href="https://open.spotify.com/user/8vlbob5lfcsvsvt8uyic5ltkr"
              rel="noreferrer"
            >
              <img
                src="https://img.icons8.com/color/48/000000/spotify.png"
                alt="spotify icon"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default About;
