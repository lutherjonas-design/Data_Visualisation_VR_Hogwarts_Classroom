import { Link } from "react-router-dom";
import { type Project } from "../types/apiProjects"

interface ProjectList {
    projects: Project[];
}
export default function ListProject({ projects }: ProjectList) {
    return (
        <div className=" grid grid-cols-1 gap-2">
        {projects.map((project) => {
            return (
                <Link key={project.slug} to={`/project/${project.slug}`}
                    className="flex justify-between  items-baseline gap-3 rounded-lg bg-custom-bg-soft p-2"
                >
                    <div className="text-2l">{project.name}</div>
                    <div className="text-xs">Slug: {project.slug}</div>
                </Link>
            );
        })}
        </div>
    )
}