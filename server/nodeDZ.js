const sharp = require('sharp');

class DeepZoomGenerator {
    constructor(tileSize = 254, overlap = 1, limitBounds = false) {
        this.boundsOffsetProps = [
            openslide.PROPERTY_NAME_BOUNDS_X,
            openslide.PROPERTY_NAME_BOUNDS_Y,
        ];
        this.boundsSizeProps = [
            openslide.PROPERTY_NAME_BOUNDS_WIDTH,
            openslide.PROPERTY_NAME_BOUNDS_HEIGHT,
        ];

        this.osr = osr;
        this.zTDownsample = tileSize;
        this.zOverlap = overlap;
        this.limitBounds = limitBounds;

        // Precompute dimensions
        if (limitBounds) {
            this.l0Offset = this.boundsOffsetProps.map(prop =>
                parseInt(osr.properties[prop]) || 0
            );
            const sizeScale = this.boundsSizeProps.map((prop, index) =>
                parseInt(osr.properties[prop]) / osr.dimensions[index]
            );
            this.lDimensions = osr.levelDimensions.map(lSize =>
                lSize.map((lLim, index) =>
                    Math.ceil(lLim * sizeScale[index])
                )
            );
        } else {
            this.lDimensions = osr.levelDimensions;
            this.l0Offset = [0, 0];
        }
        this.l0Dimensions = this.lDimensions[0];

        let zSize = this.l0Dimensions;
        const zDimensions = [zSize];
        while (zSize[0] > 1 || zSize[1] > 1) {
            zSize = [
                Math.max(1, Math.ceil(zSize[0] / 2)),
                Math.max(1, Math.ceil(zSize[1] / 2)),
            ];
            zDimensions.push(zSize);
        }
        this.zDimensions = zDimensions.reverse();

        this.tDimensions = this.zDimensions.map(zSize => [
            Math.ceil(zSize[0] / this.zTDownsample),
            Math.ceil(zSize[1] / this.zTDownsample),
        ]);

        this.dzLevels = this.zDimensions.length;

        const l0ZDownsamples = Array.from(
            { length: this.dzLevels },
            (_, dzLevel) =>
                2 ** (this.dzLevels - dzLevel - 1)
        );

        this.slideFromDzLevel = l0ZDownsamples.map(d =>
            osr.getBestLevelForDownsample(d)
        );

        this.l0LDownsamples = osr.levelDownsamples;
        this.lZDownsamples = this.dzLevels.map(dzLevel =>
            l0ZDownsamples[dzLevel] /
            this.l0LDownsamples[this.slideFromDzLevel[dzLevel]]
        );

        this.bgColor = '#' + (osr.properties[
            openslide.PROPERTY_NAME_BACKGROUND_COLOR
        ] || 'ffffff');
    }

    levelCount() {
        return this.dzLevels;
    }

    levelTiles() {
        return this.tDimensions;
    }

    levelDimensions() {
        return this.zDimensions;
    }

    tileCount() {
        return this.tDimensions.reduce(
            (total, [tCols, tRows]) => total + tCols * tRows,
            0
        );
    }

    getTile(level, address) {
        const [args, zSize] = this._getTileInfo(level, address);
        const tile = this.osr.readRegion(...args);
        const profile = tile.info.iccProfile;

        const bg = sharp({
            create: {
                width: tile.width,
                height: tile.height,
                channels: 3,
                background: this.bgColor,
            },
        });
        const composedTile = bg.composite([{ input: tile }]);

        if (tile.width !== zSize[0] || tile.height !== zSize[1]) {
            composedTile.resize(...zSize, { fit: 'fill' });
        }

        if (profile) {
            composedTile.iccProfile(profile);
        }

        return composedTile.toBuffer();
    }

    _getTileInfo(dzLevel, tLocation) {
        if (dzLevel < 0 || dzLevel >= this.dzLevels) {
            throw new Error('Invalid level');
        }

        for (let i = 0; i < tLocation.length; i++) {
            if (tLocation[i] < 0 || tLocation[i] >= this.tDimensions[dzLevel][i]) {
                throw new Error('Invalid address');
            }
        }

        const slideLevel = this.slideFromDzLevel[dzLevel];
        const zOverlapTl = tLocation.map(t => this.zOverlap * (t !== 0 ? 1 : 0));
        const zOverlapBr = tLocation.map((t, i) =>
            this.zOverlap * (t !== this.tDimensions[dzLevel][i] - 1 ? 1 : 0)
        );
        const zSize = tLocation.map((t, i) =>
            Math.min(this.zTDownsample, this.zDimensions[dzLevel][i] - this.zTDownsample * t) + zOverlapTl[i] + zOverlapBr[i]
        );

        const zLocation = tLocation.map(t => this.zFromT(t));
        const lLocation = zLocation.map((z, i) =>
            this.lFromZ(dzLevel, z - zOverlapTl[i])
        );
        const l0Location = lLocation.map((l, i) =>
            Math.floor(this.l0FromL(slideLevel, l) + this.l0Offset[i])
        );
        const lSize = lLocation.map((l, i) =>
            Math.floor(Math.min(this.lFromZ(dzLevel, zSize[i]), this.lDimensions[slideLevel][i] - Math.ceil(l)))
        );

        const args = [l0Location, slideLevel, lSize];
        return [args, zSize];
    }

    l0FromL(slideLevel, l) {
        return this.l0LDownsamples[slideLevel] * l;
    }

    lFromZ(dzLevel, z) {
        return this.lZDownsamples[dzLevel] * z;
    }

    zFromT(t) {
        return this.zTDownsample * t;
    }

    getTileCoordinates(level, address) {
        return this._getTileInfo(level, address)[0];
    }

    getTileDimensions(level, address) {
        return this._getTileInfo(level, address)[1];
    }
}

module.exports = DeepZoomGenerator;