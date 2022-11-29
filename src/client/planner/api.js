
function createTable(headers, data) {
	const table = document.createElement('table');
	const thead = document.createElement('thead');
	const tbody = document.createElement('tbody');
	const tr = document.createElement('tr');

	headers.forEach(h => {
		const th = document.createElement('th');
		th.innerHTML = h;
		tr.appendChild(th);
	});
	thead.appendChild(tr);
	table.appendChild(thead);

	data.forEach(row => {
		const tr = document.createElement('tr');
		//row.forEach(cell => {
			const td = document.createElement('td');
			td.innerHTML = row.title;
			tr.appendChild(td);
		//});
		tbody.appendChild(tr);
	});
	table.appendChild(tbody);
	
	table.add = function(row) {
		const tr = document.createElement('tr');
		row.forEach(cell => {
			const td = document.createElement('td');
			td.innerHTML = cell;
			tr.appendChild(td);
		});
		tbody.appendChild(tr);
	}
	return table;
}

function roomDataCallback(room)	{
	const url = '/api/roomdata?id=' + room.id;
	let element = document.createElement('div');
	try {
	fetch(url, {method: 'GET'}).then((response) => {
		return response.json();
	}).then((data) => {
		const table = createTable(['event', 'time'], data.events);
		element.appendChild(table);
	});
	} catch(e) { console.error(e); }
	return element;
}

function save(data) {
	fetch('/api/floorplan', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: data
	})
}

const api = {
	editRoomCallback: roomDataCallback,
	roomDataCallback,
	save
};

export default api;