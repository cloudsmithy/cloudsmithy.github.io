---
title: pipx 与 conda：应用隔离和 Python 环境管理
date: '2024-04-04 19:56:12'
updated: '2024-04-04 19:56:12'
abbrlink: 7e63cf3c
categories:
- 软件
- 编程
tags:
- Python
- 开发
description: 整理 pipx 安装命令行应用和 conda 管理开发环境的命令，比较两者的用途、依赖隔离及环境导入导出方式。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/137381194
source_title: pipx和conda
---

[Python 编程与环境笔记：系列目录](/series/python/)


#### <a id="pipx_0"></a>pipx

`pipx`是一个用于安装和运行Python应用的工具，它可以为每个安装的应用创建独立的虚拟环境，从而避免依赖冲突和污染全局环境。以下是一些常见的`pipx`用法：

#### <a id="pipx_3"></a>安装pipx

首先，确保你已经安装了`pipx`。如果还没有安装，可以通过以下命令安装（假设你已经安装了Python和pip）：


```bash
python3 -m pip install --user pipx
python3 -m pipx ensurepath
```


对于macOS用户，可以使用Homebrew安装：


```bash
brew install pipx
pipx ensurepath
```


#### <a id="pipxPython_19"></a>使用pipx安装Python应用

要使用`pipx`安装Python应用，可以使用以下命令：


```bash
pipx install <应用名>
```


例如，安装`black`代码格式化工具：


```bash
pipx install black
```


这会在独立的虚拟环境中安装`black`，并且使其可用于命令行。

#### <a id="_35"></a>列出已安装的应用

要查看通过`pipx`安装的所有应用及其版本，可以使用：


```bash
pipx list
```


#### <a id="_43"></a>运行安装的应用

安装应用后，你可以直接通过命令行运行它，就像它是全局安装的一样。例如，运行`black`：


```bash
black <文件或目录>
```


#### <a id="_51"></a>升级应用

要升级通过`pipx`安装的应用，使用：


```bash
pipx upgrade <应用名>
```


例如，升级`black`：


```bash
pipx upgrade black
```


#### <a id="_65"></a>卸载应用

要卸载应用，使用：


```bash
pipx uninstall <应用名>
```


例如，卸载`black`：


```bash
pipx uninstall black
```


#### <a id="pipx_79"></a>升级pipx

`pipx`本身也可以通过pip进行升级：


```bash
pip install --user --upgrade pipx
```


或者，如果你是通过Homebrew安装的`pipx`，可以使用：


```bash
brew upgrade pipx
```


- 使用`pipx`安装的应用运行在独立的虚拟环境中，这意味着它们的依赖不会影响到系统的其他Python应用。
- `pipx`特别适合安装那些你想要在命令行中运行的应用，比如开发工具、脚本等。
- 如果你遇到路径问题，确保你的`PATH`环境变量正确地包含了`pipx`安装的应用路径。运行`pipx ensurepath`可以帮助设置这个路径。

通过这些基本的`pipx`命令，你可以更容易地管理和使用Python命令行工具，而不用担心依赖冲突或污染你的系统环境。

`pipx ensurepath`命令的作用是确保`pipx`安装的二进制文件所在的目录被添加到你的系统的`PATH`环境变量中。这样做的目的是让你可以直接从命令行运行那些通过`pipx`安装的应用，无需指定完整的路径。当你首次安装`pipx`或在新的终端会话中发现无法直接运行`pipx`安装的应用时，运行这个命令非常有帮助。

#### <a id="conda_105"></a>conda

`conda`是一个开源的包管理器和环境管理器，可以用来安装、运行和升级包和他们的依赖，同时也能够创建、保存、加载和切换环境。使用`conda`可以非常方便地管理不同项目的不同依赖，并确保这些依赖之间互不干扰。以下是一些基本的`conda`命令，帮助你开始使用。

`conda`是Anaconda和Miniconda的一部分，你需要先安装其中之一。

- **Anaconda**：包含`conda`、Python以及众多流行的科学计算、数据科学相关的库和应用。
- **Miniconda**：更轻量级的选择，仅包含`conda`和Python。

安装完毕后，`conda`命令应该已经可以在终端或命令行中使用了。

#### <a id="_116"></a>创建新的环境

你可以创建一个新的环境来隔离项目依赖，使用以下命令：


```bash
conda create --name myenv python=3.8
```


这个命令会创建一个名为`myenv`的新环境，并在其中安装Python 3.8。你可以通过修改`python=3.8`来选择不同的Python版本。

#### <a id="_126"></a>激活和退出环境

创建新环境后，你可以使用以下命令来激活这个环境：


```bash
conda activate myenv
```


当你完成工作并想要退出当前环境时，可以使用：


```bash
conda deactivate
```


#### <a id="_140"></a>安装包

在激活的环境中，你可以使用`conda install`命令来安装包。例如，安装`numpy`：


```bash
conda install numpy
```


#### <a id="_148"></a>查看已安装的包

要查看当前环境中已安装的包，可以使用：


```bash
conda list
```


#### <a id="_156"></a>管理环境

- **列出所有环境**：

  
```bash
conda env list
```

- **删除环境**：

  如果你不再需要某个环境，可以使用以下命令删除它：

  
```bash
conda env remove --name myenv
```


#### <a id="Conda_172"></a>更新Conda

定期更新`conda`自身和它管理的包是个好习惯。更新`conda`：


```bash
conda update conda
```


更新所有包：


```bash
conda update --all
```


#### <a id="_186"></a>导出和导入环境

- **导出环境**：

  当你想要共享你的环境配置时，可以导出环境到一个文件中：

  
```bash
conda env export > environment.yml
```

- **创建环境从`environment.yml`**：

  可以使用以下命令从`environment.yml`文件创建环境：

  
```bash
conda env create -f environment.yml
```


这些是`conda`的基本使用命令，足以让你开始使用`conda`来管理你的Python环境和依赖。随着你逐渐深入，你可能会遇到更复杂的需求，`conda`的[官方文档](https://docs.conda.io/projects/conda/en/latest/index.html)提供了非常全面的信息和高级用法，值得一读。

#### <a id="pipxconda_205"></a>`pipx`和`conda`虚拟环境的区别

`pipx`和`conda`都是Python生态系统中广泛使用的工具，但它们服务于不同的目的和需求。

- **目标**：`pipx`专注于在隔离的环境中安装和运行Python应用。它为每个安装的应用创建一个独立的虚拟环境，从而避免了依赖冲突。
- **使用场景**：适合安装那些你希望在全局环境中运行的命令行工具或应用，比如`black`、`flake8`等开发工具。
- **依赖管理**：每个应用独立管理自己的依赖，不同应用之间的依赖版本可以不同，彼此不会互相干扰。
- **适用范围**：只针对Python应用和库。

##### <a id="conda_215"></a>conda

- **目标**：`conda`是一个跨平台的包管理器，不仅可以管理Python包，还可以管理非Python包（如库或工具）。它可以创建和管理虚拟环境，其中可以安装不同版本的软件和库。
- **使用场景**：适合科学计算、数据分析、机器学习等领域，这些领域经常需要复杂的依赖管理和跨语言的包支持。
- **依赖管理**：`conda`能够处理更复杂的依赖关系，包括Python和非Python库的依赖。它可以自动解决包之间的依赖问题。
- **适用范围**：既适用于Python应用和库，也适用于非Python包。

总结来说，`pipx`是专门用于隔离安装和运行Python命令行工具的，非常适合那些需要全局可用但又希望避免依赖冲突的场景。而`conda`则是一个更为通用的包管理器，特别适合需要复杂依赖管理的科学计算和数据分析项目，可以管理Python以外的包。选择哪一个工具取决于你的具体需求和使用场景。
