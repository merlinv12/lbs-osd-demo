import { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';


const ViewerSettingsInput = ({setAnimationTime, animationTime, setZoomPerClick, zoomPerClick, setZoomPerSecond, zoomPerSecond}) => {
    return (
    <Form className="mt-5">
      <Form.Group>
        <Form.Label> Animation Time: {animationTime} s </Form.Label>
            <Form.Range
            value={animationTime}
            onChange={e => setAnimationTime(e.target.value)}
            min={0}
            max={5}
            step={0.2}
            /> 
        <Form.Label>Zoom per Click: {zoomPerClick}</Form.Label>
        <Form.Range
            value={zoomPerClick}
            onChange={e => setZoomPerClick(e.target.value)}
            min={1}
            max={10}
            step={0.2}
            /> 
        <Form.Label>Zoom per Second: {zoomPerSecond}</Form.Label>
        {/* <Form.Range
            value={zoomPerSecond}
            onChange={e => setZoomPerSecond(e.target.value)}
            min={1}
            max={5}
            step={0.2}
            />  */}
      </Form.Group>
    </Form>
    )
}

export { ViewerSettingsInput }