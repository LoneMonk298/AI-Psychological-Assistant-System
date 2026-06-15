<template>
  <div ref="mascotRef" class="brand-mascot" :class="{ compact }">
    <div class="robot-orbit orbit-one"></div>
    <div class="robot-orbit orbit-two"></div>

    <div class="robot">
      <div class="antenna">
        <span></span>
      </div>
      <div class="ear ear-left"></div>
      <div class="ear ear-right"></div>

      <div class="head">
        <div class="screen">
          <div class="eye eye-left">
            <span :style="eyeStyle"></span>
          </div>
          <div class="eye eye-right">
            <span :style="eyeStyle"></span>
          </div>
          <div class="smile"></div>
        </div>
        <div class="shine"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({
  compact: {
    type: Boolean,
    default: false,
  },
})

const mascotRef = ref(null)
const eyeOffset = ref({ x: 0, y: 0 })
let isCoarsePointer = false

const eyeStyle = computed(() => ({
  transform: `translate(${eyeOffset.value.x}px, ${eyeOffset.value.y}px)`,
}))

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const resetEyes = () => {
  eyeOffset.value = { x: 0, y: 0 }
}

const handlePointerMove = (event) => {
  if (isCoarsePointer || !mascotRef.value) return

  const rect = mascotRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const x = (event.clientX - centerX) / window.innerWidth
  const y = (event.clientY - centerY) / window.innerHeight

  eyeOffset.value = {
    x: clamp(x * 22, -6, 6),
    y: clamp(y * 18, -5, 5),
  }
}

onMounted(() => {
  isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('blur', resetEyes)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('blur', resetEyes)
})
</script>

<style scoped>
.brand-mascot {
  --mascot-size: 260px;
  --brand-primary: #8a68d6;
  --brand-deep: #30284f;
  --brand-mint: #64edac;
  --brand-accent: #ee9fc9;

  position: relative;
  display: grid;
  width: var(--mascot-size);
  height: var(--mascot-size);
  place-items: center;
  isolation: isolate;
  animation: robot-float 4.6s ease-in-out infinite;
}

.brand-mascot.compact {
  --mascot-size: 120px;
}

.robot-orbit {
  position: absolute;
  z-index: -1;
  border-radius: 999px;
  filter: blur(0.2px);
}

.orbit-one {
  width: 78%;
  height: 78%;
  border: 1px solid rgba(138, 104, 214, 0.22);
  transform: rotate(-18deg);
}

.orbit-two {
  width: 54%;
  height: 54%;
  border: 1px dashed rgba(238, 159, 201, 0.32);
  transform: rotate(22deg);
}

.robot {
  position: relative;
  width: 68%;
  height: 76%;
}

.antenna {
  position: absolute;
  left: 50%;
  bottom: 78%;
  width: 8%;
  height: 25%;
  border-radius: 999px;
  background: var(--brand-deep);
  transform: translateX(-50%);
}

.antenna span {
  position: absolute;
  left: 50%;
  top: -26%;
  width: 230%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
  box-shadow: 0 10px 24px rgba(138, 104, 214, 0.24);
  transform: translateX(-50%);
}

.ear {
  position: absolute;
  top: 35%;
  width: 15%;
  height: 28%;
  border-radius: 999px;
  background: var(--brand-deep);
}

.ear-left {
  left: 0;
}

.ear-right {
  right: 0;
}

.head {
  position: absolute;
  inset: 15% 8% 20%;
  border: 6px solid rgba(255, 255, 255, 0.92);
  border-radius: 28% 28% 24% 24%;
  background:
    radial-gradient(circle at 25% 18%, rgba(255, 255, 255, 0.7), transparent 18%),
    linear-gradient(135deg, var(--brand-mint), #92f2c6 48%, var(--brand-primary));
  box-shadow:
    0 28px 60px rgba(48, 40, 79, 0.18),
    inset 0 -20px 34px rgba(48, 40, 79, 0.08);
}

.screen {
  position: absolute;
  inset: 24% 17% 29%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  border-radius: 18px;
  background: rgba(48, 40, 79, 0.9);
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.eye {
  display: grid;
  width: 42%;
  aspect-ratio: 1;
  place-items: center;
  border-radius: 50%;
  background: #fff;
}

.eye span {
  display: block;
  width: 46%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--brand-primary);
  transition: transform 0.1s ease-out;
}

.smile {
  position: absolute;
  left: 50%;
  bottom: 17%;
  width: 24%;
  height: 10%;
  border-bottom: 3px solid rgba(255, 255, 255, 0.72);
  border-radius: 0 0 999px 999px;
  transform: translateX(-50%);
}

.shine {
  position: absolute;
  top: 17%;
  left: 19%;
  width: 18%;
  height: 8%;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  transform: rotate(-28deg);
}

.body {
  position: absolute;
  left: 50%;
  bottom: 4%;
  display: flex;
  width: 44%;
  height: 20%;
  align-items: center;
  justify-content: center;
  gap: 8%;
  border-radius: 16px 16px 24px 24px;
  background: var(--brand-deep);
  box-shadow: 0 18px 34px rgba(48, 40, 79, 0.18);
  transform: translateX(-50%);
}

.body span {
  width: 12%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--brand-mint);
}

@keyframes robot-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 640px), (pointer: coarse) {
  .brand-mascot {
    --mascot-size: 190px;
  }

  .brand-mascot.compact {
    --mascot-size: 96px;
  }

  .eye span {
    transform: translate(0, 0) !important;
  }
}
</style>
