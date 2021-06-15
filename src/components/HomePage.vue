<template>
  <div class="wrapper">
    <SearchPanel :handleSubmit="handleSubmit" :queryParams="queryParams" />
    <SearchList />
    <Pagination :queryParams="queryParams" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import SearchList from "./SearchList.vue";
import SearchPanel from "./SearchPanel.vue";
import Pagination from "./Pagination.vue";

@Component({
  components: {
    SearchPanel,
    SearchList,
    Pagination,
  },
})
export default class HomePage extends Vue {
  queryParams = {
    name: this.$route.query.name || "",
    page: Number(this.$route.query.page) || 1,
    target: this.$route.query.target || "repositories",
    sort: this.$route.query.sort || "stars",
    order: this.$route.query.order || "desc",
    per_page: Number(this.$route.query.per_page) || 10,
  };

  handleSearchDispatch(): void {
    this.$store.dispatch("searchForData", {
      ...this.queryParams,
    });
  }

  handleSubmit(event: Event): void {
    if (event) event.preventDefault();

    const query = Object.assign({}, this.$route.query);
    query.name = this.queryParams.name;
    query.page = this.queryParams.page;
    query.target = this.queryParams.target;
    query.sort = this.queryParams.sort;
    query.order = this.queryParams.order;
    query.per_page = this.queryParams.per_page;
    this.$router.push({ query });

    this.handleSearchDispatch();
  }

  mounted(): void {
    if (this.$route.query.name == null) return;

    this.$store.commit("setCurrentPage", this.$route.query.page);

    if (
      (this.queryParams.target === "repositories" &&
        this.$store.state.reposArray.length === 0) ||
      (this.queryParams.target === "users" &&
        this.$store.state.usersArray.length === 0)
    ) {
      this.handleSearchDispatch();
    }
  }

  @Watch("$route", { immediate: false, deep: true })
  onUrlChange(): void {
    if (this.$store.state.currentPage !== this.$route.query.page) {
      this.$store.state.currentPage = this.$route.query.page;

      this.$store.dispatch("searchForData", {
        ...this.queryParams,
        page: this.$route.query.page,
      });
    }
  }
}
</script>

<style scoped>
.wrapper {
  margin-top: 7%;
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
