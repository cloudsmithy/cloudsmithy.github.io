# 微信小程序云开发笔记：查询与删除云函数

- URL: https://blog.no-claw.com/39553255/
- 日期: 2018-12-02
- 分类: 软件 / 编程
- 标签: 开发, JavaScript

云开发可以把代码放在前台或后台，前台的有些很多限制，比如只能同时删除一条语句，查询也有20行的限制，后台云函数就没有这些限制，保障了安全，也使开发更加流畅。

###### 查询

```
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('comment').get()
  } catch (e) {
    console.error(e)
  }
}
```

[图：后台代码]

前台的云函数要这么写

```
wx.cloud.callFunction({
      name: 'movieList',
      success: res => {
        console.log('sss')
        console.log(res)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
```

[图：微信小程序云开发笔记：查询与删除云函数配图]

删除的云函数同理，只不过在前台调用的时候把名字改过来就行了。

```
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('comment').where({
      type: "audio"
    }).remove()
  } catch (e) {
    console.error(e)
  }
}
```

[图：微信小程序云开发笔记：查询与删除云函数配图]

写完云函数记得上传部署。
[图：微信小程序云开发笔记：查询与删除云函数配图]
