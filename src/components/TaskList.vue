<template>
  <v-container>
    <v-card class="pa-4" outlined>
      <v-card-title>
        <v-row>
          <v-col class="text-h5" cols="12">Task List</v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle>
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="filter"
              :items="filters"
              label="Filter Tasks"
              outlined
              dense
            ></v-select>
          </v-col>
        </v-row>
      </v-card-subtitle>
      <v-list>
        <v-list-item-group v-if="filteredTasks.length">
          <v-list-item
            v-for="task in filteredTasks"
            :key="task.id"
            class="mb-2"
            @click="editTask(task)"
          >
            <v-card class="pa-2" outlined>
              <v-card-title>
                <v-checkbox
                  v-model="task.completed"
                  @change="toggleCompletion(task)"
                  class="mr-2"
                ></v-checkbox>
                <v-list-item-title
                  :class="{ 'text-decoration-line-through': task.completed }"
                >
                  {{ task.title }}
                </v-list-item-title>
              </v-card-title>
              <v-card-actions>
                <v-btn @click.stop="deleteTask(task.id)" icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-list-item>
        </v-list-item-group>
        <v-list-item v-else>
          <v-list-item-content>No tasks available</v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- <v-pagination
        v-model:page="page"
        :length="totalPages"
        @input="handlePageChange"
        class="mt-4"
      ></v-pagination> -->
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useTaskStore } from "../stores/taskStore";

const store = useTaskStore();
const page = ref(store.page);
const filter = ref("all");
const filters = ["all", "completed", "pending"];
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

const toggleCompletion = (task) => {
  task.completed = !task.completed;
  store.addTask(task); // Assuming addTask updates the task
};

const filteredTasks = computed(() => {
  if (filter.value === "completed") {
    return tasks.value.filter((task) => task.completed);
  } else if (filter.value === "pending") {
    return tasks.value.filter((task) => !task.completed);
  } else {
    return tasks.value;
  }
});

const editTask = (task) => {
  console.log("Edit task:", task);
};
</script>

<style scoped>
.text-decoration-line-through {
  text-decoration: line-through;
}
</style>
