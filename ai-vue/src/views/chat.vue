<template>
  <div class="chat-page">
    <section
      v-loading="isFrameLoading"
      element-loading-text="AI 咨询服务加载中..."
      class="chat-frame-shell"
    >
      <iframe
        class="chat-frame"
        :class="{ 'is-loading': isFrameLoading }"
        :src="maxkbChatUrl"
        title="MaxKB AI 咨询"
        frameborder="0"
        allow="microphone"
        @load="handleFrameLoad"
      ></iframe>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'ChatView',
})

const maxkbChatUrl = 'https://maxkb.lonemonk.xyz/chat/74734a6d890b2b01'
const isFrameLoading = ref(true)

const handleFrameLoad = () => {
  isFrameLoading.value = false
}
</script>

<style scoped>
.chat-page {
  display: flex;
  width: 100%;
  min-height: calc(100vh - 72px);
  padding: 0;
  background: #fff;
}

.chat-frame-shell {
  position: relative;
  flex: 1;
  min-height: calc(100vh - 72px);
  overflow: hidden;
  background: #fff;
}

.chat-frame {
  display: block;
  width: 100%;
  height: calc(100vh - 72px);
  min-height: 640px;
  border: 0;
  background: #fff;
  transition: opacity 0.18s ease;
}

.chat-frame.is-loading {
  opacity: 0;
}

@media (max-width: 860px) {
  .chat-page,
  .chat-frame-shell {
    min-height: calc(100vh - 64px);
  }

  .chat-frame {
    height: calc(100vh - 64px);
    min-height: 560px;
  }
}
</style>
