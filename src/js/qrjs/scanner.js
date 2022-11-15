const videoElem = document.getElementById('scanner');

const qrScanner = new QrScanner(
    videoElem,
    result => alert(`decoded qr code: ${result.data}`),
	{
		maxScansPerSecond: 10,
		preferedCamera: 'environment',
		highlightScanRegion: true,
		highlightCodeOutline: false,
		// overlay: HTMLDivElement,
		// returnDetailedScanResult: true
	},
);


qrScanner.start();
