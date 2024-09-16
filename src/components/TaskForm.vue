<template>
  <v-container>
    <v-form @submit.prevent="submitTask">
      <v-text-field
        v-model="taskTitle"
        label="Task Title"
        required
        :rules="[titleRule]"
        outlined
        dense
      ></v-text-field>
      <v-select
        v-model="taskPriority"
        :items="['Low', 'Medium', 'High']"
        label="Priority"
        outlined
        dense
        class="mb-4"
      ></v-select>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dueDate"
            label="Due Date"
            readonly
            v-bind="attrs"
            v-on="on"
            prepend-icon="mdi-calendar"
          ></v-text-field>
        </template>
        <v-date-picker v-model="dueDate" @input="menu = false"></v-date-picker>
      </v-menu>
      <v-btn type="submit" color="primary" class="ma-2" elevation="2">
        {{ isEditing ? "Update Task" : "Add Task" }}
      </v-btn>
      <v-btn
        v-if="isEditing"
        @click="cancelEdit"
        color="grey"
        class="ma-2"
        elevation="2"
      >
        Cancel
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";
import { useTaskStore } from "../stores/taskStore";

const store = useTaskStore();
const taskTitle = ref("");
const dueDate = ref("");
const taskPriority = ref("Medium");
const isEditing = ref(false);
const currentTask = ref(null);
const menu = ref(false);

const titleRule = (v) => !!v || "Task title is required";

const submitTask = async () => {
  try {
    if (taskTitle.value.trim()) {
      const task = {
        title: taskTitle.value,
        completed: false,
        dueDate: dueDate.value,
        priority: taskPriority.value,
      };

      if (isEditing.value) {
        console.warn("You are in edit mode. Please switch to add mode.");
        return;
      }

      await store.addTask(task);

      taskTitle.value = "";
      dueDate.value = "";
      taskPriority.value = "Medium";
    }
  } catch (error) {
    console.error("Error submitting task:", error);
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  taskTitle.value = "";
  dueDate.value = "";
  taskPriority.value = "Medium";
};

const startEditing = (task) => {
  isEditing.value = true;
  currentTask.value = task;
  taskTitle.value = task.title;
  dueDate.value = task.dueDate;
  taskPriority.value = task.priority;
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
