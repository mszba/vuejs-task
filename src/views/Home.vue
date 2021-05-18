<template>
  <div class="main-wrapper">
    <HomePage />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HomePage from "@/components/HomePage.vue";

@Component({
  components: {
    HomePage,
  },
})
export default class Home extends Vue {}
</script>

<style scoped>
.main-wrapper {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>