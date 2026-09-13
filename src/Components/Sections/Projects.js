import "../../styles/Projects.scss";
import { useEffect, useState } from "react";
import React from "react";
import slurpSlopDashboard from "../../assets/slurp-slop-dashboard.png";

const projects = [
  {
    name: "Chaos Chess",
    description:
      "A chess game with a twist. Many different custom gamemodes are available.",
    image: "https://i.imgur.com/Sq17jFd.png",
    link: "https://github.com/CharlieS1103/ChaosChess",
    createdAt: "March 4, 2022",
    statement:
      "I made this project as a way to learn how to integrate a full website with both a backend and a frontend. It was also inspired by my interest in chess, and served as a playground for my own original gamemodes. The UI has a lot of room to grow, but it was a fun project to make.",
  },
  {
    name: "Spicetify Marketplace",
    description:
      "A marketplace for Spicetify users to install and manage themes and extensions using inline-linking",
    image: "https://i.imgur.com/Ev9dXvx.png",
    link: "https://github.com/Spicetify/spicetify-marketplace",
    createdAt: "September 26, 2021",
    statement:
      "This project was the result of a need for a marketplace within Spicetify. \nBeforehand, users would have to download themes and/or extensions and manually edit the config file, which is a pain. \nIt serves as a user interface for installation, in addition, it has able to work around the limitations of not being able to interact with the Filesystem, hence the use of inline-linking to serve extensions and themes.",
  },
  {
    name: "Hide Streaming Controls",
    description:
      "A Chrome extension that hides the streaming controls on various streaming platforms.",
    image: "https://i.imgur.com/eCJC7Dl.png",
    link: "https://github.com/CharlieS1103/hide-streaming-controls",
    createdAt: "May 1, 2022",
    statement:
    ""
  },
  {
    name: "Aygilia Website",
    description: "This is a website for the LLC we made to contain SlurpSlop, you should click on the link to read more about us.",
    image: `${process.env.PUBLIC_URL}/assets/aygilia-logo.svg`,
    link: "https://aygilia.com",
    createdAt: "September 3, 2026",
    statement: "While SlurpSlop is a great alliterating name for our product, it's a little too unprofessional for our brand name, so we chose Aygilia. It's based around the story of the first analog computing device, the antikythera, which maps out the stars for a given observer for epochs into the future. Our logo is modeled after that device as well.",
  },
  {
    name: "Slurp Slop",
    description: "Chrome extension which removes AI content.",
    image: slurpSlopDashboard,
    link: "https://chromewebstore.google.com/detail/slurpslop/kddigfbmalmcbnhiolglepanoekcgjdk?hl=en",
    createdAt: "October 14, 2025",
    statement: "While there's plenty of chrome extensions which remove the AI overview (which we do as well), most if not all rely on class selectors, which need to be updated whenever google obfuscates their code (at a minimum each version bump). Ours works using regex and pattern recognition however, meaning no downtime between google updates. Additionally, we have redesigned the base extension to be specialized for an educational setting, check out the Aygilia website for more information on that.",
  },
];

function Projects() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    projects.forEach((project) => {
      new Image().src = project.image;
    });
  }, []);

  function handleProjectClick(event) {
    if (event.target.closest("a")) {
      return;
    }

    const { left, width } = event.currentTarget.getBoundingClientRect();
    if (event.clientX - left < width / 2) {
      increment(projects, setCount, count);
    } else {
      deincrement(projects, setCount, count);
    }
  }

  return (
    <div
      className="projects-container"
      style={{ backgroundImage: `url(${projects[count].image})` }}
      onClick={handleProjectClick}
    >
      <div className="project">
        <div className="project-info">
          <a href={projects[count].link} target="_blank" rel="noreferrer">
            {projects[count].name}
          </a>
          <p>{projects[count].description}</p>
          <p className="project-date">Created {projects[count].createdAt}</p>
        </div>
        <div className="project-statement">
          {projects[count].statement.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
      <div className="projects-navigation-hint" aria-hidden="true">
        <span>+</span>
        <span>-</span>
      </div>
    </div>
  );
}

function increment(projects, setCount, count) {
  if (count < projects.length - 1) {
    setCount(count + 1);
  } else if (count === projects.length - 1) {
    setCount(0);
  }
}

function deincrement(projects, setCount, count) {
  if (count > 0) {
    setCount(count - 1);
  } else if (count === 0) {
    setCount(projects.length - 1);
  }
}

export default Projects;