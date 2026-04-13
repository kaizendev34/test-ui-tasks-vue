<template>
  <div class="add-task-container">
    <div class="form-card">
      <h1>Add New Task</h1>
      <form @submit.prevent="addTask" class="task-form">
        <div class="form-group">
          <label for="title">Title:</label>
          <input v-model="title" id="title" type="text" required class="form-input" />
        </div>
        <div class="form-group">
          <label for="status">Status:</label>
          <select v-model="status" id="status" class="form-select">
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? 'Adding...' : 'Add Task' }}
        </button>
        <div v-if="error" class="error-message">{{ error }}</div>
      </form>
      <router-link to="/tasks" class="back-link">← Back to Tasks</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const title = ref('')
const status = ref('pending')
const loading = ref(false)
const error = ref('')

const addTask = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 1|kSIwoOCyjklBjo7WYhUN2gxTEAFNUw5OautWGDp311d75f18'
      },
      body: JSON.stringify({ title: title.value, status: status.value })
    })
    if (!response.ok) {
      throw new Error('Failed to add task')
    }
    router.push('/tasks')
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.add-task-container {
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
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.task-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.submit-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
}

.back-link {
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
