import {Parser} from "./parser.js";

function parse_arithmetic(str) {
	try {
		const p = new Parser(str);
		return p.evaluate();
	} catch (e) {
		console.error(e);
	}
}

export {parse_arithmetic};
