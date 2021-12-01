import React from 'react';
import { useState } from 'react';
import { OpenSeaDragonViewer } from './components/OpenSeaDragonViewer';
import { ImageList } from './components/ImageList';
import { ImageUpload } from './components/ImageUpload';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Row, Col, Nav, Modal, Button, Navbar } from 'react-bootstrap';

function App() {
  const [selectedDzi, setSelectedDzi] = useState();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container className="App" fluid>
      <Navbar className="ms-auto" variant="dark" bg="dark">
        <Container fluid>
          <Navbar.Brand>OpenSeadragon Image Viewer</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={handleShow}>Upload</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Row>
        <Col xs={3} md={2}>
          <ImageList setSelectedDzi={setSelectedDzi} selectedDzi={selectedDzi} />
        </Col>
        <Col xs={12} md={8}>
          {selectedDzi && 
            <OpenSeaDragonViewer imageDzi={selectedDzi}/>
          }
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Image File</Modal.Title>
        </Modal.Header>
          <Modal.Body>
            <ImageUpload />
          </Modal.Body>
      </Modal>
    </ Container>
  )
}

export default App
