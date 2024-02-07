const stringIsNumber = value => isNaN(Number(value)) === false;

export const enumToArray = (enumObj: any) => {
	return Object.keys(enumObj)
		.map(key => enumObj[key]);
};

export const sortObjectByFieldname = (obj: any) => {
	let sortedKeys;
	if (obj) {
		sortedKeys = Object.keys(obj).sort().reduce((temp_obj, key) => {
			temp_obj[key] = obj[key];
			return temp_obj;
		}, {});
	}
	return sortedKeys;
}
