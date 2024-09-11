<template>
  <v-container>
    <div class="border border-primary">
      <v-list-item-group v-if="tasks.length">
        <v-list-item v-for="task in tasks" :key="task.id">
          <div
            class="d-flex justify-space-between ma-3 align-center border-b-lg pa-2"
          >
            <v-list-item-content>
              <v-list-item-title>{{ task.title }}</v-list-item-title>
            </v-list-item-content>
            <div class="d-flex ga-3">
              <div>
                <v-btn @click="deleteTask(task.id)" icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
              <div class="light-green-accent-3">
                <v-btn icon>
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </v-list-item>
      </v-list-item-group>
      <v-list-item v-else>
        <v-list-item-content>No tasks available</v-list-item-content>
      </v-list-item>
    </div>
    <!-- <v-pagination
      v-model:page="page"
      :length="totalPages"
      @input="handlePageChange"
    ></v-pagination> -->
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useTaskStore } from "../stores/taskStore";

const store = useTaskStore();
const page = ref(store.page);
const tasks = ref(store.tasks);
const totalPages = ref(store.totalPages);

const fetchTasks = (pageNumber) => {
  store.fetchTasks(pageNumber);
};

const handlePageChange = (pageNumber) => {
  fetchTasks(pageNumber);
  page.value = pageNumber;
};

onMounted(() => {
  fetchTasks(page.value);
});

watch(
  () => store.tasks,
  (newTasks) => {
    tasks.value = newTasks;
  }
);

watch(
  () => store.page,
  (newPage) => {
    page.value = newPage;
  }
);

watch(
  () => store.totalPages,
  (newTotalPages) => {
    totalPages.value = newTotalPages;
  }
);

const deleteTask = (id) => {
  store.deleteTask(id);
};
</script>
