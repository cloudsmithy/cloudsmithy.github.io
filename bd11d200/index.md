# 浏览器屏幕采集示例：getDisplayMedia 与本地预览

- URL: https://blog.no-claw.com/bd11d200/
- 日期: 2024-04-23
- 分类: 软件 / 编程
- 标签: 开发, JavaScript

这个小示例把浏览器选中的屏幕或窗口显示在当前页面的 `video` 元素中。代码到本地预览为止，没有建立远端 WebRTC 连接。

页面需要运行在支持该 API 的浏览器和安全上下文中，例如 HTTPS。点击按钮后，由浏览器让用户选择共享内容；停止共享时，清空预览。接口说明见 [MDN getDisplayMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia)。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Screen Capture with WebRTC</title>
</head>
<body>
<h1>WebRTC Screen Capture Example</h1>
<button onclick="startCapture()">Share Screen</button>
<video id="videoElement" autoplay playsinline></video>

<script>
    async function startCapture() {
        const videoElement = document.getElementById('videoElement');
        try {
            // 请求视频流，这里可以添加更多的配置选项，如限制分辨率等
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "always",
                    // 设置帧率// 可选项: 'never', 'always', 'motion'
                },
                audio: false  // 根据需要可以请求音频
            });
            // 将捕获的流赋值给video元素的srcObject
            videoElement.srcObject = stream;

            // 监听流结束事件，处理用户停止共享的情况
            stream.getVideoTracks()[0].onended = function () {
                console.log('Screen sharing stopped');
                videoElement.srcObject = null;
            };
        } catch (err) {
            // 处理错误，可能是用户拒绝了屏幕共享请求
            console.error("Error: " + err);
        }
    }
</script>
</body>
</html>
```
