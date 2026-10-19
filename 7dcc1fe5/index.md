# ES6 学习笔记：基础语法与迭代

- URL: https://blog.no-claw.com/7dcc1fe5/
- 日期: 2018-09-05
- 分类: 软件 / 编程
- 标签: 开发, JavaScript

ES6对JavaScript做了许多更新。

##### 1. let 和const

let所声明的变量只在当前代码块有用，const的嘛，学过c的人都知道，声明一个不可更改的变量。所以var我们就不再需要了。for 循环可以这样写：

```
for (let i=0; i<N; ++) {
	console.log(i);
}
```

##### 2.模板字面量

模板字面量本质上是包含嵌入式表达式的字符串字面量。如果你想把数字转换成字符这个东西就很有用了。有点类似python字符串的format，同时也比使用+连接字符串更加美观。

```
name = 'toy';
`name：${name}`;
```

##### 3.解构（数组解构和对象解构）

还是拿python举例子，python有个东西叫做元组解包。是这个样子：

```
a, b = (1,2)
```

那么在ES6中，如果是数组解构就要把变量写成数组的方式，对象解构就要写成对象的形式。

```
//数组解构
const [a, b] = [1,2]
//对象解构
const gemstone = {
  type: 'quartz',
  color: 'rose',
  karat: 21.29
};

const {type, color, karat} = gemstone;
```

##### 3.对象字面量简写法

如果使用和所分配的变量名称相同的名称初始化对象，那么我们就可以简写。

```
let type = 'quartz';
let color = 'rose';
let carat = 21.29;

const gemstone = {
  type,
  color,
  carat,
  calculateWorth: function() {
    // 将根据类型(type)，颜色(color)和克拉(carat)计算宝石(gemstone)的价值
  }
};
```

不过这里也可以省略function的关键字。

```
let gemstone = {
  type,
  color,
  carat,
  calculateWorth() { ... }
};
```

[图：ES6 学习笔记：基础语法与迭代配图]

####4.迭代
先说说收JS里的for循环。

###### version1： 普通的for循环

遍历数组，输出数组的元素。

```
const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

for (let i = 0; i < digits.length; i++) {
  console.log(digits[i]);
}
```

###### version2：for …in 循环

for…in循环迭代的是数组的下标。

```
const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

for (const index in digits) {
  console.log(digits[index]);
}
```

###### version3: for…of循环

这个迭代的才是数组的元素。

```
const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

for (const digit of digits) {
  console.log(digit);
}
```

##### 5. 展开运算符合剩余参数

这个和python的\*arg和\*\*arg有点像。

###### 展开运算符

使用展开运算符相当于把元素与各一个取出来。

```
const books = ["Don Quixote", "The Hobbit", "Alice in Wonderland", "Tale of Two Cities"];
console.log(...books);
```

这里的结果是输出一个个的字符串，如果直接输出books的话，我们得到的就是数据结构就是array。

###### 剩余参数

这个在解构和函数参数传递的时候用的比较多。
剩余参数匹配的是一个数组。

```
function sum(...nums) {
  let total = 0;
  for(const num of nums) {
    total += num;
  }
  return total;
}
```
