import { ref, watch, onMounted } from 'vue'

export function useCountUp(targetValue, options = {}) {
  const { duration = 800, decimals = 0 } = options
  const displayed = ref(0)

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

  const animate = (from, to) => {
    const start = performance.now()
    const diff = to - from
    const step = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      displayed.value = Number((from + diff * eased).toFixed(decimals))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  const getTargetValue = () => {
    if (typeof targetValue === 'function') return Number(targetValue()) || 0
    if (targetValue && typeof targetValue === 'object' && 'value' in targetValue) return Number(targetValue.value) || 0
    return Number(targetValue) || 0
  }

  onMounted(() => {
    animate(0, getTargetValue())
  })

  // watch ref/computed values for changes
  if (targetValue && typeof targetValue === 'object' && 'value' in targetValue) {
    watch(() => targetValue.value, (v, old) => {
      const newVal = Number(v) || 0
      if (newVal !== Number(old || 0)) animate(Number(displayed.value), newVal)
    })
  } else if (typeof targetValue === 'function') {
    watch(targetValue, (v, old) => {
      const newVal = Number(v) || 0
      if (newVal !== Number(old || 0)) animate(Number(displayed.value), newVal)
    })
  }

  return displayed
}
