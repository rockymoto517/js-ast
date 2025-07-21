function isdigit(c) {
	if (!c) {
		return false;
	}

	if (c.length !== 1) {
		throw "Invalid input to isdigit: " + c;
	}

	return /[0-9]/.test(c);
}

function isalpha(c) {
	if (!c) {
		return false;
	}

	if (c.length !== 1) {
		throw "Invalid input to isalpha: " + c;
	}

	return /[a-zA-Z_-]+/.test(c);
}

function isoperation(c) {
	if (!c) {
		return false;
	}

	if (c.length !== 1) {
		throw "Invalid input to isalpha: " + c;
	}

	return /[+\-*/]+/.test(c);
}

export {isdigit, isalpha, isoperation};
