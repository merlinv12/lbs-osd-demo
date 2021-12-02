import OpenSeaDragon from "openseadragon";
import { Viewer } from "openseadragon";
import React, { useEffect, useState } from "react";

const OpenSeaDragonViewer = ({imageDzi, animationTime, zoomPerClick, zoomPerSecond}) => {
const [viewer, setViewer] = useState<Viewer | null>(null);

const InitOpenseadragon = (imageDzi) => {
    viewer && viewer.destroy();
    setViewer(
        OpenSeaDragon({
          id: "openSeaDragon",
          prefixUrl: "openseadragon-images/",
          tileSources: `/dz/${imageDzi}`,
          animationTime: animationTime,
          // blendTime: 0.1,
          // constrainDuringPan: true,
          // maxZoomPixelRatio: 2,
          // minZoomLevel: 1,
          // visibilityRatio: 1,
          zoomPerSecond: zoomPerSecond,
          zoomPerClick: zoomPerClick
        })
      );
}

useEffect(() => {
    InitOpenseadragon(imageDzi);
    return () => {
        viewer && viewer.destroy();
    };
  }, [imageDzi, animationTime, zoomPerClick, zoomPerSecond]);


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