<template>
  <div class="floating-reward" @mouseenter="showQrcode = true" @mouseleave="showQrcode = false">
    <!-- 浮动按钮 -->
    <div class="reward-btn" v-show="!showQrcode">
      <span class="btn-icon">❤️</span>
      <span class="btn-text">喜欢</span>
      <div class="pulse-ring"></div>
    </div>
    
    <!-- 打赏弹窗 -->
    <transition name="popup">
      <div class="reward-popup" v-show="showQrcode">
        <div class="popup-header">
          <span>请作者喝杯咖啡 ☕</span>
        </div>
        <img 
          src="https://lzc-playground-1301583638.cos.ap-chengdu.myqcloud.com/guidelines/459/948f4e54-c591-479e-93d6-d177e992d0d2.png" 
          alt="打赏"
          class="reward-img"
        />
        <p class="popup-tip">您的鼓励是我创作的动力</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const showQrcode = ref(false)
</script>

<style scoped>
.floating-reward {
  position: fixed;
  right: 200px;
  bottom: 130px;
  z-index: 999;
}

/* 打赏按钮 */
.reward-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

.reward-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-icon {
  font-size: 1.2rem;
  animation: bounce 2s ease-in-out infinite;
}

.btn-text {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* 脉冲光环 */
.pulse-ring {
  position: absolute;
  inset: 0;
  border-radius: 50px;
  animation: pulse 2s ease-out infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
}

/* 打赏弹窗 */
.reward-popup {
  background: var(--vp-c-bg);
  padding: 1.2rem;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  text-align: center;
  border: 1px solid var(--vp-c-divider);
}

.popup-header {
  margin-bottom: 0.8rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.reward-img {
  width: 180px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.popup-tip {
  margin-top: 0.8rem;
  margin-bottom: 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

/* 弹出动画 */
.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}

/* 移动端隐藏 */
@media (max-width: 768px) {
  .floating-reward {
    display: none;
  }
}
</style>
