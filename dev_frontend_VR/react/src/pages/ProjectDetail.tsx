import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react';

import { useLanguage } from "../context/LanguageContext"
import { useProjectDetail, useDeleteProject } from '../hooks/hookBook';
import { LoadHandler } from '../components/hookHandler/LoadHandler';
import { Modal } from '../components/Modal/Modal';
import { StyledButton } from '../components/button';
import { MutationHandler } from '../components/hookHandler/mutationHandler';
import { ButtonCard } from '../components/cards/Card';
import { Tooltip } from '../components/tooltip';

import Icon from '../styles/icons';

export default function ProjectDetailPage() {
    const [openModalFile, setOpenModalFile] = useState(false);
    const [openModalSettings, setopenModalSettings] = useState(false);
    const [openModalDelete, setopenModalDelete] = useState(false);

    const [deleteKey, setDeleteKey] = useState("");
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { slug } = useParams();
    if (!slug) {
        return <div>Check Link</div>
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { loading: delete_loading, error: delete_error, mutate: delete_mutate } = useDeleteProject(slug)

    const handleDelete = async () => {
        try {
            await delete_mutate({ key: deleteKey })
            navigate('/')
        } catch (err) {
            console.error("Fehler beim Erstellen", err)
        }
    }

    const SettingsModal = <Modal isOpen={openModalSettings} onClose={() => setopenModalSettings(false)} title={t("project_detail.settings")}>
        <div className='flex flex-col items-stretch'>
            <StyledButton onClick={() => { { setopenModalDelete(true) } }}>
                {t("project_detail.delete")}
            </StyledButton>
        </div>
    </Modal>

    const DeleteProjectModal = <Modal isOpen={openModalDelete} onClose={() => { setopenModalDelete(false); setDeleteKey("") }} title={t("project_detail.delete")}>
        <MutationHandler
            isLoading={delete_loading} error={delete_error}
            errorMessage={delete_error?.status == 403 ? t("project_detail.error_pw") : t("project_detail.error_pw_2")}
        >
            <form className="flex flex-col items-center gap-2"
                onSubmit={handleDelete}
            >
                <label className="flex items-center gap-2">
                    {t("project_detail.pw") + ":"}
                    <input type="password"
                        className="bg-custom-bg-soft border border-custom-border rounded-xl px-2 py-1"
                        value={deleteKey}
                        onChange={(event) => { setDeleteKey(event.target.value) }}
                    />
                </label>
            </form>
            <div className="flex flex-col items-stretch gap-2 pt-4">
                <StyledButton onClick={handleDelete} disabled={delete_loading}>{t("project_detail.delete")}</StyledButton>
            </div>
        </MutationHandler>
    </Modal>

    const AddFileModal = <Modal isOpen={openModalFile} onClose={() => setOpenModalFile(false)} title="test">
        <div>Trying Stuff out</div>
    </Modal>

    const AddFileButton = <StyledButton onClick={() => { navigate(`/project/${slug}/files`) }}>
        <div className="text-custom-text">
            <Icon name="expand" className="h-7" />
        </div>
    </StyledButton>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: project, loading: project_loading, error: project_error } = useProjectDetail(slug)
    const displayName = project?.name ?? slug;
    return (
        <LoadHandler name={displayName} isLoading={project_loading} error={project_error}>
            {SettingsModal}
            {AddFileModal}
            {DeleteProjectModal}
            <div className="flex justify-between">
                <h1>{displayName}</h1>
                <StyledButton onClick={() => { setopenModalSettings(true) }}>⚙️</StyledButton>

            </div>

            <ButtonCard title={t("project_detail.title")} button={<Tooltip text={t("project_detail.tte")}>{AddFileButton}</Tooltip>}>
                <div></div>
            </ButtonCard>
        </LoadHandler>
    )
}