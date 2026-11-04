import { useState } from 'react';
import { type UFile } from '../types/apiProjects';

interface UploadResponseItem {
  uid: string;
}

interface UploadFilesProps {
  slug: string;
  fileItems: UFile [];
}

export const useUploadMultipleFiles = (link:string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<UploadResponseItem[] | null>(null);

  const uploadMultipleFiles = async ({slug, fileItems}:UploadFilesProps) => {
    setLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    
    // Append the parallel metadata and native files
    fileItems.forEach((item) => {
      formData.append('upload_names', item.name);
      formData.append('types', item.FileType);
      formData.append('formats', item.FileFormat);
      formData.append('files', item.fileObject);
    });

    try {
      // Slug dynamically appended directly to the URL route
      const response = await fetch(`${link}${slug}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Something went wrong');
      }

      setData(result);
      return result;
    } catch (err: unknown) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadMultipleFiles, loading, error, data };
};