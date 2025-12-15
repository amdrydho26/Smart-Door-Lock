// Robust parser for log time values. Returns a Date (local timezone) or an invalid Date on failure.
export default function parseLogTime(input) {
  if (!input) return new Date(NaN)

  let s = ''
  if (typeof input === 'object') {
    // Prefer an explicit 'time' that may already be formatted like 'dd/mm/yyyy hh:mm:ss(.sss)'
    if (input.time && String(input.time).trim()) {
      s = String(input.time).trim()
      // If time looks like a full 'dd/mm/yyyy hh:mm:ss' keep it as-is
      if (s.includes('/') && s.includes(' ')) { /* keep */ }
      // If time is just 'hh:mm:ss' but date exists, build from date
      else if (input.date && !s.includes('/') && !s.includes('-')) {
        s = `${input.date} ${s}`
      }
    } else if (input.date && String(input.date).trim()) {
      s = String(input.date).trim()
    } else if (input.datetime) {
      s = String(input.datetime).trim()
    }
  } else {
    s = String(input).trim()
  }

  if (!s) return new Date(NaN)

  // dd/mm/yyyy hh:mm:ss(.sss)
  if (s.includes('/') && s.includes(' ')) {
    const [datePart, timePart] = s.split(' ')
    const [dd, mm, yyyy] = datePart.split('/').map(Number)
    if ([dd, mm, yyyy].every(Number.isFinite)) {
      const [hh = 0, mn = 0, secRaw = 0] = (timePart || '').split(':')
      const secondsFloat = Number(secRaw) || 0
      const seconds = Math.floor(secondsFloat)
      const ms = Math.round((secondsFloat - seconds) * 1000)
      return new Date(yyyy, (mm || 1) - 1, dd || 1, Number(hh) || 0, Number(mn) || 0, seconds || 0, ms || 0)
    }
  }

  // yyyy-mm-dd [ hh:mm:ss(.sss) ]
  const isoLike = /^\s*(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d+(?:\.\d+)?))?)?\s*$/
  const m = s.match(isoLike)
  if (m) {
    const [, Y, M, D, hh = '0', mm = '0', ssRaw = '0'] = m
    const secondsFloat = Number(ssRaw) || 0
    const seconds = Math.floor(secondsFloat)
    const ms = Math.round((secondsFloat - seconds) * 1000)
    return new Date(Number(Y), Number(M) - 1, Number(D), Number(hh) || 0, Number(mm) || 0, seconds || 0, ms || 0)
  }

  // Fallback to Date parsing (may produce UTC ISO if input has timezone)
  const d = new Date(s)
  return d
}
