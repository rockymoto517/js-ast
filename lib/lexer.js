import {isdigit, isalpha, isoperation} from "./utils.js";
import {SymbolType, Symbol} from "./tree.js";

// Default unknown tokens to their ASCII value
const TokenType = Object.freeze({
	Num: -1,
	Var: -2,
	Operator: -3,
	OpenParen: -4,
	CloseParen: -5,
});

class Lexer {
	#input;
	#pos;
	#len;

	constructor(input) {
		this.#input = input;
		this.#pos = 0;
		this.#len = input.length;
	}

	#typeof(input) {
		if (/^([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(input)) {
			return TokenType.Num;
		} else if (/[a-zA-Z_][a-zA-Z0-9-_]*/.test(input)) {
			return TokenType.Var;
		} else if (isoperation(input)) {
			return TokenType.Operator;
		} else if (input === "(") {
			return TokenType.OpenParen;
		} else if (input === ")") {
			return TokenType.CloseParen;
		} else {
			throw new Error("Invalid character.");
		}
	}

	#seek_num() {
		let decimal = false;
		return function(char) {
			if (isdigit(char)) {
				return true;
			} else if (!decimal && char === ".") {
				decimal = true;
				return true;
			} else {
				return false;
			}
		}
	}

	get_token() {
		let last_char = this.#input[this.#pos];
		let check_num = this.#seek_num();
		if (check_num(last_char)) {
			let num = "";
			do {
				num += last_char;
				this.#pos++;
				last_char = this.#input[this.#pos];
			} while (check_num(last_char));
			return {
				value: Number(num),
				type: this.#typeof(num),
			}
		} else if (isalpha(last_char)) {
			let exp = "";
			do {
				exp += last_char;
				this.#pos++;
				last_char = this.#input[this.#pos];
			} while (isalpha(last_char));
			return {
				value: exp,
				type: this.#typeof(exp),
			}
		} else if (isoperation(last_char)) {
			this.#pos++;
			return {
				value: new Symbol(last_char),
				type: this.#typeof(last_char),
			}
		} else if (this.#pos < this.#len) {
			this.#pos++;
			return {
				value: last_char,
				type: this.#typeof(last_char),
			}
		} else {
			return false;
		}
	}
}

export {TokenType, Lexer};
