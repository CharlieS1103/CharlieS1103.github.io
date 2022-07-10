import Nav from './Nav.js'
import Projects from './Sections/Projects.js'
function Content(){
    return (
        <>
            <div class="scrolls">
                <div class="up"><span>↑</span>
                    <div class="center"><span>mouse scrolling</span></div>
                </div>
                <div class="down"><span>↓</span></div>
            </div>
            <div class="smooth">
                <Nav></Nav>
                <section id="home">
                    <h2>Section home</h2>
                </section>
                <section id="about">
                    <h2>Section about</h2>
                </section>
                <section id="projects">
                    <Projects></Projects>
                </section>
                <section id="contact">
                    <h2>Section contact</h2>
                </section>
            </div>
        </>
    )
}
export default Content