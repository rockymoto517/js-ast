const SymbolType = Object.freeze({
	PLUS: "+",
	MINUS: "-",
	STAR: "*",
	SLASH: "/",
});

class Symbol {
	type;

	constructor(c) {
		switch (c) {
			case "+":
				this.type = SymbolType.PLUS;
				break;
			case "-":
				this.type = SymbolType.MINUS;
				break;
			case "*":
				this.type = SymbolType.STAR;
				break;
			case "/":
				this.type = SymbolType.SLASH;
				break;
			default:
				throw `Unknown symbol type '${c}'`;
		}
		this.type = this.type;
	}

	calculate(lval, rval) {
		if (!lval || !rval) {
			return null;
		}

		lval = Number(lval);
		rval = Number(rval);

		switch (this.type) {
			case SymbolType.PLUS:
				return lval + rval;
			case SymbolType.MINUS:
				return lval - rval;
			case SymbolType.STAR:
				return lval * rval;
			case SymbolType.SLASH:
				return lval / rval;
			default:
				return null;
		}
	}
}

class Node {
	left = null;
	right = null;
	value = null;

	constructor(_value = null, _left = null, _right = null) {
		this.value = _value;
		this.left = _left;
		this.right = _right;
	}
}

class AST {
	head = null;

	constructor(_head = null) {
		this.head = _head;
	}

	#_traverse(node) {
		let left;
		if (node.left) {
			left = this.#_traverse(node.left);
		}
		let right;
		if (node.right) {
			right = this.#_traverse(node.right);
		}

		if (left && right) {
			return node.value.calculate(left, right);
		} else {
			return node.value;
		}
	}

	traverse() {
		if (this.head !== null) {
			// console.log(this.head);
			return this.#_traverse(this.head);
		} 	

		return null;
	}
}

export {SymbolType, Symbol, Node, AST};
