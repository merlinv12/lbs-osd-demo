// key is the downsample factor, value is the page on svs
const GT450_LEVEL_DOWNSAMPLE = {
    1: {page: 0, downsampleFactor: 1}, 
    4: {page: 2, downsampleFactor: 4},
    16: {page: 3, downsampleFactor: 16},
    64: {page: 4, downsampleFactor: 64},
}

let TILE_SIZE = 1024

const dimensionsArrays = (metadata) => {
    console.log(metadata)
    let {width, height} = metadata
    let zSize = [width, height]
    let zDimensions = []
    zDimensions.push(zSize)
    while (zSize[0] > 1 || zSize[1] > 1) {
      zSize = zSize.map((d) => Math.ceil(d / 2))
      zDimensions.push(zSize)
    }
    zDimensions = zDimensions
    let tileDimensionArray = zDimensions.map((z) => {
        return [tiles(z[0])-1, tiles(z[1])-1]
    })

    return {zoomDimensionsArray: zDimensions, tileDimensionArray }
}


const tiles = (zLimit) => {
    return Number(Math.ceil(zLimit / TILE_SIZE))
}



let numDeepZoomLevels = 17 // hardcoding this for now because it seems unlikely that it will be any different for any slide images

const getBestPageFromDeepZoomLevel = (deepZoomLevel) => {
    if (!deepZoomLevel) {
        throw new Error('deepZoomLevel is required')
    }
    if (deepZoomLevel > numDeepZoomLevels) {
        throw new Error('deepZoomLevel Out of range too high')
    }
    let downSampleFactor = getDownsampleFactor(deepZoomLevel);

    if (downSampleFactor < 1) {
        throw new Error('deepZoomLevel Out of range too low')
    }
    if (downSampleFactor >= 64) {
        return GT450_LEVEL_DOWNSAMPLE[64]
    }
    if (downSampleFactor >= 16) {
        return GT450_LEVEL_DOWNSAMPLE[16]
    }
    if (downSampleFactor >= 4) {
        return GT450_LEVEL_DOWNSAMPLE[4]
    }
    if (downSampleFactor >= 1) {
        return GT450_LEVEL_DOWNSAMPLE[1]
    }
}

const getDownsampleFactor = (deepZoomLevel) => {
    return Math.pow(2, numDeepZoomLevels - deepZoomLevel);
}

const getDeepZoomLevelFromDownsampleFactor = (downSampleFactor) => {
    return Math.sqrt(downSampleFactor)
}
const getZoomPixelCoords = (deepZoomLevel, col, row) => { 
    let downSampleFactor = getDownsampleFactor(deepZoomLevel);
    let page = getBestPageFromDeepZoomLevel(deepZoomLevel);
    if (!GT450_LEVEL_DOWNSAMPLE[downSampleFactor])  {
        // the new downscale factor should be the difference between the deep zoom level downscale factor and the page downscale factor
        finalDownscaleFactor = downSampleFactor / page.downsampleFactor
    } else {
        finalDownscaleFactor = 1
    }
    console.log('finalDownscaleFactor', finalDownscaleFactor)
    // Convert the col and row to base level col and row
    let baseCol = col * finalDownscaleFactor;
    let baseRow = row * finalDownscaleFactor;

    // Get col and row pixel coords
    let left = baseCol * TILE_SIZE;
    let top = baseRow * TILE_SIZE;

    // Get width and height
    let width = TILE_SIZE * finalDownscaleFactor;
    let height = TILE_SIZE * finalDownscaleFactor;




    return {
        left,
        top,
        width,
        height,
        page: page.page
    }
}

module.exports = { getZoomPixelCoords, getBestPageFromDeepZoomLevel, getDownsampleFactor }