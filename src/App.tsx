import React from 'react';
import { useState } from 'react';
import { OpenSeaDragonViewer } from './components/OpenSeaDragonViewer';
import { ImageList } from './components/ImageList';
import { ImageUpload } from './components/ImageUpload';
import { ViewerSettingsInput } from './components/ViewerSettingsInput';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Row, Col, Nav, Button, Navbar } from 'react-bootstrap';

function App() {
  const [selectedDzi, setSelectedDzi] = useState();
  const [animationTime, setAnimationTime] = useState(1.2);
  const [zoomPerClick, setZoomPerClick] = useState(2.0);
  const [zoomPerSecond, setZoomPerSecond] = useState(1.0)

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
        <Col md={2}>
          <ImageList setSelectedDzi={setSelectedDzi} selectedDzi={selectedDzi} />
          <ViewerSettingsInput animationTime={animationTime} setAnimationTime={setAnimationTime} 
                              zoomPerClick={zoomPerClick} setZoomPerClick={setZoomPerClick}
                              zoomPerSecond={zoomPerSecond} setZoomPerSecond={setZoomPerSecond}
            />
        </Col>
        <Col md={10}>
          {selectedDzi && 
            <OpenSeaDragonViewer imageDzi={selectedDzi} animationTime={animationTime} zoomPerClick={zoomPerClick} zoomPerSecond={zoomPerSecond} />
          }
        </Col>
      </Row>
      <ImageUpload show={show} onHide={handleClose} />
    </ Container>
  )
}

export default App
