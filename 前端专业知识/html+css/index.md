# 选择器

1. 常用选择器

   1. 标签选择器：p span
   2. id选择器：#
   3. class选择器：.
   4. 泛选择器：*
2. 复合选择器

   1. 交集选择器：选择器1选择器2选择器n -- 标签选择器要在最前面
   2. 并集选择器：选择器1，选择器2，选择器n
3. 关系选择器

   1. 父子选择器：div > span
   2. 后代选择器：div span
   3. 兄弟选择器：
      1. 只选下一个：前一个 + 下一个
      2. 选下面所有的：兄 ~ 弟
4. 属性选择器

   1. [属性名]选择含有此属性的所有元素： p[title]{}
   2. [属性名=属性值]选择含有指定属性和属性值元素：p[title = abc]
   3. [属性名^=属性值]选择属性值以指定值开头元素:[title^=abv]
   4. [属性名$=属性值]选择属性值以指定值结尾元素:[title$=abv]
   5. [属性名*=属性值]选择含有属性值元素:[title*=abv]
5. 伪类选择器

   1. 伪类（不存在，特殊的类）：用来描述一个元素特殊状态（第一个子元素，被点击的元素，鼠标移入的元素....）
   2. 伪类以:开头
      1. :first-child 第一个子元素
      2. :last-child 最后一个子元素
      3. :nth-child(n) 选择第n个子元素
         - 以上伪类，需要考虑所有子元素，进行排序
      4. :first-of-type
      5. :last-of-type
      6. :nth-of-type(n)
         - 以上伪类与上述类似，不同点是他们在同类型元素中排序
      7. :not() 否定伪元素：:not(:nth-child(3))
         - 将符合条件的元素从选择器中去除
   3. a元素的伪类
      1. :link 用来表示正常的链接（没访问过）
      2. :visited 用来表示访问过的链接
         - 由于隐私原因，只能修改颜色
   4. :hover 表示鼠标移入
   5. :active 表示鼠标点击
6. 伪元素

   1. 伪元素，表示特殊的，不存在的元素（特殊位置），以::开头
   2. ::开头
      1. ::first-letter 表示第一个字母
      2. ::first-line 表示第一行
      3. ::first-selection 表示选择的内容
      4. ::before 表示元素的开始
      5. ::after 表示元素的最后
         - before和after必须结合content属性使用
         - div::before { content: 'abc' }
7. 样式继承

   1. 我们为一个元素设置样式，也会应用到它的后代元素
   2. 继承设计是为了方便开发，利用继承我可以将通用样式设置到共同的祖先元素，这样只需设置一次
   3. 不会继承的样式：背景相关，布局相关等
8. 选择器权重

   1. 选择器冲突发生样式冲突，由选择器优先级决定
   2. 比较优先级时，应用哪个样式由选择器权重相加决定：
      1. 内联样式 权重：1000
      2. id选择器 权重：100
      3. 类和伪类选择器  权重：10
      4. 元素选择器  权重：1
      5. 通配选择器 权重: 0
      6. 继承的样式 没有权重
   3. 复合选择器，分别计算，不会相加
   4. 选择器累加不会超过最大的量级，类选择器再高也不会超过ID选择器
   5. 如果优先级相等，则优先使用靠后的样式
   6. 可以通过样式后面加!important，此时此样式会获得最高优先级，超过内联
      - 开发中需要慎用

# 单位

1. 像素和百分比
   1. 长度单位
      1. 像素：
         - 显示器实际上由一个一个像素构成
         - 不同显示器像素大小不同，像素越小屏幕约清晰
         - 所以同样的200px在不同设备，显示效果不一样
      2. 百分比
         - 也可以将属性相对于父元素属性的百分比
         - 设置百分比，可以使子元素跟随父元素改变而改变
      3. em
         - em相对于元素的字体大小计算
         - em根据字体大小改变
      4. rem
         - rem相对于根元素（html）字体大小计算

# 布局

## 文档流

- 网页是一个多层的结构，一层叠着一层
- 通过css可以分别为每一层设置样式
- 作为用户只能看到最顶上一层
- 这些层中， 最底下的一层称作文档流
  - 我们创建的元素，都是在文档流里面进行排列
- 元素主要有两个状态
  - 在文档流中
  - 脱离文档流中
- 元素在文档流中有什么特点：
  - 块级元素
    - 块元素在页面中独占一行
    - 默认宽度是父元素的全部，会把父元素撑满
    - 默认高度被内容（子元素）撑开
  - 行内元素
    - 行内元素不会独占一行，只占自身的大小
    - 行内元素自左向右水平排列，如果一行不能容纳行内，则会换行
    - 行内元素大小宽度和高度都被内容撑开

## 盒子模型

- css将页面所有元素设置为了一个矩形的盒子
- 盒模型组成：
  - 内容区（content）
    - 所有元素和文本都是在内容区排列
    - 内容区大小由width与height决定
  - 内边距 padding
  - 边框 border
    - 边框大小会影响盒子大小
    - 边框属于盒子边缘，边框外属于盒子外部
    - 边框需要三个样式
      - 宽度：border-width
      - 颜色: border-color
      - 样式：border-style
  - 外边距 margin

### 边框

- 宽度：border-width
  - 有默认值
  - 可以指定四个方向宽度
- 颜色: border-color
  - 省略不写，自动使用color颜色值
  - 可以指定四个方向的颜色
- 样式：border-style
  - 样式：
    - none 没有边框（默认值）
    - solid 直线
    - dotted 点状虚线
    - dashed 虚线
    - double 双线
- 简写属性：通过此属性可以设置边框所有属性，并且没有顺序
  - border：10px solid orange
  - 同样可以分别设置四个方向

### 内边距

- 定义：内容与边框之间的距离叫内边距
- 一共有四个方向：
  - padding-top
  - padding-right
  - padding-left
  - padding-bottom
- 内边距会影响盒子大小
- 背景颜色会延伸到内边距
- 简写：padding:10px 10px 10px 10px

==一个盒子的可见框大小，由内容区 + 内边距 + 边框共同决定==

### 外边距

- 外边距不会影响盒子可见框的大小，只会==影响盒子实际占用空间==
- 但是会影响盒子的位置
- 同样拥有四个方向的外边距
  - top
  - right
    - 一般由浏览器自动设置
  - bottom
  - left
  - margin设置为负值，就会向相反方向移动
- 元素在页面中是按照自左向右顺序排序
  - 设置左边和上外边距会移动自身
  - 设置右和下，就是移动其他元素
- 简写：margin:10px 10px 10px 10px

### 水平布局

- 元素在父元素中的水平方向位置，由以下几个属性决定：
  - margin（padding border）-left
  - width
  - margin（padding border）-right
- 一个元素在父元素中，水平布局必须满足以下等式：
  - margin（padding border）-left + width +  margin（padding border）-right = 其父元素内容区宽度（==必须满足==）：0+0+0+200+0+0+0 =800？
  - 以上等式必须成立，如果相加结果不成立，则称为过度约束，浏览器会自动调整，调整情况：
    - 如果七个值没有auto情况，则浏览器会自动调整margin-right值
    - 以上例子，margin-right就会变化600px
    - 七个值有三个值可以设置为auto：width，margin-left，margin-right
    - width的auto优先级最高
    - 如果两个margin值都设置为auto，宽度固定，此时margin会设置为相同
      - ==利用这个特性，可以设置元素在父元素内水平居中==
    - 设置了浮动的话，此等式不会成立

### 垂直布局

- 默认情况下，父元素高度被内容撑开
- 子元素是在父元素内容中排列的
  - 如果子元素大小超过父元素，则子元素会溢出，使用overflow属性设置父元素处理溢出情况：
    - visible 溢出部分可以显示（默认）
    - hidden 溢出部分会裁剪不显示
    - scroll 生成两个滚动条，通过滚动条查看完整内容
    - auto 根据需要生成滚动条
  - over-flow-x设置水平方向溢出
  - over-flow-y设置垂直方向溢出

### 垂直外边距折（重）叠

相邻的垂直方向外边距会发生重叠

- 兄弟元素
  - 兄弟元素间的相邻垂直外边距会取两者之间的较大值（正值情况）
  - 特殊情况：
    - 相邻外边距一正一负，取两者的和
    - 相邻外边距都是负值，则取两者中的较大值
  - 兄弟元素的重叠是有利的，所以不需要处理
- 父子元素
  - 父子之间的相邻外边距，子元素会传递给父元素（上外边距）
  - 父子外边距折叠，会影响布局，必须处理：
    - 使用父元素padding处理
    - 使用border去掉相邻这个前置条件
    - 用table解决
    - 给父级块级元素触发一个BFC 块级上下文

### 行内元素盒模型

- 盒模型：
  - 行内元素不支持设置宽度和高度
  - 行内元素可以设置padding，但是垂直方向的padding不影响布局
  - 行内元素可以设置border，但是垂直方向的border不影响布局
  - 行内元素可以设置margin，但是垂直方向的margin不影响布局
- display 用例设置元素显示类型
  - inline 将元素设置为行内元素
  - block 将元素设置为块元素
  - inline-block 将元素设置为行内块元素
    - 既可以设置宽度和高度，又不会独占一行
  - table 将元素设置为表格
  - none 元素不在元素内显示，==隐藏不占位==
- visibility 用来设置元素显示状态
  - visible 元素在页面中正常显示
  - hidden 元素在页面中隐藏 ==不显示但是占位==

## 浏览器默认样式

- 通常情况，浏览器会为元素设置一些默认样式
- 默认样式存在会影响页面布局，编写时一般需要去除默认样式（PC）

```
* { 
    margin: 0;
    padding:0
}
```

- 可以使用重置样式表进行重置

## 盒子大小

- 默认情况下：盒子可见框大小 = 内容区 + 内边距 + 边框
  - box-sizing，用来设置盒子尺寸的计算方式（设置width和height的作用）
    - 可选值：
    - content-box 默认值，宽度和高度用来设置内容区大小
    - border-box 宽度和高度用来设置整个盒子的可见框的大小
      - width和height 指的是内容区 和 内边距 和 边距的总大小

## 轮廓阴影和圆角

- outline：用来设置元素的轮廓线，用法与border一致
  - 轮廓和边框的不同点，就是轮廓不会影响可见框大小
- box-shadow：用来设置阴影效果，阴影不会影响布局
  - 阴影的大小与元素的大小是一致的，初始状态在元素的下方
  - 第一个值 水平偏移量，设置阴影的水平位置，正值向右移动，负值向左移动
  - 第二个值 垂直偏移量，设置阴影的垂直位置，正值向下移动，负值向上移动
  - 第三个值 阴影的模糊半径，值越大越模糊
  - 第四个值 阴影颜色
- border-radius：用来设置圆角，设置的是半径大小
  - 可以直接设置四个值，从左到右，从上到下
  - 两个值就是，对角线一致
  - 如果想要把元素设置为圆形：border-radius:50%
- border-top-left-radius
- border-bottom-right-radius
  - 第一个值，xxpx，指的是半径为xxpx的圆
  - 第二个值，当有第二个值时，指的是垂直方向上的半径，此时就变为了椭圆

# 浮动

- 通过浮动可以使一个元素向其父元素的左侧或右侧移动
  - 使用float 属性来设置元素的浮动
  - 可选值：
    - none 默认值，不浮动
    - left 元素向左浮动
    - right 元素向右浮动
  - ==注意元素设置浮动后，水平布局的等式就不需要强制成立==
    - ==注意浮动后，会完全从文档流脱离，不再占用文档流位置==
      - 所以元素下面的还在文档流中的元素会自动向上移动
  - 浮动特点：
    - 浮动元素会完全脱离文档流，不再占据文档流中的位置
    - 设置浮动后，元素会向父元素的左侧或右侧移动
    - 浮动元素默认不会从父元素中移出
    - 浮动元素向左或向右移动，不会超过他前面的其他元素
    - 如果浮动元素上边是一个没有浮动的块元素，则浮动元素无法上移
    - 浮动元素不会超过他上边的浮动兄弟元素，最多和他一样高
  - 简单总结：
    - 浮动主要作用，就是让页面中的元素可以水平排列
      - 通过浮动可以制作一些水平方向的布局
  - 进阶运用特点：
    - 浮动元素不会覆盖文字，文字会自动环绕在浮动元素的周围
      - 所以我们可以利用浮动来设置文字环绕图片的效果
- 脱离文档流的特点
  - 块元素
    - 块元素不再独占一行
    - 脱离文档流后，宽度和高度默认被内容撑开
  - 行内元素
    - 行内元素脱离文档流就会变成块元素，特点和块元素一致
  - 脱离文档流后，不需要区分块元素和行内元素

# 高度塌陷和BFC

## 高度塌陷问题

- 在浮动布局中，父元素的高度默认是子元素撑开
  - 当子元素浮动后，会完全脱离文档流，子元素从文档流中脱离
  - 将会无法撑起父元素高度，导致父元素的高度塌陷
- 父元素高度丢失以后，其下的元素会自动上移，导致布局混乱

## BFC 块级格式化环境

- BFC是一个CSS中隐含的属性，可以为一个元素开启BFC
  - 开启BFC该元素会变成一个独立的布局区域
- 元素开启BFC后的特点：
  - 开启BFC的元素不会被浮动元素覆盖
  - 开启BFC的元素子元素和父元素的外边距不会重叠
  - 开启BFC的元素可以包含浮动的子元素
- 如何开启BFC：
  - 设置元素的浮动
  - 设置为行内块元素：inline-block
  - overflow设置为非 visible，一般为hidden
  - 定位：绝对和fixed

## 用clear解决高度塌陷：

- 如果不希望某个元素因为其他元素浮动的影响而改变位置，可以通过clear属性来清除浮动元素对当前元素产生的影响
- clear
  - 作用，清除浮动元素对当前元素所产生的影响
  - 可选值：
    - left 清除左侧浮动元素对当前元素的影响
    - right 清除右侧浮动元素对当前元素的影响
    - both 清除两侧中最大影响的那个
  - 原理：设置清除浮动以后，浏览器会自动为元素添加一个上外边距，以使其位置不受其他元素影响

## 用伪元素after解决高度塌陷问题（副作用最小）

- 在父元素中加入伪类after，并且设置clear:both，display:block，即可解决
- 原理就是利用伪元素after添加了模块，设置为clear，此时末尾元素不受浮动影响，会在浮动元素右侧，然后由于设置为块级，就会撑开父元素

## clearfix

- 利用以上类似的原理，可以解决垂直外边距折（重）叠，可以搜索 垂直外边距折（重）叠
- 使用伪元素before，给子元素前加一个子元素，并设置为display：table;content:""
- 此时真实的子元素与父元素不相邻，这时margin的重叠问题就可以解决

```
// 这个样式可以解决高度塌陷和外边距重叠的问题
.clearfix::before,
.clearfix::after {
    content:"",
    display:table,
    clear:both
}
```

# 定位 position

- 是一种更加高级的布局手段
- 通过定位可以将元素任意摆放到页面任意的位置
- 使用position属性来设置定位
  - 可选值
  - static 默认值，元素是静止的没有开启定位
  - relative 元素相对定位
  - absolute 绝对定位
  - fixed 固定定位
  - sticky 粘滞定位

## 偏移量 offset

- 定位时重要属性
- 当元素开启定位以后，可以通过偏移量来设置元素的位置
  - top：定位元素与定位位置上边距离
  - bottom ：定位元素与定位位置下边距离
    - 垂直方向上通常情况只会用top和bottom其中一个
  - left：定位元素与定位位置左边距离
  - right：定位元素与定位位置右边距离
    - 水平方向上，通常情况下只会使用一个

## 包含块（content block）

- 绝对定位会用得到
- 正常情况下：
  - 包含块就是离当前元素最近的祖先块元素
  - <div><span><em></em></span></div>
  - 此时em的包含块为div，因为span为行内元素
- 绝对定位的包含块：
  - 包含块是离他最近开启了定位的祖先元素
  - 如果所有祖先元素没有开启定位，则根元素就是他的根元素
- html（根元素，初始根元素）

## 相对定位 relative

- 当元素属性值设置为relative，则开启了元素的相对定位
- 相对定位特点
  - 元素开启相对定位后，不设置偏移量， 元素不会发生任何变化
  - 相对定位是参照于元素在文档流中的位置进行定位
  - 相对定位会提升元素层级，会高于文档流
  - 相对定位不会使元素脱离文档流
  - 相对定位不会改变元素性质，块还是块，行内还是行内

## 绝对定位

- 当元素的position属性值，设置为absolute则开启绝对定位
- 绝对定位特点：
  - 开启绝对定位后，如果不设置偏移量，**元素位置**不会变化
  - 元素会脱离文档流
  - 改变元素性质，行内变成块元素，块的宽高被内容撑开
  - 绝对定位会使元素提升一个层级
  - 绝对定位是参照于其==包含块==进行定位的

## 固定定位

- 当元素的position属性值，设置为fixed则开启固定定位
- 固定定位也是一种绝对定位，所以固定定位大部分特点与绝对定位一样
  - 唯一不同的是，固定定位永远参照于==浏览器的可视窗口==进行定位
    - 固定定位的元素不会随网页的滚动条滚动

## 粘滞定位

- 当元素的position属性值，设置为sticky则开启固定定位
- 粘滞定位于相对定位的特点基本一致，不同的是粘滞定位可以在元素到达某个位置时固定

## 使用绝对定位的时候注意

- 水平布局
  - 不开启定位时：包含块内容区宽度 = ml + bl + pl + width + br + pr + mr
  - 开启定位时：左右需要加上left和right
    - 此时规则与之前一致，只是多了两个值
      - 发生过度约束时：
        - 如果9个值中没有auto则自动调整right以使等式满足
        - 如果有auto，则调整auto的值
      - 可设置auto的值
        - margin，width，left，right
      - left和right默认为auto，系统会优先调整这两个值
- 垂直方向布局的等式也必须要满足
  - top + mt + mb + pt + pb + bt + bp + height = 包含块的等式
  - 垂直居中可以在绝对定位前提下：固定宽度，top和bottom设置为0，mt和mb设置为auto

## 元素层级

对于开启了定位的元素，可以通过z-index属性来指定元素的层级

- z-index需要整数为参数，值越大元素的层级越高
  - 元素的层级越高越优先展示
- 元素层级如果一致，优先显示靠下的元素
- 祖先元素的层级再高，也不能盖住后代元素

# 字体族

## 字体相关样式

- color 用来设置字体颜色
- font-size 字体大小
  - 相关的单位
  - em 相当于当前元素的一个font-size
  - rem 相当于跟原色的一个font-size
- font-family 字体族（字体格式）
  - 可选值：
    - serif 衬线字体
    - sans-serif 分衬线字体
    - monospace 等宽字体
      - 指定字体类别，浏览器会自动使用该类别下的字体，一般用来兜底
  - font-family可以同时指定多个字体，用“，”隔开，优先级从前到后
- 样式中写@font-face：可以将服务器的字体直接提供给用户使用

```
// 样式文件中
@font-face {
    font-family:"myfont";
    src:url('./font/xxxxxxxx')
}
```

## 图标字体

* 在网页中使用一些推奥，可以通过图片引入图标

  * 但是图片大小本身比较大，不灵活
* 可以使用图标，将图标设置为字体

  * 通过font-face引入
  * 优点：
    * 大小，颜色灵活改动
    * 相对图片体积更小

> 可以使用第三方图标字体库，推荐使用fontawesome，iconfont（阿里）

* 通过伪元素设置图标字体

  * 找到要设置的图标字体的元素通过before或者after
  * 在content中设置编码
  * 设置字体样式
    * font-family
    * coulor
    * font-weight
* 通过为实体使用图标字体

  * &#x图标的编码

## 行高

* 行高是：指文字占有的实际高度
  * 可以使用line-height来设置行高
    * 行高可以是一个大小（px em）
    * 也可以直接为行高设置一个整数
      * 字体指定的倍数
    * 行高经常用来设置文字的行间距
      * 行间距=行高-字体大小
* 字体框
  * 字体框是字体存在的格子，设置font-size实际上就是设置字体框的高度
* 行高会是在字体框的上下平均分配
  * `可以行高设置跟高度一样，这时单行在元素中垂直居中`

## 字体简写属性

font可以设置字体相关的所有属性

* 语法：
  * font：加粗 斜体 字体大小/行高 字体族
  * 行高 可以省略不写，如果不写会直接使用默认值去覆盖之前设置后的行高
  * 加粗和斜体如果不写，也是默认的

font-weight 字重 字体加粗

* 可选值：
  * normal：不加粗
  * bold：加粗
  * 100-900 九个级别

font-style 字体风格

* 可选值
  * normal
  * italic 斜体

```
加粗 斜体 字体大小/行高 字体族
font: bold italix 50px/2 Times, serif;
```

## 文本样式

### 文本的水平和垂直对齐

- text-align
  - left 左侧对齐
  - right 右侧对齐
  - center 居中对齐
  - justify 两端对齐
- vertical-align
  - baseline 默认值 基线对齐
  - top 顶部对齐
  - bottom 底部对齐
  - middle 居中对齐 （视觉效果上不是严格的居中）
- img标签的对齐方式跟文字类似，可以使用vertical-align解决底部缝隙问题

### 其他文本格式

* text-decoration 设置文本修饰
  * 可选值
    * none 默认值 什么都没有
    * underline 下划线
    * line-through 删除线
    * ouverline 上画线
* white-space 设置网页如何处理空白
  * 可选值
    * normal 正常
    * nowrap 不换行
    * pre 保留空白
  * 文本多出，省略号的实现
    * white-space: nowrap
    * overflow: hidden
    * text-overflow: ellipsis

# 背景

* 所有背景设置的属性

  * background-color 设置背景颜色
  * background-image: url("") // 设置背景图片
    * 颜色和图片可以同时设置，背景颜色会成为图片的背景色
    * 如果背景图片小于元素，图片则会自动平铺铺满
    * 如果背景图片大于元素，则一部分背景无法完全显示
  * background-repeat 设置背景的重复方式
    * repeat 默认值 背景沿着x轴，y轴双方向重复
    * repeat-x 背景沿着x轴延着方向重复
    * repeat-y 背景沿着y轴延着方向重复
    * no-repeat 图片不重复
  * background-position 设置背景图片的位置
    * 设置方式：
      * 通过 top left right bottom center 几个表示方位来设置背景
        * background-position: top center
      * 通过偏移量指定图片位置
        * 水平方向的偏移量 垂直方向的偏移量
        * background-position: 100px 100px
  * background-clip 设置背景的范围
    * border-box 背景会出现在边框下边
    * padding-box 背景不会出现在边框，只会出现在内容区和内边距
    * content-box 背景只会出现在内容区
  * background-origin 设置图片的偏移量计算的原点
    * padding-box：background-position从内边距开始计算
    * content-box：背景图片的偏移量从内容区处计算
    * border-box： 背景图片的偏移量从边框处开始计算
  * background-size 背景的尺寸
    * background-size: 100px 100px
    * 只设置一个值的时候，则第二个值默认为auto
    * background-size: 100% auto
    * 可选值
      * cover：图片比例不变，铺满元素
      * contain：图片比例不变，将图片在元素中完整显示：也等于100% auto
  * background-attachment
    * 背景图片是否跟随元素滚动
    * scroll 背景图片会跟随元素移动
    * fixed 背景会固定在页面不会移动
  * background
    * 背景相关的简写属性，所有背景相关的都可以在这里面写，没有顺序要求
    * background: #bfa url("") center center no-repeat

## 渐变

通过渐变可以设置一些复杂的背景颜色，可以从一个颜色向其他颜色过渡的效果

渐变是图片，需要通过background-image来设置

### 线性渐变

* background-image: linear-gradient(to right,red,yellow)
* linear-gradient沿着一条直线发生变化
* 表示红色在开头，黄色在结尾，中间是过渡区域
* 线性渐变的开头可以制定一个渐变的方向

  * to left
  * to right
  * to bottom
  * xxdeg: deg表示角度
* 渐变可以制定多个颜色，多个颜色默认下平均分配

  * 也可手动置顶渐变分布情况
  * background-image: linear-gradient(to right,red 50px,white,blue,yellow 70px)

### 径向渐变

- background-image: radial-gradient(red,yellow)

* 放射性的效果
* 默认情况下径向渐变圆心形状根据元素的形状来计算

  * 正方形 --》圆形
  * 长方形---〉椭圆形
  * 也可以手动置顶径向渐变的大小
    * background-image: radial-gradient(100px 100px,red,yellow)
    * circle
    * ellipse
  * 也可以指定渐变的位置
    * background-image: radial-gradient(100px 100px at 0 0,red,yellow)

# 表格

* 通过table标签来创建一个表格
* 通过tr来表示表格中的一行，有多少个tr表示有多少行
* tr中使用td表示一个单元格，有几个td就有几个单元格
* colspan 表示横向合并单元格
* rowspan 表示纵向合并单元格

## 长表格

* 可以在table标签内把一个表格分成是三个部分：
  * 头部 thead
  * 主体 tbody
  * 底部 tfoot

## 表格的样式

* table
  * width
  * border
  * margin
* td
  * border-spacing 指定边框直接的距离
  * border-collapse:collapse 设置边框的合并
  * 默认情况下，元素在td中是垂直居中的，可以通过vertical-align设置
    * display: table-cell    可以将元素设置为单元格td
    * 然后通过vertical-align:middle去设置垂直居中
* 如果表格中没有使用tbody，直接使用tr，那么浏览器会自动创建tbody，把tr全部放进去

## 表单

* form的属性
  * action 表单要提交的服务器地址
* form的子元素
  * input
    * type=text 文本框
    * type=submit 提交按钮
    * type=password 密码框
    * type=radio 单选按钮
      * 需要指定value属性，作为实际提交的值
      * 通过name可以进行分组
      * checked属性，可以设置为选中
    * type=checkbox 多选
      * 需要指定value属性，作为实际提交的值
      * 通过name可以进行分组
    * value input中展示的内容
    * name提交的key值
  * select
    * option元素为选项
      * option的value为提交的值
      * selected 设置为选中
    * name为提交的key

# 动画
## 过渡（transition）
- 通过过渡可以制定一个属性发生变化时的切换方式
- 通过过渡可以创建效果，提升用户体验
  - transition-property （指定执行过渡的属性）
    - 多个属性用，隔开
    - 如果多个属性都需要过渡，则使用all关键字
    - 大部分属性都支持过渡效果，过渡值必须是从一个有效值到另外一个有效值过渡
    - transition-property: width,height
  - transition-duration(指定过渡效果的持续时
  - 间)
    - 时间单位 s 和 ms
    - 多个属性时间不一样也是，隔开
    - transition-duration: 2s,1s
  - transition-timing-function：过渡的时序函数
    - 指定过渡的执行方式
    - transition-timing-function:ease
    - 可选值
      - ease（默认）：慢速开始，先加速，再减速
      - linear：匀速运动
      - ease-in：加速运动
      - ease-out：减速运动
      - ease-in-out：先加速，后减速
      - cubic-bezier()来指定时序函数
        - https://cubic-bezier.com
      - step(3, end)分步执行过渡效果
        - 第一个参数表示分几步
        - 第二个参数表示在每步开始还是结束执行
  - transition-delay：过渡效果延迟，等待一段时间后执行
    - transition-delay：2s
- transition可以同时设置所有属性，如果需要写延迟，两个时间中第一个是持续时间

## 动画（animation）
动画和过渡类似，都是可以实现动态效果，不同的是过渡是某个属性发生变化才会触发，动画可以自动触发

设置动画效果必须要先设置关键帧，关键帧设置了动画执行的每一个步骤
```
<!-- 设置关键帧 -->
@keyframes test {
	from{
		margin-left: 0px;
	}

	to{
		margin-left: 700px;
	}
}
```
- 动画属性
  - animation-name: 要对当前元素生效的关键帧名字
  - animation-duration: 动画执行时间
  - animation-delay 动画延时
  - animation-timing-function 动画时许函数
  - animation-iteration-count 动画执行次数
    - 可选值
      - 次数
      - infinite
  - animation-direction 动画运行的方向
    - 可选值
      - 默认值 normal 从 from到to运行每次一样
      - reverse 从to到normal运行，每次都是
      - alternate 从from 到 to 重复执行动画时反向执行
      - alternate-reverse 
  - animation-play-state 动画执行状态
    - 可选值
      - running 默认值 动画执行
      - paused 动画暂停
  - animation-fill-mode 动画填充模式
    - 可选值
      - none 默认值 动画执行完毕，元素回到原来的位置
      - forwards 动画执行完毕，元素停在动画最后的位置
      - backwards 动画延时等待时，元素就会处于开始位置
      - both 结合上forwards 和 backwards 
  - animation可以同时设置所有属性，如果需要写延迟，两个时间中第一个是持续时间

## 变形
变形指通过css改变形状的形状或位置
- 变形不会影响页面布局
- transform 用来设置元素的变形效果
  - 平移：
    - translateX() 沿着X轴平移
    - translateY() 沿着Y轴平移
    - translateZ() 沿着Z轴平移
      - 平移元素时，是相对于自身计算的
        - 通过这个特性可以做到，不固定宽度然后水平垂直居中
  - z轴平移：
    - 调整元素在z轴的位置，距离越大，离人越远
    - z轴平移，属于立体效果，默认情况下网页不支持透视的，如果需要看见效果，要设置网页的视距
      - 用perspective设置，人眼与网页的距离
  - 旋转：通过旋转可以使元素沿着x y 或 z 旋转指定的角度
    - 通过旋转可以使元素沿着x y 或 z旋转指定的角度
    - rotateX
    - rotateY
    - rotateZ
  - 缩放
    - 把元素放大或缩小的函数
    - scaleX
    - scaleY
    - scale 双方向

# less
less是css的预处理语言

示例在实践
- 变量语法
  - 在变量中可以存储一个任意的值
  - 语法：@变量名
  - 使用变量时，如果直接使用则以 @变量名 形式使用即可
    - 作为类名或者一部分值使用时，必须以 @{变量名} 形式使用
  - $width 表示值跟width一致
- & 符号表示 外层父元素
- extend 扩展
  - 对当前选择器，扩展指定选择器样式
  - .p1:extend(.p1)
  - .p3{.p1()} //mixin进来
- 混合函数 mixin
  - 混合函数中可以直接设置变量
- 在less中所有树枝都可以进行运算
- 可以import其他less
  - @import('.....')
  - 用于模块化

# 弹性盒模型
## 简介
- flex (弹性盒，伸缩盒)
  - 是css中布局手段，用于代替浮动完成页面布局
  - flex可以使元素具有弹性，让元素可以跟随页面大小的改变而改变
  - 弹性容器
    - 要是用弹性盒，必须将一个元素设置为弹性容器
    - 通过display来设置弹性容器
      - display: flex  设置为块级弹性容器
      - display: inline-flex 设置为行内弹性容器
  - 弹性元素
    - 弹性容器的直接子元素，是弹性元素（弹性项）
    - 一个元素可以同时是弹性容器和弹性元素
- 弹性容器样式
  - flex-direction 指定容器中弹性元素的排列方式
    - 可选值
      - row 默认值 弹性元素在容器中水平排列（左向右）
        - 主轴自左向右
      - row-reverse 反向水平
        - 主轴自右向左
      - column 垂直 自上向下
      - colum-reverse 反向垂直 自下向上
    - 主轴
      - 弹性元素排列方向称为主轴
    - 侧轴
      - 与主轴垂直方向的称为侧轴
  - flex-wrap 设置弹性元素是否在弹性容器中自动换行
    - 可选值
      - nowrap 默认值 不会自动换行
      - wrap 元素沿着主轴方向自动换行
      - wrap-reverse 元素沿着主轴的反方向换行
  - flex-flow wrap和direction的简写属性
  - justify-content 
    - 如何分配主轴上的空白空间（主轴元素如何排列）
    - 可选值
      - flex-start 元素沿着主轴起边排列
      - flex-end 元素沿着终边排列
      - center 元素居中排列
      - space-around 空白分布在元素两侧
      - space-evenly 空白分布到元素单侧
      - space-between 空白均匀分布到元素间
  - align-items
    - 元素在辅轴上的对齐方式
    - 元素间的关系
    - 可选值
      - stretch 默认值 将元素的长度设置为相同的值
      - flex-start 元素不会拉伸，沿着幅轴起边对齐
      - flex-end 终边对齐
      - center 居中对齐
      - baseline 基线对齐
  - align-content 辅轴空白空间的分布
    - 可选值与justify-content一致
- 弹性元素样式
  - flex-grow 用来指定弹性元素伸展的系数
    - 当父元素有多余的空间时，子元素如何伸展
    - 父元素的剩余空间，会按照比例进行分配
  - flex-shrink 指定弹性元素的收缩性
    - 当父元素空间，不足以容纳所有字元素时，如何对自元素收缩
    - 值越大，收缩越多，为0时不收缩
    - 缩减系数计算方式比较复杂，缩减多少是根据缩减系数 和 元素大小来计算
  - align-self 用来覆盖当前弹性元素上的align-items
  - flex-basis 指定的事元素在主轴的基础长度
    - 如果主轴时横向的 则 该值指定的就是元素的长度
    - 如果主轴时纵向的 则 该值指定的就是元素高度
      - 默认值为 auto 表示参考元素自身的高度和宽度
      - 如果传递了具体数值，则以该值为准
  - flex 可以设置弹性元素所有的三个样式
    - 增长 缩减 基础
      - initial ”flex: 0 1 auto“ 
      - auto “flex: 1 1 auto”
      - none “flex: 0 0 auto”  没有弹性
    - flex：1
  - flex-order 决定弹性元素的顺序


