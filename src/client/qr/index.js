import QrScanner from 'qr-scanner';

const scannerOptions = {
	maxScansPerSecond: 3,
	preferedCamera: 'environment',
	highlightScanRegion: true,
	highlightCodeOutline: false,
}

function initScanner(){
	const videoElem = document.createElement('video');
	videoElem.setAttribute('width', window.innerWidth);
	videoElem.setAttribute('height', window.innerHeight);
	videoElem.style.position = 'absolute';
	document.querySelector('.container').appendChild(videoElem);

	const qrScanner = new QrScanner(
		videoElem,
		result => {
			if(result.data){
				this.stop();
				alert(result.data);
				console.log(result);
			}
		},
		scannerOptions
	);

	qrScanner.start();
}

window.addEventListener('load', initScanner, false);
