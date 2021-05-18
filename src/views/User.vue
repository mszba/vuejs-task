<template>
  <div class="main-wrapper">
    <UserPage />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UserPage from "../components/UserPage.vue";

@Component({
  components: {
    UserPage,
  },
})
export default class User extends Vue {}
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