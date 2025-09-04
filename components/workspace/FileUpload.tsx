import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, X, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FileUploadProps {
  projectId: string;
  onFileUploaded?: () => void;
}

interface ProjectFile {
  id: string;
  filename: string;
  file_size: number;
  created_at: string;
  uploader_id: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ projectId, onFileUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<ProjectFile[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          filename: file.name,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type
        });

      if (dbError) throw dbError;

      onFileUploaded?.();
      loadFiles();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const loadFiles = async () => {
    const { data } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (data) setFiles(data);
  };

  React.useEffect(() => {
    loadFiles();
  }, [projectId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="h-5 w-5" />
          Project Files
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">Upload files to share with your project partner</p>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" disabled={uploading} asChild>
              <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
            </Button>
          </label>
        </div>

        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <File className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{file.filename}</p>
                  <p className="text-xs text-gray-500">
                    {(file.file_size / 1024).toFixed(1)} KB • {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};