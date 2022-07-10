import '../../styles/Projects.scss'
function Projects(){

    const projects = [
        {
        name: 'Chaos Chess',
        description: 'A chess game with a twist. Many different custom gamemodes are available.',
        image: 'https://i.imgur.com/Ev9dXvx.png',
        link: 'https://github.com/CharlieS1103/ChaosChess',

        }, 
        {
            name: 'Spicetify Marketplace',
            description: 'A marketplace for Spicetify users to install and manage themes and extensions using inline-linking',
            image: 'https://i.imgur.com/Ev9dXvx.png',
            link: 'https://github.com/Spicetify/spicetify-marketplace',
        },
        {
            name: 'Hide Streaming Controls',
            description: 'A Chrome extension that hides the streaming controls on various streaming platforms.',
            image: 'https://i.imgur.com/Ev9dXvx.png',
            link: 'https://github.com/CharlieS1103/hide-streaming-controls',
        }
    ]
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