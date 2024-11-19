import React from "react";
import "../../styles/Home.scss";

function Home() {
    return (
        <div className="home">
            <div className="home-content">
                <div className="home-content-text">
                    <div className="desktop-only">
                        <img src="https://github-readme-stats.vercel.app/api/wakatime?username=charlies1103&theme=algolia" alt="Wakatime Stats" />
                    </div>
                    <div className="desktop-only">
                        <img src="https://github-readme-stats.vercel.app/api?username=charlies1103&&show_icons=true&theme=algolia" alt="GitHub Stats" />
                    </div>
                    <div className="mobile-only">
                        <p>This section of the website doesn't work on mobile, but trust me, I programmed a lot this week...</p>
                        <p>Scroll down!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;