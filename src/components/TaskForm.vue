<template>
  <v-container>
    <v-form @submit.prevent="submitTask">
      <v-text-field
        v-model="taskTitle"
        label="Task Title"
        required
        :rules="[titleRule]"
      ></v-text-field>
      <v-btn type="submit" color="primary">{{
        isEditing ? "Update Task" : "Add Task"
      }}</v-btn>
      <v-btn v-if="isEditing" @click="cancelEdit" color="grey">Cancel</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";
import { useTaskStore } from "../stores/taskStore";

const store = useTaskStore();
const taskTitle = ref("");
const isEditing = ref(false);
const currentTask = ref(null);

const titleRule = (v) => !!v || "Task title is required";

const submitTask = async () => {
  if (taskTitle.value.trim()) {
    if (isEditing.value) {
      currentTask.value.title = taskTitle.value;
      await store.addTask(currentTask.value); // Update task
    } else {
      await store.addTask({ title: taskTitle.value, completed: false });
    }
    taskTitle.value = "";
    isEditing.value = false;
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  taskTitle.value = "";
};

const startEditing = (task) => {
  isEditing.value = true;
  currentTask.value = task;
  taskTitle.value = task.title;
};

watch(
  () => store.tasks,
  (tasks) => {
    if (
      currentTask.value &&
      !tasks.some((task) => task.id === currentTask.value.id)
    ) {
      cancelEdit();
    }
  }
);
</script>
