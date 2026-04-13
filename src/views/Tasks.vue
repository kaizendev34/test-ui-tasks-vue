<template>
  <div class="tasks-container">
    <div class="header">
      <h1>Tasks Page</h1>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
    <router-link to="/add" class="add-button">Add Task</router-link>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <table v-else class="tasks-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.title }}</td>
          <td>{{ task.status }}</td>
          <td>
            <router-link class="update-btn" :to="`/update/${task.id}`">Update</router-link>
            <button class="delete-btn" @click="deleteTask(task.id)" :disabled="deleting === task.id">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface Task {
  id: number
  title: string
  status: string
  created_at: string
  updated_at: string
}

const router = useRouter()
const tasks = ref<Task[]>([])
const loading = ref(true)
const error = ref('')
const deleting = ref<number | null>(null)

const fetchTasks = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
      method: 'GET',
      headers: {
        'User-Agent': 'yaak',
        'Accept': '*/*',
        'Authorization': 'Bearer 1|kSIwoOCyjklBjo7WYhUN2gxTEAFNUw5OautWGDp311d75f18'
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch tasks')
    }
    const data = await response.json()
    tasks.value = data.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    loading.value = false
  }
}

const deleteTask = async (id: number) => {
  deleting.value = id
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer 1|kSIwoOCyjklBjo7WYhUN2gxTEAFNUw5OautWGDp311d75f18'
      }
    })
    if (!response.ok) {
      throw new Error('Failed to delete task')
    }
    tasks.value = tasks.value.filter(task => task.id !== id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    deleting.value = null
  }
}

const logout = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 1|kSIwoOCyjklBjo7WYhUN2gxTEAFNUw5OautWGDp311d75f18',
        'Accept': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error('Failed to logout')
    }
    router.push('/login')
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
}

onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
.tasks-container {
  padding: 2rem;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.header h1 {
  margin: 0;
}
.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.logout-btn:hover {
  background-color: #c82333;
}
.add-button {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
.add-button:hover {
  background-color: #0056b3;
}
.tasks-table {
  width: 100%;
  border-collapse: collapse;
}
.tasks-table th, .tasks-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.tasks-table th {
  background-color: #f2f2f2;
}
button,
.update-btn {
  margin-right: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: white;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.update-btn {
  background-color: blue;
  border: none;
}
.delete-btn {
  background-color: red;
  border: none;
}
/* Remove extra margin on the last action in a row */
.tasks-table td > *:last-child {
  margin-right: 0;
}
</style>
