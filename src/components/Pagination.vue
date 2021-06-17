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
import { queryParamsTypes } from "../interfaces";

@Component
export default class Pagination extends Vue {
  @Prop({ required: true }) queryParams: queryParamsTypes;
  @Prop({ required: true }) pageNumbers: number;

  getPaginationArray(
    current: number | string,
    total: number | string
  ): (string | number)[] | string | number {
    const center: number[] | string[] = [
        Number(current) - 2,
        Number(current) - 1,
        Number(current),
        Number(current) + 1,
        Number(current) + 2,
      ],
      filteredCenter: (string | number)[] = center.filter(
        (p: number | string) => p > 1 && p < total
      );

    if (current >= 5) {
      filteredCenter.unshift("...");
    }

    if (current < Number(total) - 4) {
      filteredCenter.push("...");
    }

    if (total <= 1) return [1];
    return [1, ...filteredCenter, total];
  }

  handlePageChange(newPageNumber: number): void {
    window.scrollTo(0, 0);
    this.queryParams.page = newPageNumber;
    this.$store.commit("setCurrentPage", newPageNumber);

    const query = { ...this.queryParams, page: newPageNumber };
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