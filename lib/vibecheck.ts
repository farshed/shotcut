export const checkType = function(input, type: string = 'number', callback) {
	if (typeof input !== type) callback();
};
