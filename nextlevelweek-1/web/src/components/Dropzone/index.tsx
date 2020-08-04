import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface DropzoneProps {
    onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileUploaded }) => {

    const [selectedFileUrl, setSelectedFileUrl] = useState<string>('');

    const onDrop = useCallback(acceptedFiles => {

        const file = acceptedFiles[0];
        const fileURL = URL.createObjectURL(file);
        
        setSelectedFileUrl(fileURL);
        onFileUploaded(file);

    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*'
    });

    return (
        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} accept="image/*" />

            {
                selectedFileUrl
                    ? <img src={selectedFileUrl} alt="Upload" />
                    : (
                        <p>
                            <FiUpload />
                    Imagem do estabelecimento
                        </p>
                    )
            }


        </div>
    )
}

export default Dropzone;