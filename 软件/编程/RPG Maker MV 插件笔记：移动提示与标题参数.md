---
title: RPG Maker MV 插件笔记：移动提示与标题参数
date: '2018-12-16 17:16:05'
updated: '2026-09-24 11:00:00'
abbrlink: 34cce265
categories:
- 软件
- 编程
tags:
- JavaScript
- RPG Maker MV
- 游戏开发
series: 早期编程学习笔记
description: 保留 RPG Maker MV 插件课程中的移动提示与标题描边练习，修正插件路径、参数读取、立即执行函数和方法覆盖的用法。
source_platform: 简书
source_url: https://www.jianshu.com/p/a9e74ee9f71f
source_title: RPG MAKER MV 笔记
toc: true
---

记笔记因为怕忘，所以写。

这组内容来自当时跟着看的 [RPG Maker MV 插件视频课程](https://www.youtube.com/watch?v=KoHj1_Q_4HU&list=PLMcr1s5MjsiT4gvf-sWX8pc9VCHnHAZNS)。原稿记录了新建插件、移动提示和标题描边参数。13 张旧截图没有恢复，这次保留练习意图，修正代码中会立即执行标题绘制的问题，并对照 MV 核心脚本核对方法名称。

[早期编程学习目录](/series/early-programming/)

## 新建插件文件

插件首先是一个 JavaScript 文件。文件放在工程的 `js/plugins/` 中，再到插件管理器里添加并启用。原稿写成了 `js/plugin`，少了最后的 s。

插件开头的注释提供说明、作者和帮助信息：

```javascript
/*:
 * @plugindesc 显示玩家移动方向的学习示例
 * @author 忘机山人
 * @help
 * 在插件管理器中启用，然后进入地图测试方向键。
 */
```

`/*:` 不是普通的 `/*`：这里的冒号用于让编辑器识别插件说明。注释只提供元信息，真正改变游戏行为的仍然是后面的 JavaScript。

## 用插件显示移动方向

MV 中常见方向值与数字小键盘相同：下是 2，左是 4，右是 6，上是 8。

原稿直接替换 `Game_Player.prototype.executeMove`，内部再调用 `moveStraight`。下面保留原方法再包一层，这样不会直接丢掉插件加载前已有的方法行为。保存为 `MoveDirectionNote.js`，配上前面的插件注释：

```javascript
(function () {
    'use strict';

    var originalExecuteMove = Game_Player.prototype.executeMove;
    var directions = { 2: '下', 4: '左', 6: '右', 8: '上' };

    Game_Player.prototype.executeMove = function (direction) {
        originalExecuteMove.call(this, direction);
        if (directions[direction] && this.isMovementSucceeded()) {
            $gameMessage.add('Hi, 我在向' + directions[direction] + '走！');
        }
    };
})();
```

`$gameMessage.add()` 把文字加入游戏消息队列，由游戏里的消息窗口显示；它不是开发者控制台的日志输出。这里在移动成功后才添加消息，撞墙时不会误报“已经走了一步”。

这更适合观察调用过程。每走一步都出现消息，会影响正常游玩；用完可以在插件管理器中关闭。

外层的 `(function () { ... })();` 是立即执行函数。它隔离了示例中的局部变量，而原型方法要等游戏调用时才运行。

## 参数从哪里来

参数也写在开头的注释里：

```javascript
/*:
 * @plugindesc 调整标题文字描边的学习示例
 * @author 忘机山人
 * @param color
 * @desc 标题描边颜色
 * @default red
 * @param number
 * @desc 标题描边宽度
 * @default 8
 * @help
 * 将文件保存为 TitleOutlineNote.js，并在插件管理器中启用。
 */
```

启用后，可以在插件管理器里修改这两个值。`PluginManager.parameters('TitleOutlineNote')` 按插件名称读取参数，通常要与文件名去掉 `.js` 后的名称对应。

返回值是按参数名索引的对象，参数值需要按用途转换。原稿把它写成数组，容易和后面的下标访问混淆。

## 修改标题的描边

把这段放在 `TitleOutlineNote.js` 的注释后面：

```javascript
(function () {
    'use strict';

    var parameters = PluginManager.parameters('TitleOutlineNote');
    var color = String(parameters.color || 'red');
    var width = Number(parameters.number);
    if (!isFinite(width) || width < 0) width = 8;

    Scene_Title.prototype.drawGameTitle = function () {
        var x = 20;
        var y = Graphics.height / 4;
        var maxWidth = Graphics.width - x * 2;
        var bitmap = this._gameTitleSprite.bitmap;
        bitmap.outlineColor = color;
        bitmap.outlineWidth = width;
        bitmap.fontSize = 72;
        bitmap.drawText($dataSystem.gameTitle, x, y, maxWidth, 48, 'center');
    };
})();
```

原代码把“给原型方法赋值”的整个表达式加上 `()`，导致脚本加载时就尝试绘制标题。那时还没有正确的标题场景实例，`this._gameTitleSprite` 也不一定存在。这里仅执行外层函数，标题绘制方法留给游戏调用。

这段练习会覆盖标题绘制方法。如果同时启用其他修改标题的插件，需要核对加载顺序与覆盖关系。重命名插件文件时，也要同步修改参数读取名称，并在插件管理器中重新确认配置。

原文还说 ES6 是 2016 年的标准，这里一并纠正：ES6 对应 ECMAScript 2015。不过 MV 工程使用的运行时可能随版本不同，以上示例采用普通函数和 `var`，不依赖较新的语法。

## 本次核对的范围

移动方法的调用、参数读取、标题方法延迟执行和示例语法做了独立检查；没有启动 RPG Maker MV 编辑器重新录制游戏画面。原稿中的截图效果仍属于当年的学习记录。

方法名称与调用方式对照了 [MV 官方核心脚本](https://github.com/rpgtkoolmv/corescript)，主要是 `Game_Player`、`Scene_Title` 与 `PluginManager`。
