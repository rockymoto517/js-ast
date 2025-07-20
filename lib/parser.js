import {SymbolType, Symbol, Node, Tree} from "./tree.js";

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
function _parse_expression(input) {
	const clean_input = clean_str(input);
	let cur_node = new Node();
	console.log(clean_input);

	let symbol_idx = get_next_operation(clean_input);
	if (!symbol_idx) {
		// we're at the end of the expression
		const end = clean_input.match(/[^0-9]/);
		if (end) {
			return new Node(Number(clean_input.substring(0, end.index)));
		}
		return new Node(Number(clean_input));
	}


	// left side of operator
	let end;
	if (clean_input[0] === "(") {
		end = get_matching_parentheses(clean_input.substring(1));
		if (end > symbol_idx) {
			cur_node.left = new Node(Number(clean_input.substring(1, symbol_idx)));
		}
		else {
			cur_node.left = _parse_expression(clean_input.substring(1, end + 1));
		}
	} else if (is_number(clean_input[0])) {
		cur_node.left = new Node(Number(clean_input[0]));
	}

	// If there is a set of parentheses, grab the operator outside
	// but only if the parentheses doesn't enclose the only expression
	if (end && end !== clean_input.length - 2) {
		symbol_idx = get_next_operation(clean_input.substring(end + 1)) + end + 1;
	}

	cur_node.value = get_symbol(clean_input[symbol_idx]);
	cur_node.right = _parse_expression(clean_input.substring(symbol_idx+1));

	return cur_node;
}

function parse_expression(input) {
	return new Tree(_parse_expression(input));
}

const t = parse_expression("(5*5)+(5+5)");
console.log(t.traverse());
