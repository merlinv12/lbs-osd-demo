# OpenSeadragon Demo using VIPS

## Setup
1.  Install Node

2.  Install Libvips

3.  Install Openslide

4.  npm ci
5.  cd ./server && node .

## TODO
Server
- [ ] Handle upload of new image file
- [ ] Process image file into tiles and dzi
- [ ] index and save files somewhere (CDN?)

Frontend
- [ ] Upload UI
- [ ] Image processing UI
- [ ] Create simple list of images to select
- [ ] Create OSD component

Command for converting svs to dz:  
```vips dzsave ./server/uploads/GT450-40.svs server/dz/GT450-40 --vips-progress --vips-leak```