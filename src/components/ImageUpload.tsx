import { useState, useEffect } from 'react';
import ImageUploadService from '../services/ImageUploadService';

const ImageUpload = () => {

  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [fileInfos, setFileInfos] = useState([]);

  const selectFile = (event: any) => {
    setSelectedFiles(event.target.files);
  };

  const upload = () => {
    // let currentFile = selectedFiles[0];

    setProgress(0);
    setCurrentFile(currentFile);

    // ImageUploadService.upload(currentFile, (event) => {
    //   setProgress(Math.round((100 * event.loaded) / event.total));
    // })
    //   .then((response) => {
    //     setMessage(response.data.message);
    //     return ImageUploadService.getFiles();
    //   })
    //   .then((files) => {
    //     setFileInfos(files.data);
    //   })
    //   .catch(() => {
    //     setProgress(0);
    //     setMessage("Could not upload the file!");
    //     setCurrentFile(undefined);
    //   });

    setSelectedFiles(undefined);
  };

  // useEffect(() => {
  //   UploadService.getFiles().then((response) => {
  //     setFileInfos(response.data);
  //   });
  // }, []);

  return (
    <form action="/image" method="POST" encType="multipart/form-data">
      <div>
        <input type="file" name="image" />
      </div>
      <div>
        <input type="submit" name="btn_upload_profile_pic" value="Upload" />
      </div>
    </form>
  )
}

export default ImageUpload;