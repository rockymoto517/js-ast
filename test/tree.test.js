import assert from "assert";
import {SymbolType, Symbol, Node, Tree} from "../lib/tree.js";

const t = new Tree(new Node());
t.head.value = new Symbol(SymbolType.PLUS);
t.head.left = new Node(3);
t.head.right = new Node(new Symbol(SymbolType.STAR));
t.head.right.left = new Node(4);
t.head.right.right = new Node(14);

try {
	assert.strictEqual(t.traverse(), 59)
	console.log("Ok\n");
} catch(_) {
	console.log("Not ok\n");
}
