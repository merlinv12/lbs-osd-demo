import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import ImageUploadService from '../services/ImageUploadService';
import { Button, Modal } from 'react-bootstrap'
import axiosInstance from "../services/axios";


const ImageUpload = ({show, onHide}) => {

  const [selectedFile, setSelectedFile] = useState<any>(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [fileInfos, setFileInfos] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("image", selectedFile);
    axiosInstance
    .post("/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (data) => {
        setProgress(Math.round(100 * (data.loaded / data.total)));
      },
    })
    .catch((error) => {
      console.log(error)
    });

  }

  // useEffect(() => {
  //   UploadService.getFiles().then((response) => {
  //     setFileInfos(response.data);
  //   });
  // }, []);

  return (
    // <Form onSubmit={handleSubmit}>
    //   <Form.Group controlId="formFile" className="mb-3">
    //     <Form.Label>Select an Image File</Form.Label>
    //     <Form.Control type="file" onChange={(e) => setSelectedFile(e.target.value)} />
    //   </Form.Group>
    //   <Button variant="primary" type="submit">
    //     Upload
    //   </Button>
    // </Form>

    <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Upload Image File</Modal.Title>
    </Modal.Header>
      <Modal.Body>
        <form action="/image" method="POST" encType="multipart/form-data">
          <div>
            <input type="file" name="image" />
          </div>
          <div>
            <input type="submit" name="btn_upload_profile_pic" value="Upload" />
          </div>
        </form>
      </Modal.Body>
  </Modal>

  )
}

export { ImageUpload };