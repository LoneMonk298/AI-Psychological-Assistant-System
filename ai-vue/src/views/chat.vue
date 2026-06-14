<template>
  <div class="chat-page">
    <div class="chat-header">
      <div>
        <h2>AI 咨询</h2>
        <p>由 MaxKB 提供智能问答服务</p>
      </div>
    </div>

    <div
      v-loading="isFrameLoading"
      element-loading-text="AI 咨询服务加载中..."
      class="chat-frame-wrapper"
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'ChatView',
})

const maxkbChatUrl = 'https://maxkb.lonemonk.xyz/chat/2800d6d7256ba6a7'
const isFrameLoading = ref(true)

const handleFrameLoad = () => {
  isFrameLoading.value = false
}
</script>

<style scoped>
.chat-page {
  height: calc(100vh - 72px);
  display: flex;
  flex-direction: column;
  background: #f7f2ff;
}

.chat-header {
  padding: 20px 24px;
  background: #fff;
  border-bottom: 1px solid #ebe7f5;
}

.chat-header h2 {
  margin: 0;
  color: #30284f;
  font-size: 22px;
}

.chat-header p {
  margin-top: 6px;
  color: #69627b;
  font-size: 14px;
}

.chat-frame-wrapper {
  flex: 1;
  position: relative;
  padding: 16px;
  min-height: 0;
}

.chat-frame {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 8px;
  background: #fff;
  transition: opacity 0.2s ease;
}

.chat-frame.is-loading {
  opacity: 0;
}
</style>
