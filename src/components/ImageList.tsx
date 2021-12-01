import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup'



const ImageList = ({setSelectedDzi, selectedDzi}) => {
    const [dziList, setDziList] = useState([]);

    const getDziList = async () => {
        try {
            let response = await fetch('/images')
            let dzis = await response.json();
            setDziList(dzis.images)
        } catch (err){
            console.error(err)
        }
    }

    useEffect(() => {
        getDziList();
      }, []);

    return (
        <ListGroup as="ul" className="mt-2">
            {dziList.map((dzi, index) => {
                        return (
                            <ListGroup.Item as="li"
                            key={index}
                            action
                            active={dzi === selectedDzi}
                            onClick={() => {
                                return setSelectedDzi(dzi);
                            }}
                            >
                            {dzi}
                            </ListGroup.Item>
                        );

                    })}
        </ListGroup>
    );
}

export { ImageList }