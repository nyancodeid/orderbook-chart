function nyanStorage() {
	this.isJSON = function(string) {
		try {
			JSON.parse(string);
		} catch(e) {
			return false;
		}
		return true;
	}
	this.isObject = function(data) {
		return (typeof data === "object") ? true : false;
	}
	this.getData = function(key) {
		return localStorage.getItem(key);
	}
}
nyanStorage.prototype.api = function() {
	console.log("APIIII");

	return this;
}
nyanStorage.prototype.isAvailable = function(key) {
	return (localStorage.getItem(key) == null) ? false : true;
}
nyanStorage.prototype.get = function(key) {
	var data = this.getData(key)

	if (this.isJSON(data)) {
		return JSON.parse(data);
	} else {
		return data;
	}
}
nyanStorage.prototype.put = function(key, data) {
	var content;
	
	if (this.isObject(data)) {
		content = JSON.stringify(data);
	} else {
		content = data;
	}

	localStorage.setItem(key, content);
}
nyanStorage.prototype.remove = function(key) {
	if (this.getData(key) !== null) {
		localStorage.removeItem(key);
	} else {
		throw new Error("\"" + key + "\"" + ", not founds");
	}
}
nyanStorage.prototype.getAll = function() {
	var allData = localStorage,
		objectS = {},
		data,
		content;

	if (this.isObject(allData)) {
		for (var property in allData) {
			if (!allData.hasOwnProperty(property)) continue;
			data = allData[property];

			if (this.isJSON(data)) {
				content = JSON.parse(data);
			} else {
				content = data;
			}

			objectS[property] = content;
		}
	} else {
		throw new Error("localStorage not supported");
	}

	console.log(objectS);
}