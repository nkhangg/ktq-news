import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Trash2 } from 'lucide-react';

const Dropzone = ({ onChangeFile }: { onChangeFile: (files: File[]) => void }) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const onDrop = (acceptedFiles: File[]) => {
        setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };

    const removeFile = (fileName: string) => {
        setUploadedFiles((files) => files.filter((file) => file.name !== fileName));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.svg'] },
        multiple: false,
    });

    useEffect(() => {
        onChangeFile(uploadedFiles);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadedFiles]);

    return (
        <Card className="p-4 border-2 border-dashed border-gray-300">
            <CardHeader className="flex flex-col items-center">
                <div
                    {...getRootProps({
                        className: `p-6 cursor-pointer flex items-center justify-center border-dashed rounded-xl ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`,
                    })}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p className="text-blue-500">Drop the files here...</p>
                    ) : (
                        <div className="flex flex-col items-center">
                            <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
                            <p className="text-gray-500">Drag & drop files here, or click to select</p>
                        </div>
                    )}
                </div>
            </CardHeader>

            {uploadedFiles.length > 0 && (
                <CardContent className="mt-4">
                    <ul className="space-y-2">
                        {uploadedFiles.map((file) => (
                            <li key={file.name} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                <span className="text-sm font-medium text-gray-700">{file.name}</span>
                                <Button variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => removeFile(file.name)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            )}
        </Card>
    );
};

export default Dropzone;
