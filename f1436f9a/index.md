# 拉普拉斯变换笔记：常用变换与微分方程

- URL: https://blog.no-claw.com/f1436f9a/
- 日期: 2018-09-12
- 分类: 软件 / 数学基础
- 标签: 数学, 微积分, 控制理论

拉普拉斯变换可以把时域里的微分方程转成 s 域中的代数关系。原来上课记这部分时，老师总说工科先拿来用，我也就没有详细推导定义式。

这次保留常用变换和性质，重新排版公式。原稿在“微分”处停住了，下面的微分性质、一阶方程和负反馈例子是本次整理补充的内容。

[数学基础笔记目录](/series/mathematics/)

## 变换与反变换

这里使用单边拉普拉斯变换：

$$
\begin{gathered}
X(s)=\mathcal L\{x(t)\}=\int_0^{\infty}x(t)e^{-st}\,\mathrm dt\\
s=\sigma+j\omega
\end{gathered}
$$

并不是定义在正半轴的任意函数都一定能变换，积分还要在相应的 s 范围内收敛。

在满足反演条件时，可以写成：

$$
x(t)=\frac1{2\pi j}\int_{\gamma-j\infty}^{\gamma+j\infty}X(s)e^{st}\,\mathrm ds
$$

积分线应选在合适的收敛区域中。做基础题时，通常先查常用变换表，再通过分解、平移和线性性质求反变换。

## 常用变换

下面列的是 t 不小于零时的函数及其单边变换。参数为实数；各式还需满足对应的收敛条件。

$$
\begin{aligned}
\mathcal L\{1\}&=\frac1s, &\operatorname{Re}s&>0\\
\mathcal L\{t\}&=\frac1{s^2}, &\operatorname{Re}s&>0\\
\mathcal L\{t^2/2\}&=\frac1{s^3}, &\operatorname{Re}s&>0\\
\mathcal L\{e^{-at}\}&=\frac1{s+a}, &\operatorname{Re}s&>-a\\
\mathcal L\{\sin\omega t\}&=\frac\omega{s^2+\omega^2}, &\operatorname{Re}s&>0\\
\mathcal L\{\cos\omega t\}&=\frac s{s^2+\omega^2}, &\operatorname{Re}s&>0
\end{aligned}
$$

`1/(s + a)` 与 `1/s + a` 不是一回事，正弦变换中的分母也要保留整体括号。原稿丢掉分式之后，这些地方很容易读错。

## 线性与平移

在线性组合的变换存在时：

$$
\mathcal L\{a x_1(t)+b x_2(t)\}=aX_1(s)+bX_2(s)
$$

对延迟 τ 的因果信号，需要带上单位阶跃函数：

$$
\begin{gathered}
\mathcal L\{u(t-\tau)x(t-\tau)\}=e^{-s\tau}X(s)\\
\tau\ge0
\end{gathered}
$$

指数调制则对应 s 域平移：

$$
\mathcal L\{e^{at}x(t)\}=X(s-a)
$$

因此：

$$
\mathcal L\{e^{-at}\sin\omega t\}=\frac\omega{(s+a)^2+\omega^2}
$$

$$
\mathcal L\{e^{-at}\cos\omega t\}=\frac{s+a}{(s+a)^2+\omega^2}
$$

## 微分性质与初始值

对这里考虑的普通函数，在相应光滑性和收敛条件下，单边变换会带入初始值：

$$
\mathcal L\{x'(t)\}=sX(s)-x(0^+)
$$

$$
\mathcal L\{x''(t)\}=s^2X(s)-sx(0^+)-x'(0^+)
$$

不能每次都直接把微分替换成乘 s；只有在对应初始值为零时，那些初始项才会消失。含冲激、跳变或采用其他单边积分约定的问题，还要另行处理零点附近的定义。

## 一个一阶方程

设 τ 为正数，考虑：

$$
\begin{gathered}
\tau y'(t)+y(t)=1\\
y(0)=0
\end{gathered}
$$

变换后：

$$
(\tau s+1)Y(s)=\frac1s
$$

分解为：

$$
Y(s)=\frac1{s(\tau s+1)}=\frac1s-\frac1{s+1/\tau}
$$

所以：

$$
y(t)=1-e^{-t/\tau}
$$

把结果代回原方程，也能检查初值和等式是否成立。

## 和负反馈控制的关系

在零初始条件下，若前向通道为 G(s)，反馈通道为 H(s)，负反馈关系写成：

$$
\begin{gathered}
E(s)=R(s)-H(s)Y(s)\\
Y(s)=G(s)E(s)
\end{gathered}
$$

整理得到：

$$
\frac{Y(s)}{R(s)}=\frac{G(s)}{1+G(s)H(s)}
$$

例如 `G(s) = 1/(τs + 1)`、`H(s) = 1`，闭环传递函数是 `1/(τs + 2)`。这个代数关系把原稿标题中的“反馈控制”接了起来；稳定性和动态性能还需要继续分析，不能只凭分式形式作判断。
