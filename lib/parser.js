import {SymbolType, Symbol, Node, AST} from "./tree.js";
import {Lexer, TokenType} from "./lexer.js";

function clean_str(input) {
	return input.replace(/\s+/g, "").replace(")(", ")*(");
}

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
			throw new Error("Expected ')'");
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

	#parse_unop() {
		let node;
		switch (this.#cur_tok.value) {
			case SymbolType.PLUS:
				this.#get_next_tok(); // Pop +
				node = new Node(this.#cur_tok.value);
				this.#get_next_tok(); // Pop number
				return node;
			case SymbolType.MINUS:
				this.#get_next_tok(); // Pop -
				node = new Node(-this.#cur_tok.value);
				this.#get_next_tok(); // Pop number
				return node;
			default:
				throw new Error(`Unkown unary operator '${operator_node.value.type}'`);
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
			case TokenType.Operator: // Unary operator
				tok = this.#parse_unop();
				return tok;
			default:
				throw new Error(`Unknown token: '${this.#cur_tok.value}'`);
		}
	}

	parse_expression() {
		if (!this.#get_next_tok()) {
			return null;
		}

		return this.#parse_expression();
	}

	evaluate() {
		const ast = new AST(this.parse_expression());
		return ast.traverse();
	}
};

export {Parser};
