export const mockData: Record<string, unknown> = {
    'projects': [
        { id: 1, slug: 'alpha', name: 'Alpha' },
        { id: 2, slug: 'beta', name: 'Beta' }
    ],
    'projects/alpha':{ id: 1, slug: 'alpha', name: 'Alpha', description: '...' },
    'file_status_type':{FileType:['A','B','C'], FileFormat:['x','y','z']}
 // add more as needed
}