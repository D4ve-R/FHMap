const abortController = new AbortController();

function _fileNameFromURL(url) {
	return url.split('/').pop();
}

class GeoJSONError extends Error {
	constructor(message, url) {
		const props = {
			msg: message,
			url: url,
			file: _fileNameFromURL(url)
		};
		super(message, props);
		this.name = 'GeoJSONError';
	}
}

async function fetchGeoJSON(url, callBack) {
	let object = undefined;
	try {
		const res = await fetch(url, { signal: abortController.signal})
		const geojson = await res.json();
		if(geojson.type === 'FeatureCollection')
			object = geojson.features;
		else if(geojson.type === 'Feature')
			object =  geojson;
		else
			throw new GeoJSONError('Invalid GeoJSON: reading type '+ geojson.type, url);

		if(typeof callBack === 'function') 
			callBack(object);

		window?.dispatchEvent(new CustomEvent('geojsonLoaded', { 
			url: url,
			file: _fileNameFromURL(url),
			geojson: object 
		}));
	} catch (error) {
		console.trace(error);
	} finally {
		return object;
	}
}

export default { fetchGeoJSON, abortController };
