export function isSuccess(status) {
  if (status === null || status === undefined) return false
  const s = String(status).trim().toLowerCase()
  return ['sukses', 'berhasil', 'success', 'ok', 'true', '1'].includes(s)
}

export function formatStatus(status) {
  return isSuccess(status) ? 'Berhasil' : 'Gagal'
}

export default { isSuccess, formatStatus }
