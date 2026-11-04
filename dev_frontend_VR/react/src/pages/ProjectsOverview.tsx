import { useNavigate } from "react-router-dom"

import { useLanguage } from "../context/LanguageContext";
import { useProjects, useCreateProject } from "../hooks/hookBook"
import { LoadHandler } from "../components/hookHandler/LoadHandler";
import ListProject from "../components/ListProjects";
import { Modal } from "../components/Modal/Modal";
import { useState } from "react";
import { MutationHandler } from "../components/hookHandler/mutationHandler";
import { StyledButton } from "../components/button";


export default function ProjectOverview() {
    const { data: projects, loading: project_loading, error: project_error } = useProjects();
    const { mutate: create_mutate, loading: create_loading, error: create_error } = useCreateProject()
    const [openModal, setOpenModal] = useState(false);
    const { t } = useLanguage();
    const [create_project_name, set_create_project_name] = useState("")
    const navigate = useNavigate();

    const handleSave = async () => {
        try {
            // Hier werden die tatsächlichen Daten beim Klick übergeben
            const newProject = await create_mutate({
                name: create_project_name
            })
            navigate(`project/${newProject.slug}`)
        } catch (err) {
            console.error("Fehler beim Erstellen", err)
        }
    }

    const projectOverviewTitle = <h1>{t("project_overview.title")}</h1>
    const add_project = <button
        onClick={() => setOpenModal(true)/* navigate("/createProject") */}
        className="
            fixed bottom-6 right-6 h-14 w-14 rounded-full 
            bg-custom-accent text-white font-bold text-2xl shadow-lg 
            hover:bg-custom-accent/90 hover:scale-105 active:scale-95 
            transition-all flex items-center justify-center z-50
          ">
        +
    </button>
    const add_project_Modal = <Modal isOpen={openModal} onClose={() => { setOpenModal(false); set_create_project_name("") }} title={t("create_project.title")}>
        <MutationHandler
            isLoading={create_loading} error={create_error} errorMessage="Fehler"    
        >
            <form className="flex flex-col items-center gap-2" onSubmit={handleSave}>
                <label className="flex items-center gap-2">
                    {t("create_project.input_label") + ":"}
                    <input type="text"
                        className="bg-custom-bg-soft border border-custom-border rounded-xl px-2 py-1"
                        value={create_project_name}
                        onChange={(event) => { set_create_project_name(event.target.value) }}
                    />
                </label>
            </form>
            <div className="flex flex-col items-stretch gap-2 pt-4">
                <StyledButton onClick={handleSave} disabled={create_loading}>{t("create_project.button")}</StyledButton>
            </div>
        </MutationHandler>
    </Modal>
    return (
        <LoadHandler
            name="project_overview.name" isLoading={project_loading} loadingDecorator={projectOverviewTitle}
            error={project_error} errorDecorator={projectOverviewTitle}
        >
            <>
                {add_project}
                {add_project_Modal}
                {projectOverviewTitle}
                <section>
                    {!projects ? (
                        <p className="text-sm text-custom-text-muted italic">No projects found. Create a new one to begin.</p>
                    ) : (
                        <ListProject projects={projects} />
                    )}
                </section>
            </>
        </LoadHandler>
    )
}