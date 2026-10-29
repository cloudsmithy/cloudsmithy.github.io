---
title: 刷完 Udacity JavaScript 入门课后的笔记
date: '2018-08-04 10:21:44'
updated: '2026-09-24 11:00:00'
abbrlink: d536f3ad
categories:
- 软件
- 编程
tags:
- JavaScript
- 开发
series: 早期编程学习笔记
description: 保留为学习微信小程序而补 JavaScript 的经历，整理类型、相等比较、真假值、作用域、函数、数组与对象，并补齐可运行例子。
source_platform: 简书
source_url: https://www.jianshu.com/p/a0f298f5716e
source_title: 刷完udacity的JavaScript，我想说……
toc: true
---

刷完了 Udacity 上 JavaScript 的入门课，纯粹为了学习开发小程序而补的前端知识。

一开始在 SoloLearn 上最先接触 JS，只用了三个小时不到就把证书刷下来了，这毕竟是我在 SoloLearn 的第一个证书，先炫一下哈！原文放过证书截图，但和其余课程图片一样，这次没有恢复出来。

下面保留 2018 年笔记的学习顺序。原先依赖截图的例子改成了本次整理补充的文字代码，并修正相等比较、作用域和 `typeof` 的几处说法。

[早期编程学习目录](/series/early-programming/)

## 数据类型和变量

当时先接触过 Java，再看 JS 的花括号、函数调用和循环，觉得比较熟悉。但 JavaScript 与 Java 是两门不同的语言，不能从表面语法相似推断它们的数据类型和对象模型相同。

JavaScript 的值有类型，变量可以在不同时间保存不同类型的值。原稿使用 `var`：

```javascript
var name = 'javascript';
var age = 25;
var pi = 3.14;
var message = ['hello', 'nihao'];

age = 'twenty-five';
console.log(typeof age); // string
```

这里的动态类型和 Java 的局部变量类型推断不是一回事。原稿说“Java 9 也使用 var”，实际是 Java 10 引入了这一特性；推断出的局部变量类型仍然是静态类型。

单引号和双引号都可以表示字符串，我当时更习惯单引号。模板字符串使用反引号，可以嵌入表达式。

### 字符串拼接

```javascript
console.log('age: ' + 25); // age: 25
console.log('5' + 1);     // 51
console.log('5' - 1);     // 4
```

加号既用于数值相加，也用于字符串拼接；不同运算符的类型转换规则不能混为一谈。读输入数据时，先明确它是字符串还是数字。

### 相等比较

原稿把 `==` 记成“只比较数值”，这个说法不够准确。宽松相等会在部分情况下进行类型转换，严格相等 `===` 不做这类转换：

```javascript
console.log(5 == '5');   // true
console.log(5 === '5');  // false
console.log(null == undefined); // true
console.log(null === undefined); // false
```

严格相等也不能概括成“同类型、同内容就一定相等”。对象比较的是引用，`NaN` 也有自己的比较规则：

```javascript
console.log([] === []); // false
console.log(NaN === NaN); // false
console.log(Number.isNaN(NaN)); // true
```

## 真值、假值与条件表达式

在条件判断中，常见假值有 `false`、`undefined`、`null`、`0`、`-0`、`NaN` 和空字符串。现代 JavaScript 中的 `0n` 也是假值。

空数组、空对象和字符串 `'0'` 都是真值：

```javascript
console.log(Boolean([]));   // true
console.log(Boolean({}));   // true
console.log(Boolean('0'));  // true
console.log(Boolean(''));   // false

const score = 80;
console.log(score >= 60 ? '通过' : '未通过'); // 通过
```

三元运算符适合短的条件表达式，判断和处理过程较长时，普通 `if` 更容易读。

## 函数：输出和返回是两件事

```javascript
function greet(name) {
    console.log('hello, ' + name);
}

function makeGreeting(name) {
    return 'hello, ' + name;
}

const printed = greet('JS');
const returned = makeGreeting('JS');
console.log(printed);  // undefined
console.log(returned); // hello, JS
```

`console.log` 输出日志，`return` 决定调用者拿到的返回值。函数没有执行带值的 `return` 时，返回 `undefined`。

### 作用域和参数

`var` 主要按函数作用域工作，`let` 和 `const` 有块级作用域。传参时，值会复制给参数；对象的这个值是引用，所以通过引用修改对象内容，会影响调用者看到的同一个对象。

```javascript
function change(item) {
    item.name = 'changed';
    item = { name: 'another object' };
    return item;
}

const original = { name: 'before' };
const replacement = change(original);
console.log(original.name);    // changed
console.log(replacement.name); // another object
```

修改同一对象的属性，与让参数指向另一个对象，是两件不同的事。原笔记用“引用传递”概括这一点，容易让人误以为重新赋值参数也会替换外面的变量。

### 声明、提升与函数表达式

在普通函数作用域里，函数声明可以在声明位置之前调用；`var` 的声明会提前建立，但赋值仍然留在原来的执行位置：

```javascript
console.log(add(2, 3)); // 5
function add(a, b) {
    return a + b;
}

console.log(value); // undefined
var value = 10;
```

函数表达式则要等赋值执行后，变量才保存了那个函数：

```javascript
const multiply = function (a, b) {
    return a * b;
};
console.log(multiply(2, 3)); // 6
```

不要把前面的 `var` 规则直接套给 `let`、`const`。它们在初始化之前处于暂时性死区，提前访问会报错。

### 回调与有名函数表达式

函数可以作为值保存和传递。把函数交给另一个函数，再由后者调用，就是常见的回调用法；回调不一定异步。

```javascript
function calculate(a, b, operation) {
    return operation(a, b);
}
console.log(calculate(2, 3, function (a, b) {
    return a + b;
})); // 5

const factorial = function fact(n) {
    return n <= 1 ? 1 : n * fact(n - 1);
};
console.log(factorial(4)); // 24
```

例子中的 `fact` 用于函数内部引用自身。有名函数表达式与把函数保存到外部变量，是两个相关但不同的名字。

## 数组

JavaScript 的数组让我想起 Python 的 list：都可以顺序保存元素，也可以按下标访问，但两种语言的行为不能逐项照搬。

```javascript
const numbers = [1, 2, 3];
numbers.push(4);

for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i]);
}

const visited = [];
numbers.forEach(function (value) {
    visited.push(value);
});

const doubled = numbers.map(function (value) {
    return value * 2;
});
console.log(visited); // [1, 2, 3, 4]
console.log(doubled); // [2, 4, 6, 8]
```

`forEach` 逐项执行回调，`map` 按回调的返回值产生新数组。用 `map` 时忘记返回值，得到的就可能是一组 `undefined`。

## 对象和 typeof

对象可以用属性保存数据，用方法组织行为：

```javascript
const player = {
    name: 'JS learner',
    level: 1,
    describe: function () {
        return this.name + ' / level ' + this.level;
    }
};
player.level = 2;
player['favorite language'] = 'JavaScript';
console.log(player.describe()); // JS learner / level 2
```

`typeof` 是运算符，不是普通函数。写成 `typeof(value)` 能工作，是因为括号把表达式括了起来。它也不能单独区分所有对象类型：

```javascript
console.log(typeof 1);       // number
console.log(typeof 'hello'); // string
console.log(typeof {});      // object
console.log(typeof []);      // object
console.log(typeof null);    // object
console.log(Array.isArray([])); // true
```

学完基础语法之后，当时接着做的就是[微信小程序后端](/84f0a0d4/)；后来在 [RPG Maker MV 插件](/34cce265/)里，也用到了函数、对象和原型这些知识。

## 整理时对照的资料

- [MDN：相等比较](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)
- [MDN：函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN：typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
- [OpenJDK JEP 286：局部变量类型推断](https://openjdk.org/jeps/286)
