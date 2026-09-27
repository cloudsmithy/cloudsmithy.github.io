---
title: 我的 NAS 是怎么连接 Amazon S3 的
date: '2024-07-28 22:47:08'
updated: '2024-08-19 20:46:30'
abbrlink: 4d75dd2
description: NAS 接入 Amazon S3 的实践笔记，整理 CLI、挂载、Storage Gateway、Transfer Family 与备份同步方式。
categories:
- 软件
- AWS
tags:
- AWS
- NAS
toc: true
source_platform: csdn
source_url: https://blog.csdn.net/weixin_38781498/article/details/140752445
source_title: 我的NAS是怎么连接Amazon Web Services S3的
---

作为IT爱好者，很多家庭都配备了Network Attached Storage（NAS），用于存储和管理大量数据。一个常见的挑战是如何实现异地备份，以确保数据的安全性和可恢复性。以下是一些解决方案和工具，可以帮助用户有效地管理和使用Amazon S3与NAS的组合。

### <a id="t0"></a><a id="S3_1"></a>连接S3的几种方式

1. **Amazon Web Services CLI/SDK**：使用命令行或者编程语言的SDK进行访问。
2. **Storage Gateway**：把S3协议转换成SMB/NFS协议。
3. **Amazon Transfer Family**：把S3协议转换成FTP/SFTP/FTPS协议。
4. **S3 Mount**: 原生支持把S3当作一块共享盘挂载在Linux上。
5. **S3Fs**：开源软件，也是把S3当作共享盘挂载在Linux上，出来时间比S3 Mount要早很多。

#### <a id="t1"></a><a id="_9"></a>连接方式和安全性

使用AK/SK（访问密钥ID和密钥）连接Amazon S3虽然方便，但会明文暴露密钥，存在安全风险。推荐在EC2实例上使用IAM角色来替代AK/SK，以提高安全性。IAM角色不仅更安全，而且可以精细控制权限，避免不必要的访问。虽然我们有IAM Role anywher， 但是很多配套软件不支持使用证书进行认证。

#### <a id="t2"></a><a id="S3_13"></a>常用的S3命令

以下是一些常用的S3命令，帮助用户管理S3中的数据：

- `aws s3 cp`：用于在本地文件系统和S3存储桶之间复制文件。
- `aws s3 sync`：用于同步本地目录与S3存储桶或两个S3存储桶之间的内容。
- `aws s3 ls`：列出存储桶中的对象和前缀。
- `aws s3 rm`：删除S3存储桶中的对象。

当然，下面是一个使用 `aws s3 cp` 命令的例子，展示如何使用 `--include` 和 `--exclude` 选项进行过滤，并使用 `--recursive` 选项来复制目录结构中的所有文件和子文件夹：



```bash
# 使用 aws s3 cp 命令复制文件，并过滤包含和排除特定文件类型
aws s3 cp "$source_bucket" "$destination_bucket" --recursive \
    --exclude "*" \
    --include "*.jpg" \
    --include "*.png"

# 上述命令会递归复制源存储桶中的所有 .jpg 和 .png 文件到目标存储桶
```



在这个例子中：

1. **source_bucket** 和 **destination_bucket**：定义了源和目标 S3 存储桶的路径。
2. **–recursive**：确保目录结构中的所有文件和子文件夹都被复制。
3. **–exclude “*”**：首先排除所有文件。
4. **–include “*.jpg”** 和 **–include “*.png”**：仅包含扩展名为 `.jpg` 和 `.png` 的文件。

以下是三个使用 AWS CLI 的例子，分别展示了 `aws s3 sync`、`aws s3 ls` 和 `aws s3 rm` 命令的使用方法。

`aws s3 sync`：用于同步本地目录与S3存储桶，或两个S3存储桶之间的内容。



```bash
# 同步本地目录到S3存储桶
aws s3 sync /path/to/local/directory s3://your-bucket-name/

# 同步一个S3存储桶到另一个S3存储桶
aws s3 sync s3://source-bucket-name/ s3://destination-bucket-name/
```



在第一个命令中，本地目录 `/path/to/local/directory` 中的所有文件和子文件夹将被同步到 S3 存储桶 `your-bucket-name` 中。第二个命令则是将 `source-bucket-name` 中的内容同步到 `destination-bucket-name`。

`aws s3 ls` 列出S3存储桶中的对象和前缀。



```bash
# 列出存储桶中的顶层对象和文件夹
aws s3 ls s3://your-bucket-name/

# 列出存储桶中指定前缀下的所有对象
aws s3 ls s3://your-bucket-name/some-prefix/ --recursive
```



`aws s3 rm`删除S3存储桶中的对象。



```bash
# 删除单个对象
aws s3 rm s3://your-bucket-name/file.txt

# 递归删除整个目录中的对象
aws s3 rm s3://your-bucket-name/some-prefix/ --recursive
```



第一个命令删除 `your-bucket-name` 存储桶中的单个对象 `file.txt`。第二个命令递归删除 `some-prefix` 目录下的所有对象。

过去，QNAP 提供 Connect to Cloud Drive 挂载云端功能，可将公有云空间挂载至 File Station。云端空间挂载的目的是让云端空间纳入 File Station 的管理服务，可让 File Station 同时管理多个公有云和远程 NAS (私有云) 空间并存取其中的档案。云端空间挂载并无云网关的中介功能，也就是说，云端空间挂载无法处理公/私有云的存取协议转换、不支持启用本地端 SSD 加速云端数据存取，且云端档案访问速度取决于因特网速度。

![在这里插入图片描述](/images/migrated/b7e6946000ba8dd398d1.png)  
我先尝试了左边的HybridMount  
![在这里插入图片描述](/images/migrated/b66d00093cfca7cbb4b8.png)

在连接对象储存这个方面，这个软件的设置和Storage Gateway和很类似，可以选择缓存或者不使用缓存，然后把基于S3的对象存储转化成NAS的本地存储，这样也就等于转换成了。除此之外还可以连接远程的SMB，NFS和FTP，就可以满足我们日常的使用要求了。  
![在这里插入图片描述](/images/migrated/e067f9a6f80621b2d1bb.png)

![在这里插入图片描述](/images/migrated/21e30f3d1e051aad999a.png)

### <a id="t3"></a><a id="Storage_Gateway_92"></a>Storage Gateway

Amazon Storage Gateway是一种混合云存储服务，允许本地应用程序无缝地将数据存储在Amazon S3中。它可以将S3协议转换为NFS或SMB协议：

- **NFS（网络文件系统）**：适合Linux/Unix环境，提供免认证的文件共享。
- **SMB（服务器消息块）**：通常用于Windows环境，需要通过身份验证机制，如一次性guest密码或与Active Directory（AD）集成使用域的密码。

Storage Gateway实际上启动了一个缓存盘，定期将S3中的文件同步到该缓存盘中。上传到缓存盘的数据会立即传输到S3，而从S3下载的数据则是定时进行的。选择较短的同步间隔可以获取最新数据，但会增加费用；反之，选择较长的间隔可以降低费用。对于多用户环境，建议使用NFS协议，以减少直接从S3上传文件的开销。

我主要通过NFS来访问S3，当然除了也支持FSx，磁带， iSCSI存储。

Amazon FSx 文件网关使您能够使用 SMB 协议在 Amazon FSx for Windows File Server 中存储和检索文件。通过 Amazon FSx 文件网关写入的文件可直接在 Amazon FSx for Windows File Server 中访问。

卷网关使用 iSCSI 连接为您的本地部署应用程序提供块存储。卷上的数据存储在 Amazon S3 中，您可以获取卷的时间点副本，这些副本将作为 Amazon EBS 快照存储在 AWS 中。您还可以获取卷的副本，并使用 AWS Backup 管理保留的卷副本。您可以将 EBS 快照还原到卷网关卷或 EBS 卷。

我们先来创建一个Storage Gateway，第一步先从创建网关开始：  
![在这里插入图片描述](/images/migrated/e838f51d072ee1c5f2bf.png)  
这里可以选择缓存经常访问的数据，也可以把全部的数据从S3拉取到本地，处于成本考虑，我选择了缓存卷。

这里需要安装一个Agent，可以使用让亚马逊云帮助我们在EC2上安装一个agent，当然我们也可以在本地的EXSI，KVM等平台手动安装，这样就无需在云平台上花费额外的费用，如下是安装在EXSI虚拟机中的步骤：  
![在这里插入图片描述](/images/migrated/81449a028da56dd612e5.png)  
如果选择安装到EC2中，这个是操作方法：  
![在这里插入图片描述](/images/migrated/43983283973704eae38a.png)

激活的方式可以选择使用IP地址或者激活密钥，如果我们的80端口恰好可以在互联网上被访问到，那么推荐使用IP地址的方式来激活。  
![在这里插入图片描述](/images/migrated/3fe3b8739b96c636da7e.png)  
如果使用激活密钥的方式，那么需要登陆到硬件设备的网关控制台查找激活密钥。  
![在这里插入图片描述](/images/migrated/f2dcc2b195c8584e578c.png)  
这个就是我们创建出来的网关，然后我们进行下一步。  
![在这里插入图片描述](/images/migrated/2cba2db1ae53bbbad02f.png)

接下来创建文件共享，这里选择NFS或者SMB

![在这里插入图片描述](/images/migrated/a8ef3c07a78880d9c4c4.png)

一个文件共享只能使用一个

![在这里插入图片描述](/images/migrated/23ff3a0e6403c233bf45.png)

这个是在window上挂载的情景：

在 Microsoft Windows 上,用户名是smbguest：



```bash
net use e: \\ip\bucketname
```



![在这里插入图片描述](/images/migrated/7fad11b829f2c0938952.png)

#### <a id="t4"></a><a id="Amazon_Transfer_Family_143"></a>**Amazon Transfer Family**

Amazon Transfer Family支持使用FTP、SFTP和FTPS协议将文件传输到S3：

- **FTP（文件传输协议）**：传统的文件传输协议，不加密，适用于低安全需求的环境。
- **SFTP（安全文件传输协议）**：基于SSH的文件传输协议，提供加密传输，适合高安全需求。
- **FTPS（FTP安全扩展）**：通过TLS加密的FTP协议，同样提供安全的文件传输。

#### <a id="t5"></a><a id="S3F3S3_File_Folder_and_Fun_150"></a>**S3F3（S3 File, Folder, and Fun）**

S3F3 是一个轻量级的Java程序，用于高效地浏览和管理Amazon S3上的文件和文件夹。它提供了一个直观的界面，使用户可以轻松地进行以下操作：

- **浏览和导航**：轻松浏览S3存储桶中的文件和文件夹，支持多级文件夹结构。
- **上传和下载**：支持大文件的上传和下载，使用多线程技术来提高速度和效率。
- **文件管理**：支持复制、移动、删除和重命名文件及文件夹的操作。

#### <a id="t6"></a><a id="S3_Mount_157"></a>**S3 Mount**

S3 Mount 允许用户将Amazon S3存储桶挂载为本地文件系统，从而直接在操作系统的文件管理器中访问S3存储。这种方式使得S3的使用变得更加直观和方便。以下是S3 Mount的主要功能：

- **挂载为文件系统**：通过工具如s3fs或rclone，可以将S3存储桶挂载到本地文件系统中，从而使用户可以像使用本地磁盘一样访问S3中的文件。
- **文件操作**：支持标准文件操作，如读取、写入、删除和列表文件。用户可以使用任何文件系统工具（如文本编辑器、脚本等）直接访问S3存储的数据。
- **自动同步**：部分工具支持双向同步，即本地文件更改会自动同步到S3，反之亦然。这对于需要保持本地和云端数据一致性的应用场景非常有用。

#### <a id="t7"></a><a id="NAS_164"></a>**NAS设备的同步套件**

许多NAS设备配备了同步套件，支持多种存储协议和平台，包括：

- **云存储**：支持兼容S3协议的对象存储、OneDrive、Google Drive等云存储服务。
- **远程存储**：支持NFS、SMB、FTP、CIFS等协议，适应不同的网络环境和存储需求。

由于“永恒之蓝”事件后，445端口被严格管控，使用公网访问SMB几乎不可行。建议使用专线或代理服务器来建立安全的连接。

这些同步套件通常也支持缓存功能，用户可以选择是否启用。启用缓存可以提高访问速度，而不启用缓存则避免了额外的本地存储费用。

#### <a id="t8"></a><a id="_174"></a>**应用场景**

以下是一些具体的应用场景：

1. **异地备份**：使用Storage Gateway或Transfer Family将NAS中的数据备份到S3，实现数据的异地存储和灾难恢复。
2. **文件共享和协作**：通过设置NFS或SMB协议，多个用户可以访问同一个数据集，提高协作效率。
3. **自动同步**：使用NAS同步套件，将本地和云端的数据保持同步，确保数据的一致性和可用性。

这些方案帮助用户充分利用Amazon S3的弹性和可靠性，结合本地NAS的便利性，实现更高效、安全的数据管理。
