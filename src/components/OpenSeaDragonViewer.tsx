import OpenSeaDragon from "openseadragon";
import { Viewer } from "openseadragon";
import React, { useEffect, useState } from "react";

const OpenSeaDragonViewer = ({imageDzi}) => {
const [viewer, setViewer] = useState<Viewer | null>(null);

const InitOpenseadragon = (imageDzi) => {
    viewer && viewer.destroy();
    setViewer(
        OpenSeaDragon({
          id: "openSeaDragon",
          prefixUrl: "openseadragon-images/",
          tileSources: `/dz/${imageDzi}`,
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
    InitOpenseadragon(imageDzi);
    return () => {
        viewer && viewer.destroy();
    };
  }, [imageDzi]);


return (
  <div 
  className="mt-2"
  id="openSeaDragon"
  style={{
    height: "90vh",
    width: "100%"
  }}
  >
  </div>
  );
};

export { OpenSeaDragonViewer };