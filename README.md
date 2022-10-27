# FH Aachen Map

serverless Map webapp for FH Aachen Campus, supports AR for mobile.
  
![FHMap](https://raw.githubusercontent.com/D4ve-R/FHMap/main/images/fhmap.png)

online [https://d4ve-r.github.io/FHMap](https://d4ve-r.github.io/FHMap)  
  
built with [Leaflet](https://github.com/Leaflet/Leaflet) and [AR.js](https://github.com/AR-js-org/AR.js)

## Features
  
### location sharing through link
![Share](https://raw.githubusercontent.com/D4ve-R/FHMap/main/images/share.png)
### device location tracking
![Location](https://raw.githubusercontent.com/D4ve-R/FHMap/main/images/location.png)
### mobile AR experience for places of interest

  
## Dev Setup
```
cd FHMap
chmod +x setup.sh
./devSetup.sh
```
  
must be served through https
dev server defaults to https://127.0.0.1:4443
can be changed to host device local network ip, to test on mobile
```
# use local ip example
python3 server.py -H 192.168.178.22
```

## "Build"
```
./build.sh
```

## Contributions
clone repo & create new branch 
do your changes & [write good commit messages](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
create pull request to this repo

## Issues
create an issues in this repo