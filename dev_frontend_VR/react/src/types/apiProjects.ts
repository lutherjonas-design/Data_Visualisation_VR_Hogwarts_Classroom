export type Project = {
  slug: string
  name: string
}

export type ProjectDetail = {
  slug: string
  name: string
  created: string
  updated: string
  id: number
}

export type CreateProjectPayload  = {
  name: string
}

export type DeleteProjectPayload = {
  key: string
}

export type DeleteResponse = {
  slug:string
}

export type UFile = {
    name: string
    fileObject?: File
    FileType: string
    FileFormat: string
    status: string
}

export interface AllowedTypesResponse {
  FileType: string[];
  FileFormat: string[];
}