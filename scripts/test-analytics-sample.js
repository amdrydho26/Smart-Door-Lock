import parseLogTime from '../src/utils/parseLogTime.js'

const sample = {
  "analytics": {"totalAccess":505},
  "sampleLogs": [
    {"uid":"A7A3C4AF","status":"Gagal","message":"Pin Salah","log_id":1031,"date":"2025-05-15","time":"15/05/2025 02:00:00","name":"Fachri","userName":"Fachri"},
    {"uid":"9C4CC4AF","status":"Berhasil","message":"Akses diberikan","log_id":615,"date":"2025-05-01","time":"01/05/2025 12:37:47.754871","name":"Fattah","userName":"Fattah"},
    {"uid":"42C0C4AF","status":"Berhasil","message":"Akses diberikan","log_id":757,"date":"2025-05-01","time":"01/05/2025 12:24:47.756317","name":"Rexa","userName":"Rexa"}
  ]
}

const all = sample.sampleLogs
const parsedDates = all.map(l => parseLogTime(l.time)).filter(d => !isNaN(d))
console.log('parsedDates:', parsedDates.map(d=>d.toString()))
if (!parsedDates.length) process.exit(0)
const lastDate = new Date(Math.max(...parsedDates.map(d=>d.getTime())))
const windowEnd = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate(), 23,59,59,999)
const windowStart = new Date(windowEnd.getFullYear(), windowEnd.getMonth(), windowEnd.getDate()-6, 0,0,0,0)
console.log('windowStart', windowStart.toString(), 'windowEnd', windowEnd.toString())

const daily = []
for (let i=0;i<7;i++){
  const dt = new Date(windowStart.getFullYear(), windowStart.getMonth(), windowStart.getDate()+i)
  const count = all.filter(l=>{
    const d = parseLogTime(l.time)
    return !isNaN(d) && d >= new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0,0,0,0) && d <= new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(),23,59,59,999)
  }).length
  daily.push({ day: dt.toDateString().split(' ')[0], value: count })
}
console.log('daily', daily)

const hourBuckets = Array.from({length:24}, (_,h)=>({time:`${String(h).padStart(2,'0')}:00`, value:0}))
for (const l of all){
  const d = parseLogTime(l.time)
  if (!isNaN(d) && d >= windowStart && d <= windowEnd) hourBuckets[d.getHours()].value++
}
console.log('hourBuckets', hourBuckets.map(h=>h.value))

const uids = new Set()
for (const l of all){ const d = parseLogTime(l.time); if(!isNaN(d) && d>=windowStart && d<=windowEnd) uids.add(l.uid) }
console.log('activeUsers in window', uids.size)
