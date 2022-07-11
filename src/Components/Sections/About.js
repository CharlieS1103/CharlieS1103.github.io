//@ts-check

import React from "react";
import "../../styles/About.scss";
function About() {
  return (
    <div className="about">
      <div className="about-content">
        <div className="about-content-text">
          <h1>About</h1>
          <p>
            I am 16 years old and currently working on developing my skills and
            finding out what I enjoy. I often make things that I find useful for
            myself or others. I also develop things that I find fun, such as my
            Chess website.
          </p>
          <p>
            My web development skills are based on HTML, CSS, Typescript,
            JavaScript, React, and Node.js. I also have experience with Python
            and Java. In terms of databases, I have used MongoDB, Firebase, and
            Supabase. I am always looking to learn new things and find new tools
            in order to improve my skills and overall proficency.
          </p>
          <p>
            I enjoy working with people, dogs, chess, and music. I also am
            trying to get more into rock climbing. My favorite meal of the day
            is undoubetely dinner, and on occasion I enjoy cooking. I also enjoy
            reading and listening to music.
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
