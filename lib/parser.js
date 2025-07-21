import {SymbolType, Symbol, Node, AST} from "./tree.js";
import {Lexer, TokenType} from "./lexer.js";

function clean_str(input) {
	return input.replace(/\s+/g, "");
}

function get_next_operation(input) {
	for (let i = 0; i < input.length; i++) {
		switch (input[i]) {
			case "+":
				return i;
			case "-":
				return i;
			case "*":
				return i;
			case "/":
				return i;
			default:
				break;
		}
	}
}

function get_matching_parentheses(input) {
	let nest_level = 0;
	for (let i = 0; i < input.length; i++) {
		switch (input[i]) {
			case "(":
				nest_level++;
				break;
			case ")":
				if (nest_level === 0) {
					return  i;
				} else {
					nest_level--;
				}
				break;
			default:
				break;
		}
	}
}

function is_number(input) {
	return !!input.match(/[0-9]/g);
}

function get_symbol(input) {
	switch (input) {
		case SymbolType.PLUS:
			return new Symbol(SymbolType.PLUS);
		case SymbolType.MINUS:
			return new Symbol(SymbolType.MINUS);
		case SymbolType.STAR:
			return new Symbol(SymbolType.STAR);
		case SymbolType.SLASH:
			return new Symbol(SymbolType.SLASH);
		default:
			break;
	}
}

// TODO
// Operator precedence
const OperatorPrecedence = Object.freeze({
	"+": 10,
	"-": 10,
	"*": 20,
	"/": 20,
})

class Parser {
	#input;
	#lexer;
	#cur_tok;

	constructor(input) {
		this.#input = clean_str(input);
		this.#lexer = new Lexer(this.#input);
	}

	#get_next_tok() {
		return this.#cur_tok = this.#lexer.get_token();
	}

	#get_tok_precedence() {
		if (this.#cur_tok.type == TokenType.Operator) {
			return OperatorPrecedence[this.#cur_tok.value.type];
		}

		return -1;
	}

	#parse_paren() {
		// Pop "("
		if (!this.#get_next_tok()) {
			return null;
		}
		let exp = this.#parse_expression();

		if (this.#cur_tok.type !== TokenType.CloseParen) {
			throw "Expected ')'";
		}
		// Pop ")"
		this.#get_next_tok()
		return exp;
	}

	#parse_binop_rhs(precedence, LHS) {
		while (true) {
			const tok_precedence = this.#get_tok_precedence();
			if (tok_precedence < precedence) {
				return LHS;
			}

			const binop = this.#cur_tok.value;
			if (!this.#get_next_tok()) {
				return null;
			}

			let RHS = this.#parse_expression_primary();
			const next_precedence = this.#get_tok_precedence();
			if (tok_precedence < next_precedence) {
				RHS = this.#parse_binop_rhs(tok_precedence + 1, RHS);
				if (!RHS) {
					return null;
				}
			}

			LHS = new Node(binop, LHS, RHS);
		}
	}

	#parse_expression() {
		let LHS = this.#parse_expression_primary();
		return this.#parse_binop_rhs(0, LHS);
	}

	#parse_expression_primary() {
		if (!this.#cur_tok) {
			return null;
		}

		let tok;
		switch (this.#cur_tok.type) {
			case TokenType.Num:
				tok = this.#cur_tok.value;
				this.#get_next_tok();
				return new Node(tok);
			case TokenType.Var:
				tok = this.#cur_tok.value;
				this.#get_next_tok();
				return new Node(tok);
			case TokenType.OpenParen:
				tok = this.#parse_paren();
				return tok;
			default:
				throw `Unknown token: '${this.#cur_tok.value}'`;
		}
	}

	parse_expression() {
		if (!this.#get_next_tok()) {
			return null;
		}

		return this.#parse_expression();
	}
};
