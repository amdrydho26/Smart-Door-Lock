<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Manajemen User</h2>
          <p class="text-gray-500 text-sm mt-1">Kelola data pengguna sistem pintu pintar</p>
        </div>
        <button @click="showAddUserModal = true" class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center space-x-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span>Tambah User</span>
        </button>
      </div>
    </div>

    <!-- Filter dan Search -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari user..." 
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <select v-model="filterStatus" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">Filter Status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Non-Aktif</option>
        </select>
        <select v-model="sortBy" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="name">Urutkan: Nama</option>
          <option value="uid">Urutkan: UID</option>
          <option value="added">Urutkan: Baru Ditambah</option>
        </select>
        <button @click="resetFilters" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium">
          Reset Filter
        </button>
      </div>
    </div>

    <!-- User List -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 text-sm">No</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 text-sm">User</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 text-sm">UID</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 text-sm">PIN</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 text-sm">Status</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 text-sm">Tanggal Ditambah</th>
              <th class="px-6 py-3 text-center font-semibold text-gray-700 text-sm">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(user, index) in filteredUsers" :key="index" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 text-sm text-gray-600">{{ index + 1 }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`" :alt="user.name" class="w-10 h-10 rounded-full">
                  <span class="font-medium text-gray-900">{{ user.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 font-mono">{{ user.uid }}</td>
              <td class="px-6 py-4 text-sm text-gray-600 font-mono">{{ showPins[user.uid] ? user.pin : '••••' }}</td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  user.status === 'aktif'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                ]">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ user.dateAdded }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center space-x-2">
                  <button @click="togglePinVisibility(user.uid)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Lihat PIN">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                  <button @click="editUser(user)" class="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Edit">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                    </svg>
                  </button>
                  <button @click="deleteUser(user)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
        Menampilkan {{ filteredUsers.length }} dari {{ users.length }} user
      </div>
    </div>

    <!-- Riwayat Akses User -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Riwayat Akses User Terpilih</h3>
        <div v-if="selectedUserForHistory">
          <div class="bg-blue-50 p-4 rounded-lg mb-4">
            <p class="text-sm text-blue-900">Menampilkan riwayat: <span class="font-bold">{{ selectedUserForHistory.name }}</span></p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-2 text-left font-medium text-gray-700">Waktu</th>
                  <th class="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                  <th class="px-4 py-2 text-left font-medium text-gray-700">Pesan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(log, idx) in selectedUserLogs" :key="idx" class="hover:bg-gray-50">
                  <td class="px-4 py-2 text-gray-600">{{ log.time }}</td>
                  <td class="px-4 py-2">
                    <span :class="[
                      'px-2 py-1 rounded text-xs font-semibold',
                      log.status === 'sukses' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    ]">
                      {{ log.status }}
                    </span>
                  </td>
                  <td class="px-4 py-2 text-gray-600">{{ log.message }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <p>Pilih user untuk melihat riwayat akses</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Pilih User</h3>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <button
            v-for="user in users"
            :key="user.uid"
            @click="selectUserForHistory(user)"
            :class="[
              'w-full text-left p-3 rounded-lg border-2 transition',
              selectedUserForHistory?.uid === user.uid
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-2">
              <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`" :alt="user.name" class="w-8 h-8 rounded-full">
              <div class="flex-1">
                <p class="font-medium text-gray-900 text-sm">{{ user.name }}</p>
                <p class="text-xs text-gray-500">{{ user.uid }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Tambah/Edit User -->
    <div v-if="showAddUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900">{{ editingUser ? 'Edit User' : 'Tambah User Baru' }}</h3>
          <button @click="showAddUserModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveUser" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama User</label>
            <input v-model="formData.name" type="text" placeholder="Masukkan nama" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">UID</label>
            <input v-model="formData.uid" type="text" placeholder="Masukkan UID" :disabled="editingUser" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">PIN (4 digit)</label>
            <input v-model="formData.pin" type="text" placeholder="Masukkan PIN" pattern="[0-9]{4}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="formData.status" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Non-Aktif</option>
            </select>
          </div>
          <div class="flex space-x-3 pt-4">
            <button type="button" @click="showAddUserModal = false" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition">
              Batal
            </button>
            <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">
              {{ editingUser ? 'Perbarui' : 'Tambah' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-sm w-full">
        <div class="p-6">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 text-center mb-2">Hapus User?</h3>
          <p class="text-gray-500 text-center mb-6">Apakah Anda yakin ingin menghapus user <strong>{{ userToDelete?.name }}</strong>?</p>
          <div class="flex space-x-3">
            <button @click="showDeleteConfirm = false" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition">
              Batal
            </button>
            <button @click="confirmDelete" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition">
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filterStatus = ref('')
const sortBy = ref('name')
const showAddUserModal = ref(false)
const showDeleteConfirm = ref(false)
const editingUser = ref(null)
const userToDelete = ref(null)
const showPins = ref({})
const selectedUserForHistory = ref(null)

const formData = ref({
  name: '',
  uid: '',
  pin: '',
  status: 'aktif',
})

const users = ref([
  { uid: 'user001', name: 'Budi Santoso', pin: '1234', status: 'aktif', dateAdded: '01/01/2025' },
  { uid: 'user002', name: 'Siti Nurhaliza', pin: '5678', status: 'aktif', dateAdded: '02/01/2025' },
  { uid: 'user003', name: 'Rinto Harahap', pin: '9012', status: 'nonaktif', dateAdded: '03/01/2025' },
  { uid: 'user004', name: 'Dewi Lestari', pin: '3456', status: 'aktif', dateAdded: '04/01/2025' },
  { uid: 'user005', name: 'Ahmad Rizaldi', pin: '7890', status: 'aktif', dateAdded: '05/01/2025' },
  { uid: 'user006', name: 'Ratna Wijaya', pin: '2345', status: 'aktif', dateAdded: '06/01/2025' },
])

const allLogs = ref({
  user001: [
    { time: '12/11/2025 14:35:22', status: 'sukses', message: 'Pintu dibuka dengan PIN' },
    { time: '12/11/2025 10:20:15', status: 'sukses', message: 'Pintu dibuka dengan RFID' },
    { time: '12/11/2025 08:05:47', status: 'gagal', message: 'PIN salah (Percobaan 2)' },
  ],
  user002: [
    { time: '12/11/2025 14:28:15', status: 'sukses', message: 'Pintu dibuka dengan RFID' },
    { time: '12/10/2025 16:12:00', status: 'sukses', message: 'Pintu dibuka dengan PIN' },
  ],
  user003: [
    { time: '12/11/2025 14:15:47', status: 'gagal', message: 'PIN salah (Percobaan 3)' },
    { time: '12/10/2025 13:45:33', status: 'sukses', message: 'Pintu dibuka dengan PIN' },
  ],
})

const selectedUserLogs = computed(() => {
  if (!selectedUserForHistory.value) return []
  return allLogs.value[selectedUserForHistory.value.uid] || []
})

const filteredUsers = computed(() => {
  let result = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user =>
      user.name.toLowerCase().includes(query) || user.uid.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value) {
    result = result.filter(user => user.status === filterStatus.value)
  }

  if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'uid') {
    result.sort((a, b) => a.uid.localeCompare(b.uid))
  }

  return result
})

const togglePinVisibility = (uid) => {
  showPins.value[uid] = !showPins.value[uid]
}

const selectUserForHistory = (user) => {
  selectedUserForHistory.value = user
}

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  sortBy.value = 'name'
}

const editUser = (user) => {
  editingUser.value = user
  formData.value = { ...user }
  showAddUserModal.value = true
}

const deleteUser = (user) => {
  userToDelete.value = user
  showDeleteConfirm.value = true
}

const confirmDelete = () => {
  if (userToDelete.value) {
    users.value = users.value.filter(u => u.uid !== userToDelete.value.uid)
    showDeleteConfirm.value = false
    userToDelete.value = null
  }
}

const saveUser = () => {
  if (editingUser.value) {
    const index = users.value.findIndex(u => u.uid === editingUser.value.uid)
    if (index !== -1) {
      users.value[index] = {
        ...formData.value,
        dateAdded: users.value[index].dateAdded,
      }
    }
  } else {
    users.value.push({
      ...formData.value,
      dateAdded: new Date().toLocaleDateString('id-ID'),
    })
  }
  showAddUserModal.value = false
  editingUser.value = null
  formData.value = { name: '', uid: '', pin: '', status: 'aktif' }
}
</script>
