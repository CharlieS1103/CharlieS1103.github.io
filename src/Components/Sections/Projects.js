function Projects(){
    const spicetifyMarketplace = {
        name: 'Spicetify Marketplace',
        description: 'A marketplace for Spicetify users to install and manage themes and extensions using inline-linking',
        image: 'https://i.imgur.com/Ev9dXvx.png',
        link: 'https://github.com/Spicetify/spicetify-marketplace',
    }
    const projects = [spicetifyMarketplace]
    return(
        <div className="projects"> 
            <ul className="projects-list">
                {projects.map(project => (
                    <li className="project">
                        <div className="project-info">
                            <a className="projectHeader" href={project.link}>{project.name}</a>
                            <p>{project.description}</p>
                        </div>
                        <div className="project-image">
                            <img className="project-preview"src={project.image} alt={project.name} />
                        </div>
                       
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default Projects