import parseLogTime from '../src/utils/parseLogTime.js'

const samples = [
  '01/05/2025 12:37:47.754871',
  '01/05/2025 12:37:47.754',
  '2025-05-01 12:37:47.754',
  '2025-05-01T12:37:47.754Z',
  { date: '2025-05-01', time: '12:37:47.754871' },
  { date: '2025-05-01', time: '12:37:47' },
]

for (const s of samples) {
  const d = parseLogTime(s)
  console.log('input:', s)
  if (isNaN(d)) console.log('  => invalid date')
  else console.log('  =>', d.toString(), '| localHour=', d.getHours(), '| iso=', d.toISOString())
}
