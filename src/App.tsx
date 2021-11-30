import React from 'react';
import { useState } from 'react';
import { OpenSeaDragonViewer } from './components/OpenSeaDragonViewer';
import { ImageList } from './components/ImageList';

function App() {
  const [selectedDzi, setSelectedDzi] = useState();

  return (
    <div className="App">
      <ImageList setSelectedDzi={setSelectedDzi} />
      {selectedDzi && 
      <OpenSeaDragonViewer imageDzi={selectedDzi}/>
      }
    </div>
  )
}

export default App
