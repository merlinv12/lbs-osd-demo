import OpenSeaDragon from "openseadragon";
import { Viewer } from "openseadragon";
import React, { useEffect, useState } from "react";

const OpenSeaDragonViewer = ({imageDzi}) => {
const [viewer, setViewer] = useState<Viewer | null>(null);

// useEffect(() => {
//     if (imageDzi && viewer) {
//       viewer.open(imageDzi);
//     }
//   }, [imageDzi]);


const InitOpenseadragon = (imageDzi) => {
    viewer && viewer.destroy();
    setViewer(
        OpenSeaDragon({
          id: "openSeaDragon",
          prefixUrl: "openseadragon-images/",
          tileSources: `http://localhost:8000/dz/${imageDzi}`,
          animationTime: 0.5,
          blendTime: 0.1,
          constrainDuringPan: true,
          maxZoomPixelRatio: 2,
          minZoomLevel: 1,
          visibilityRatio: 1,
          zoomPerScroll: 2
        })
      );
}

useEffect(() => {
    console.log('useeffect', imageDzi)
    InitOpenseadragon(imageDzi);
    return () => {
        viewer && viewer.destroy();
    };
  }, [imageDzi]);


return (
  <div 
  id="openSeaDragon"
  style={{
    height: "800px",
    width: "1200px"
  }}
  >
  </div>
  );
};

export { OpenSeaDragonViewer };