import { useState, useEffect } from 'react';


const ImageList = ({setSelectedDzi}) => {
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
        <div>
            {dziList.map((dzi, index) => {
                return (
                    <button
                      key={index}
                      onClick={() => {
                        return setSelectedDzi(dzi);
                      }}
                    >
                      {dzi}
                    </button>
                  );

            })}
        </div>
    );
}

export { ImageList }