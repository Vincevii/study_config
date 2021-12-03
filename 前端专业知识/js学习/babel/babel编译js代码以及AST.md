# 一.babel编译JS代码的三个阶段

1. 编译（parse）  将代码字符串解析成抽象语法树
2. 转换（transform） 将抽象语法树进行转换操作
3. 生成（generate）  根据转换后的抽象语法树生成代码字符串

![image](C:/Users/Administrator/Desktop/PPT%E8%B5%84%E6%96%99/babel%E8%AF%BE%E7%A8%8B/%E8%A7%A3%E6%9E%90%E9%98%B6%E6%AE%B5.png)

# 二. 什么是抽象语法树 AST

```
把我们的代码，翻译成为计算机能“看懂”的语言。
```

# 三. AST的产生

由上面的阶段图可以看出，babel工作的第一步就是解析，在实际的运行中，babel的解析分为两步：

1. 分词：将整个代码字符串分割为 语法元数组
2. 语义解析：在分词结果的基础之上分析 语法单元之间的关系

## 分词

语法单元：解析语法中具备实际意义的最小单元，语法单元再被拆分就无实际意义。

JS代码中的语法单元：

1. 空白。 JS中连续的空格，换行，缩进等这些如果不在字符串里面，就没有任何实际的意义，因此我们可以将连续的空白组合在一起作为一个语法单元。
2. 注释。 行注释或块注释，对于编写人或维护人注释是有意义的，但是对于计算机来说知道这是个注释就可以了，并不关心注释的含义，因此我们可以将
   注释理解为一个不可拆分的语法单元。
3. 字符串。 对计算机而言，字符串的内容会参与计算或显示，因此有可以为一个语法单元。
4. 数字。 JS中有16，10，8进制以及科学表达式等语法，因此数字也可以理解一个语法单元。
5. 标识符。没有被引号括起来的连续字符，可包含字母 _, $ 及数字，或 true, false等这些内置常量，或 if，return，function等这些关键字。
6. 运算符。 +, -, *, /, >, < 等。
7. 其他。比如括号，中括号，大括号，分号，冒号，点等等。

可以看如下代码，如何获得分词：

```
if (1 > 0) {
  alert("vince");
}
```

经过一系列的处理之后，我们可以得到：

```
[
    {type: "whitespace", value: "\n"},
    {type: "identifier", value: "if"},
    {type: "whitespace", value: " "},
    {type: "parens", value: "("},
    {type: "number", value: "1"},
    {type: "whitespace", value: " "},
    {type: "operator", value: ">"},
    {type: "whitespace", value: " "},
    {type: "number", value: "0"},
    {type: "parens", value: ")"},
    {type: "whitespace", value: " "},
    {type: "brace", value: "{"},
    {type: "whitespace", value: "\n"},
    {type: "identifier", value: "alert"},
    {type: "parens", value: "("},
    {type: "string", value: "'vince'"},
    {type: "parens", value: ")"},
    {type: "sep", value: ";"},
    {type: "whitespace", value: "\n"},
    {type: "brace", value: "}"},
    {type: "whitespace", value: "\n"}
  ]
```
