const TokenType = Object.freeze({
	Num: 1,
	Decimal: 2,
	Operator: 3,
	OpenParen: 4,
	CloseParen: 5,
});

class Token {
	value;
	type;

	constructor(value = null, type = null) {
		this.value = value;
		this.type = type;
	}
}

class Lexer {
	#input;
	#tokens;
	#current_char;
	#position;
	#len;

	constructor(input) {
		this.#input = input;
		this.#tokens = [];
		this.#current_char = null;
		this.#position = -1;
		this.#len = input.length;

		this.next_char();
	}

	next_char() {
		this.#position++;
		if (this.#position < this.#len) {
			this.#current_char = this.#input[this.#position];
		} else {
			this.#current_char = null;
		}
	}

	typeof(char) {
		if (/^-?\d+$/.test(char)) {
			return TokenType.Num;
		} else if (char === ".") {
			return TokenType.Decimal;
		} else if (char === "(") {
			return TokenType.OpenParen;
		} else if (char === ")") {
			return TokenType.CloseParen;
		} else if ("+-*/".includes(char)) {
			return TokenType.Operator;
		} else {
			throw "Invalid character.";
		}
	}

	tokenize() {
		while (this.#current_char !== null) {
			this.#tokens.push(new Token(this.#current_char, this.typeof(this.#current_char)));
			this.next_char();
		}

		return this.#tokens;
	}
}
