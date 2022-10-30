const videoElem = document.getElementById('scanner');

const qrScanner = new QrScanner(
    videoElem,
    result => console.log('decoded qr code:', result),
	{
		maxScansPerSecond: 10,
		preferedCamera: 'environment',
		highlightScanRegion: false,
		highlightCodeOutline: false,
		// overlay: HTMLDivElement,
		// returnDetailedScanResult: true
	},
);


qrScanner.start();