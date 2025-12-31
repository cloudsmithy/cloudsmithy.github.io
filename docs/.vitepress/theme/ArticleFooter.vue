<template>
  <div class="article-footer">
    <div class="footer-divider"></div>
    <div class="footer-content">
      <h3>🎉 感谢阅读</h3>
      <p>如果这篇文章对你有帮助，欢迎关注公众号或打赏支持～</p>
      
      <div class="qrcode-row">
        <!-- 公众号 -->
        <div class="qrcode-card">
          <div class="card-inner">
            <img 
              src="https://dl.playground.lazycat.cloud/guidelines/459/9d64a5fd-8d84-4834-849b-21d5372dc2a5.jpg" 
              alt="关注公众号"
              class="qrcode-img"
            />
          </div>
          <span class="qrcode-label">📱 关注公众号</span>
        </div>
        
        <!-- 打赏 -->
        <div class="qrcode-card">
          <div class="card-inner reward-card">
            <img 
              src="https://lzc-playground-1301583638.cos.ap-chengdu.myqcloud.com/guidelines/459/948f4e54-c591-479e-93d6-d177e992d0d2.png" 
              alt="打赏支持"
              class="qrcode-img"
            />
          </div>
          <span class="qrcode-label">☕ 打赏支持</span>
        </div>
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
  background: linear-gradient(to right, transparent, var(--vp-c-divider), transparent);
  margin-bottom: 2rem;
}

.footer-content {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg-alt) 100%);
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
}

.footer-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.4rem;
  background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-content p {
  margin: 0 0 2rem 0;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.qrcode-row {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.qrcode-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.card-inner {
  width: 240px;
  height: 280px;
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-inner:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.reward-card {
  background: linear-gradient(135deg, #fff9e6 0%, #fff 100%);
}

.qrcode-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  display: block;
}

.qrcode-label {
  color: var(--vp-c-text-1);
  font-size: 1rem;
  font-weight: 500;
}

/* 响应式 */
@media (max-width: 640px) {
  .qrcode-row {
    gap: 2rem;
  }
  
  .card-inner {
    width: 180px;
    height: 210px;
  }
  
  .footer-content {
    padding: 1.5rem 1rem;
  }
}
</style>
