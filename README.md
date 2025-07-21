# Library for evaluating arithmetic expressions in pure JS


## Example
```
console.log(parse_arithmetic("(15*2)/4+15*1.5")) // outputs 30
```

## Other Uses
This library also evaluates variables within arithmetic expressions. In order to use them, you must modify the tree to replace the variables with actual values before evaluating!

## Resources Used
* https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/LangImpl01.html
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
