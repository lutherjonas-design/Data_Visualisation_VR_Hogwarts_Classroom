import { useParams } from 'react-router-dom'
import { useState } from 'react';

import { useLanguage } from '../context/LanguageContext';
import { useProjectDetail } from '../hooks/hookBook';
import { StyledButton } from '../components/button';
import { Modal } from '../components/Modal/Modal';
import { Card } from '../components/cards/Card';
import Icon from '../styles/icons'
import { FileDropZone } from '../components/FileDropField';

export default function PageFile() {
    const { t } = useLanguage();
    const { slug } = useParams();
    const [lock, setLock] = useState<boolean>(false);

    if (!slug) {
        return <div>Check Link</div>
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [openModalAddFile, setOpenModalAddFile] = useState<boolean>(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: project, /* loading: project_loading, error: project_error */ } = useProjectDetail(slug)
    const displayName = project?.name ?? slug;
    const AddFileCard = <Modal lock={lock} isOpen={openModalAddFile} size="xl" height={true}
        onClose={() => { setOpenModalAddFile(false) }}
        title={t("file.add")}
    >
        <FileDropZone files={[]} lock={lock} setLock={setLock} />
    </Modal>
    return <>
        {AddFileCard}
        <div className='flex flex-col gap-2'>
            <div className="flex justify-between">
                <h1>{displayName}: {t("file.title")}</h1>
                <StyledButton onClick={() => { setOpenModalAddFile(true) }}>
                    <Icon name="addFile" className="w-8" />
                </StyledButton>
            </div>
            <Card title={t("fileInfo.info")}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus obcaecati sit cupiditate dolore harum omnis suscipit vitae doloremque impedit repudiandae nulla quia deleniti odit iusto sapiente maiores, aperiam a vero.
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, debitis quod totam ut qui minima! Quasi rem cum fugiat reiciendis error repellendus quidem recusandae, totam quae voluptas facilis deleniti ex?
            </Card>
        </div>
    </>
}