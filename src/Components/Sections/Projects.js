//@ts-check

import "../../styles/Projects.scss";
import { React, useState } from "react";
function Projects() {
  const [count, setCount] = useState(0);
  const projects = [
    {
      name: "Chaos Chess",
      description:
        "A chess game with a twist. Many different custom gamemodes are available.",
      image: "https://i.imgur.com/Sq17jFd.png",
      link: "https://github.com/CharlieS1103/ChaosChess",
      statement:
        "I made this project as a way to learn how to integrate a full website with both a backend and a frontend. It was also inspired by my interest in chess, and served as a playground for my own original gamemodes. It obviously has no practical use, and the UI has a lot of room to grow, but it was a fun project to make.",
    },
    {
      name: "Spicetify Marketplace",
      description:
        "A marketplace for Spicetify users to install and manage themes and extensions using inline-linking",
      image: "https://i.imgur.com/Ev9dXvx.png",
      link: "https://github.com/Spicetify/spicetify-marketplace",
      statement:
        "This project was the result of a need for a marketplace within Spicetify. Beforehand, users would have to download themes and/or extensions and manually edit the config file, which is a pain. It serves as a user interface for installation, in addition, it has able to work around the limitations of not being able to interact with the Filesystem, hence the use of inline-linking to serve extensions and themes.",
    },
    {
      name: "Hide Streaming Controls",
      description:
        "A Chrome extension that hides the streaming controls on various streaming platforms.",
      image: "https://i.imgur.com/eCJC7Dl.png",
      link: "https://github.com/CharlieS1103/hide-streaming-controls",
      statement:
        "Although this project was not the most complicated to make, it serves a huge practical purpose for me, as I dislike having the streaming controls blind me whenever I move my mouse.",
    },
  ];
  return (
    <div className="projects-container">
      <div className="projects-button-container">
        <button
          className="project-increment"
          onClick={() => increment(projects, setCount, count)}
        >
          +
        </button>
        <button
          className="project-deincrement"
          onClick={() => deincrement(projects, setCount, count)}
        >
          -
        </button>
      </div>
      <div className="project">
        <div className="project-info">
          <a href={projects[count].link} target="_blank" rel="noreferrer">
            {projects[count].name}
          </a>
          <p>“{projects[count].description}”</p>
        </div>
        <div className="project-statement">
          <p>{projects[count].statement}</p>
        </div>
        <div className="project-image">
          <img
            className="project-preview"
            src={projects[count].image}
            alt={projects[count].name}
          />
        </div>
      </div>
    </div>
  );
}
function increment(projects, setCount, count) {
  // Set the count as long as it is less than the length of the projects array

  if (count < projects.length - 1) {
    setCount(count + 1);
  } // Back to position 0 if the count is equal to the length of the projects array
  else if (count === projects.length - 1) {
    setCount(0);
  }
}
function deincrement(projects, setCount, count) {
  // Set the count as long as it is greater than 0
  if (count > 0) {
    setCount(count - 1);
  } // Back to the last position if the count is 0
  else if (count === 0) {
    setCount(projects.length - 1);
  }
}
export default Projects;
