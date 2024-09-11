<!-- src/components/TaskForm.vue -->
<template>
  <v-container>
    <v-form @submit.prevent="submitTask">
      <v-text-field
        v-model="taskTitle"
        label="Task Title"
        required
      ></v-text-field>
      <v-btn type="submit" color="primary">Add Task</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useTaskStore } from "../stores/taskStore";

const store = useTaskStore();
const taskTitle = ref("");

const submitTask = async () => {
  if (taskTitle.value.trim()) {
    await store.addTask({ title: taskTitle.value, completed: false });
    taskTitle.value = "";
  }
};
</script>
