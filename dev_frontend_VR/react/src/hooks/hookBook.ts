/* eslint-disable react-hooks/rules-of-hooks */
import { useSimApiCall, useSimApiMutate } from "../sim_api/projects";
import {
    type Project, type ProjectDetail, type CreateProjectPayload, type DeleteProjectPayload,
    type DeleteResponse, type AllowedTypesResponse
} from "../types/apiProjects";
import { useAPI } from "./generalHook";
import { useMutation } from "./mutationHook";
import { useUploadMultipleFiles } from "./uploadFileHook";

const api_root = 'http://localhost:8000/api/'

const sim_return = false;

export function useProjects() {
    if (!sim_return) {
        return useAPI<Project[]>(api_root + 'projects/')
    }
    return useSimApiCall('projects', 300, false)
}

export function useProjectDetail(slug: string) {
    if (!sim_return) {
        return useAPI<ProjectDetail>(api_root + 'projects/' + slug)
    }
    return useSimApiCall('projects/alpha', 300, false)
}

export function useCreateProject() {
        return useMutation<ProjectDetail, CreateProjectPayload>(api_root + 'projects/', 'POST')
}

export function useDeleteProject(slug: string) {
    return useMutation<DeleteResponse, DeleteProjectPayload>(api_root + 'projects/' + slug, 'DELETE')
}

export function useFileTypeStatus(){
    if(!sim_return){
        return useAPI<AllowedTypesResponse>(api_root + 'files/allowed_types')
    }
    return useSimApiCall('file_status_type', 300, false)
}

export function useFileUpload() {
    if(!sim_return){
        return useUploadMultipleFiles(api_root + 'files/uploads/')
    }
    return useSimApiMutate("uploaded_files",1000,false)
}