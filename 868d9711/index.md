# Xcode 配合 Git 进行版本控制

- URL: https://blog.no-claw.com/868d9711/
- 日期: 2019-09-11
- 分类: 软件 / 编程
- 标签: Apple, 开发, Git

最近入了mac的坑，装了Xcode要写c++，索性直接配置了xcode的git，省着命令行commit了。

首先新建工程，一定要点create git。。。。
[图：Xcode 配合 Git 进行版本控制配图]

接下来添加git信息
[图：Xcode 配合 Git 进行版本控制配图]
这里可以关联github已经有的仓库，也可以使用新的仓库，这里我选择新的仓库。接下来填入github的用户名和密码确认就发现远程github就已经创建了。
[图：Xcode 配合 Git 进行版本控制配图]
这个就是我刚才新建的仓库，在github上边已经显示出来了。
[图：Xcode 配合 Git 进行版本控制配图]

接下来是commit和pull代码，这里没有add的选项，可能鼠标直接代替了吧。
[图：Xcode 配合 Git 进行版本控制配图]

我们添加了一行代码，一会提交试试。
[图：Xcode 配合 Git 进行版本控制配图]

点击这里的commit，我们可以再选中我们的main.cpp。
[图：Xcode 配合 Git 进行版本控制配图]

git已经告诉我们改动了什么。点击右下角的commit file。
[图：Xcode 配合 Git 进行版本控制配图]
然后push就ok啦。

[图：Xcode 配合 Git 进行版本控制配图]

在github已经看见提交信息。大功告成！！！！！

PS：新建branch

[图：Xcode 配合 Git 进行版本控制配图]
