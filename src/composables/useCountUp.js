import { ref, watch, onMounted } from 'vue'

export function useCountUp(targetValue, options = {}) {
  const { duration = 800, decimals = 0 } = options
  const displayed = ref(0)
  const targetRef = ref(typeof targetValue === 'function' ? targetValue() : targetValue)

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

  onMounted(() => {
    const to = Number(targetRef.value) || 0
    animate(0, to)
  })

  // when the targetValue is a ref or function, allow updating
  if (typeof targetValue !== 'function' && targetValue && Object.prototype.hasOwnProperty.call(targetValue, 'value')) {
    watch(targetValue, (v, old) => {
      if (v !== old) animate(Number(displayed.value), Number(v))
    })
  }

  return displayed
}
