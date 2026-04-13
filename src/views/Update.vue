<template>
  <div class="update-task-container">
    <div class="form-card">
      <h1>Update Task</h1>
      <form @submit.prevent="submitUpdate" class="task-form" v-if="!loading">
        <div class="form-group">
          <label for="title">Title</label>
          <input id="title" v-model="title" type="text" class="form-input" required />
        </div>
        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" v-model="status" class="form-select">
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button type="submit" class="submit-btn" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
        <div v-if="error" class="error-message">{{ error }}</div>
      </form>
      <div v-else class="loading-message">Loading task...</div>
      <router-link to="/tasks" class="back-link">← Back to Tasks</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const taskId = Number(route.params.id)
const title = ref('')
const status = ref('pending')
const loading = ref(true)
const saving = ref(false)
const error = ref('')

const fetchTask = async () => {
  if (!taskId) {
    error.value = 'Invalid task id.'
    loading.value = false
    return
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'yaak',
        'Accept': '*/*',
        'Authorization': 'Bearer 1|kSIwoOCyjklBjo7WYhUN2gxTEAFNUw5OautWGDp311d75f18'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to load task')
    }

    const data = await response.json()
    title.value = data.data.title
    status.value = data.data.status
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    loading.value = false
  }
}

const submitUpdate = async () => {
  saving.value = true
  error.value = ''

  try {
    const body = new URLSearchParams()
    body.append('title', title.value)
    body.append('status', status.value)

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'User-Agent': 'yaak',
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer 1|kSIwoOCyjklBjo7WYhUN2gxTEAFNUw5OautWGDp311d75f18'
      },
      body: body.toString()
    })

    if (!response.ok) {
      throw new Error('Failed to update task')
    }

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || 'Update failed')
    }

    router.push('/tasks')
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchTask()
})
</script>

<style scoped>
.update-task-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
}

.form-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 440px;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #222;
}

.task-form {
  display: grid;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #444;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.submit-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.95rem 1.1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.submit-btn:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.loading-message,
.error-message {
  color: #475569;
  text-align: center;
  margin: 1rem 0;
}

.error-message {
  color: #dc2626;
}

.back-link {
  display: block;
  margin-top: 1.5rem;
  text-align: center;
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
