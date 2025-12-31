<template>
  <div class="article-footer">
    <div class="footer-divider"></div>
    <div class="footer-content">
      <h3>🎉 感谢阅读</h3>
      <p>如果这篇文章对你有帮助，欢迎关注公众号获取更多内容～</p>
      <div class="qrcode-wrapper">
        <img 
          src="https://dl.playground.lazycat.cloud/guidelines/459/9d64a5fd-8d84-4834-849b-21d5372dc2a5.jpg" 
          alt="关注公众号"
          class="qrcode-img"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-footer {
  margin-top: 3rem;
}

.footer-divider {
  height: 1px;
  background: var(--vp-c-divider);
  margin-bottom: 2rem;
}

.footer-content {
  text-align: center;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.footer-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.footer-content p {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-2);
}

.qrcode-wrapper {
  display: flex;
  justify-content: center;
}

.qrcode-img {
  max-width: 300px;
  border-radius: 8px;
}
</style>
