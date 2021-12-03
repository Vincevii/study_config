# 原理
1. HTML规范中描述：
   1. 如果设置的 timeout 小于 0，则设置为 0
   2. 如果嵌套的层级超过了 5 层，并且 timeout 小于 4ms，则设置 timeout 为 4ms

# 疑问
1. 各个浏览器厂商的差异
2. 为什么是4ms

# 浏览器厂商如何实现
1. **chrome中，设置了最大的嵌套层级为5层，最小的延迟为0.004s，当嵌套为5层以内，延时取1ms，当嵌套大于5层延时则取0.004s**
2. chrome实现的代码中注释，之所以需要4ms是因为部分网站的不良使用，设置延时过低会导致CPU-SPINNING（会导致不停唤醒系统，造成耗电量增加），因此选中了4ms这个相对合适的值
   
# 4ms的历史博弈
1. windows系统的timer resolution（时间粒度）为10ms--15.6ms，但是作为浏览器厂商chrome希望降低至1ms以内，因为过大的时间粒度会影响页面表达，并且过长的time tick意味着浏览器会休眠过长，导致浏览器性能下降
2. chrome在linux上修改了系统默认的timer resolution，windows系统则与微软沟通无果，使用用了Flash 和 Quicktime 同样的 API 来替代系统默认的 timer resolution
3. 那么为什么不调整为0ms呢：0ms的延时会导致js引擎过度循环，此时浏览器是单线程的话，那么会导致网站容易无响应。这里需要结合event loop，如果数据很慢的js引擎，通过0ms的timer不停的唤醒系统，那么event loop就会阻塞。此时用户会遇到CPU spinning和基本挂起的浏览器。因此一开始设置的是1ms。
4. 后面chrome被反馈了两个bug：
   1. 部分网站的不良使用，设置过低的延迟导致cpu-spinning
   2. 不正常的耗电量 -- cpu spinning导致无法休眠
5. chrome做了相关实验后发现，4ms的延时在大部分机器上能解决上述问题，因此后续改为了这个标准，其他浏览器相继效仿，HTML Stander也修改了对应的标准