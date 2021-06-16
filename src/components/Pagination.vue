<template>
  <div class="paginationWrap" v-if="$store.state.totalCount > 0">
    <span
      v-for="(item, index) in getPaginationArray(queryParams.page, pageNumbers)"
      :key="index"
    >
      <button
        :class="{
          currentButton: item == $route.query.page,
          dotsPage: item === '...',
        }"
        :disabled="
          queryParams.page == item || item === '...' || $store.state.isLoading
        "
        @click="handlePageChange(item)"
      >
        {{ item }}
      </button>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
// import HomePage from "@/components/HomePage.vue";

@Component
export default class Pagination extends Vue {
  @Prop({ required: true }) queryParams;
  @Prop({ required: true }) pageNumbers;

  getPaginationArray(current: number, total: number): [] {
    const center = [
        Number(current) - 2,
        Number(current) - 1,
        Number(current),
        Number(current) + 1,
        Number(current) + 2,
      ],
      filteredCenter = center.filter((p) => p > 1 && p < total);

    if (Number(current) >= 5) {
      filteredCenter.unshift("...");
    }

    if (Number(current) < total - 4) {
      filteredCenter.push("...");
    }

    if (total <= 1) return [1];
    return [1, ...filteredCenter, total];
  }

  handlePageChange(newPageNumber: number): void {
    window.scrollTo(0, 0);
    this.queryParams.page = newPageNumber;
    this.$store.commit("setCurrentPage", newPageNumber);

    const query = Object.assign({}, this.$route.query);
    query.name = this.queryParams.name;
    query.page = newPageNumber;
    query.target = this.queryParams.target;
    query.sort = this.queryParams.sort;
    query.order = this.queryParams.order;
    query.per_page = this.queryParams.per_page;
    this.$router.push({ query });

    this.$store.dispatch("searchForData", this.queryParams);
  }
}
</script>

<style scoped>
.paginationWrap {
  padding: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.paginationWrap button {
  padding: 5px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #026234;
  border-radius: 5px;
  color: #000;
  background: #fff;
  cursor: pointer;
}

.currentButton {
  background-color: #026234 !important;
  color: #fff !important;
}

.dotsPage {
  border: 0 !important;
  font-weight: bold;
  cursor: default !important;
}
</style>