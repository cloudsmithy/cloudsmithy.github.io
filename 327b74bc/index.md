# STM32F767 CubeMX 开发手记（一）：跑马灯

- URL: https://blog.no-claw.com/327b74bc/
- 日期: 2017-12-20
- 分类: 电子产品 / 嵌入式 / STM32
- 标签: 单片机, STM32

> 这是一篇 2017–2018 年的嵌入式学习笔记，保留当时的工具、代码和实验过程。 [查看系列目录](/series/embedded/)。

#绪论
stm32的寄存器比较多，难于记忆，所以官方封装了两套库函数。一个是标准库，不过在F7上官方没有更新，以后可能不再维护了。另一个则是HAL库，HAL库的程序可移植性比较高，而且基本上不用和寄存器打交道，不懂硬件的小白也可以轻松学习。

由于用的正点原子的stm32F767，正点原子用的mdk5的方式新建工程，不是特别喜欢。加上现在关于HAL库的中文资料较少，不过原子，野火，硬石，微雪而已。而用Cubemx来开发F7甚至关于stm32移植的更是少之又少。当然折腾也是必不可少的了，我决定用stm32cubeMx + sw4stm32的方式开发，由于技术不熟个别地方可能还是会用到mdk5，还望谅解。

## 下边就详细讲解下关于stm32跑马灯的程序：

首先软件的安装就不细说了，百度上的资料也很全。

#### 使能RCC及相应GPIO

配置RCC，然后会发现相应的引脚已经高亮。

单击LED灯的引脚，因为要输出，所以设置为output模式。

下面的已经配置好的GPIO：

###配置时钟树
点击clock configuration
时钟树使用时要注意系统的主频
F767是216M，其余单片机要灵活应变。

#### 使能GPIO

点击configuration

点击这里的GPIO，然后弹出下边的界面。

这里设置标签一方面是代码符合人类的思维方式，一方面方面不同单片机的移植。

都配置好之后，就可以生成工程了。点击左上角的project-----settings，

然后点击code gererarot，配置输出的文件的格式和添加的库文件。

点击ok保存。然后下一步生成代码，project --generator code就可以了。 generator report可以生成配置文件的文档。先不介绍。

正在生成工程：

生成之后点击open project：

这是生成的目录树：

下边是工程中文件的生成:

```
/* Includes ------------------------------------------------------------------*/
#include "gpio.h"
/* USER CODE BEGIN 0 */

/* USER CODE END 0 */

/*----------------------------------------------------------------------------*/
/* Configure GPIO                                                             */
/*----------------------------------------------------------------------------*/
/* USER CODE BEGIN 1 */

/* USER CODE END 1 */

/** Configure pins as
        * Analog
        * Input
        * Output
        * EVENT_OUT
        * EXTI
*/
void MX_GPIO_Init(void)
{

  GPIO_InitTypeDef GPIO_InitStruct;

  /* GPIO Ports Clock Enable */
  __HAL_RCC_GPIOH_CLK_ENABLE();
  __HAL_RCC_GPIOB_CLK_ENABLE();

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(DS1_GPIO_Port, DS1_Pin, GPIO_PIN_SET);

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(DS0_GPIO_Port, DS0_Pin, GPIO_PIN_RESET);

  /*Configure GPIO pins : PBPin PBPin */
  GPIO_InitStruct.Pin = DS1_Pin|DS0_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_HIGH;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);
}
```

下边看main.c

在主程序中添加如下代码：

```
HAL_GPIO_WritePin(DS1_GPIO_Port, DS1_Pin, GPIO_PIN_SET);
HAL_GPIO_WritePin(DS0_GPIO_Port, DS0_Pin, GPIO_PIN_RESET);
HAL_Delay(500);
HAL_GPIO_WritePin(DS1_GPIO_Port, DS1_Pin, GPIO_PIN_RESET);
HAL_GPIO_WritePin(DS0_GPIO_Port, DS0_Pin, GPIO_PIN_SET);
HAL_Delay(500);
```

由于在新建工程的时候使用了标签，所以DS1_GPIO_Port就是原来的GPIOB,DS1就是GPIO_PIN_0,SET是置位，也就是高电平，RESET是复位，也就是低电平。

没有标签的语句是这样的：

```
HAL_GPIO_WritePin(GPIOB,GPIO_PIN_0,GPIO_PIN_SET);
```

下面编译，接着烧录就好了。
