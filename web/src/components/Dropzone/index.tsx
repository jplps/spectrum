import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

// Defining prop function to recieve
interface Props {
	onUpload: (file: File) => void;
}

// Dropzone, is now a react function component (FC)
const Dropzone: React.FC<Props> = ({ onUpload }) => {
	const [selectedFileUrl, setSelectedFileUrl] = useState('');

	const onDrop = useCallback(acceptedFiles => {
		const file = acceptedFiles[0];

		// URL is a global js var
		const fileUrl = URL.createObjectURL(file);

		setSelectedFileUrl(fileUrl);
		onUpload(file);
	}, [onUpload])
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		// Filtering accepted files
		accept: 'image/*'
	})

	return (
		<div className="dropzone" {...getRootProps()}>
			{/* 
				Accepting images only, does not let the user select other files in the pc.
				For multiple files, add multiple={true} to the input.
			*/}
			<input {...getInputProps()} accept="image/*" />
			{
				selectedFileUrl
					? <img style={{ width: '100%' }} src={selectedFileUrl} alt="LAB Thumbnail" />
					: isDragActive
						? <p>Drop the image!</p>
						: <p>Drag image or click here</p>
			}
		</div>
	)
}

export default Dropzone;