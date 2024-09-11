import { defineStore } from "pinia";
import axios from "axios";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [],
    page: 1,
    totalPages: 1,
  }),
  actions: {
    async fetchTasks(page = 1) {
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=5`
        );
        this.tasks = response.data;
        this.page = page;

        const totalCount = parseInt(response.headers["x-total-count"], 10);
        this.totalPages = Math.ceil(totalCount / 5);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    },
    async addTask(task) {
      try {
        const response = await axios.post(
          "https://jsonplaceholder.typicode.com/todos",
          task
        );
        this.tasks.push(response.data);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },
    async deleteTask(id) {
      try {
        await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
        this.tasks = this.tasks.filter((task) => task.id !== id);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
  },
  persist: true,
});
