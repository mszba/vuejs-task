<template>
  <div class="wrapper">
    <form @submit="handleSubmit" class="searchForm">
      <div class="inputWrap">
        <input
          required
          v-model="querySearch"
          class="searchInput"
          type="text"
          placeholder="Type keywords"
        />
        <button
          type="submit"
          :disabled="$store.state.isLoading"
          class="searchIconButton"
        >
          <v-icon class="searchIcon" name="search" scale="1.1" />
        </button>
      </div>
      <div class="settingsWrap">
        <h2 class="settingsTitle">Advanced search</h2>
        <div class="queriesList">
          <div class="queryElement">
            <label class="queryLabel" for="target">Search for</label>
            <select v-model="target" name="target" id="target">
              <option value="repositories">repositories</option>
              <option value="users">users</option>
            </select>
          </div>
          <div class="queryElement">
            <label class="queryLabel" for="sort">Sort by</label>
            <select v-model="sort" name="sort" id="sort">
              <option value="stars">stars</option>
              <option value="forks">forks</option>
              <option value="help-wanted-issues">help-wanted-issues</option>
            </select>
          </div>
          <div class="queryElement">
            <label class="queryLabel" for="order">Order by</label>
            <select v-model="order" name="order" id="order">
              <option value="desc">desc</option>
              <option value="asc">asc</option>
            </select>
          </div>
          <div class="queryElement">
            <label class="queryLabel" for="per_page">Items per page</label>
            <select v-model="per_page" name="per_page" id="per_page">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        <div class="controlPanelWrap">
          <span v-if="$store.state.totalCount >= 0" class="resultsCount">
            <span class="resultNumber">{{ $store.state.totalCount }}</span>
            results</span
          >
          <span></span>
          <div class="buttonsWrap">
            <!-- <button type="button" @click="clearSearch" class="resetButton">
              Reset
            </button> -->
            <button
              type="submit"
              :disabled="$store.state.isLoading"
              class="searchButton"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </form>
    <SearchList />
    <div class="paginationWrap" v-if="$store.state.totalCount > 0">
      <span
        class="pagesWrap"
        v-for="(item, index) in pagination(page, pageNumbers())"
        :key="index"
      >
        <button
          :class="{
            currentButton: item == $route.query.page,
            dotsPage: item === '...',
          }"
          :disabled="page == item || item === '...' || $store.state.isLoading"
          @click="handlePageChange(item)"
        >
          {{ item }}
        </button>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import SearchList from "./SearchList.vue";

@Component({
  components: {
    SearchList,
  },
})
export default class HomePage extends Vue {
  querySearch = this.$route.query.name || "";
  page = Number(this.$route.query.page) || 1;
  target = this.$route.query.target || "repositories";
  sort = this.$route.query.sort || "stars";
  order = this.$route.query.order || "desc";
  per_page: number = Number(this.$route.query.per_page) || 10;

  mounted(): void {
    if (this.$route.query.name == null) return;

    this.$store.commit("setCurrentPage", this.$route.query.page);

    if (
      (this.target === "repositories" &&
        this.$store.state.reposArray.length === 0) ||
      (this.target === "users" && this.$store.state.usersArray.length === 0)
    ) {
      this.$store.dispatch("searchForData", {
        nameQuery: this.querySearch,
        pageQuery: this.page,
        target: this.target,
        sort: this.sort,
        order: this.order,
        per_page: this.per_page,
      });
    }
  }

  handleSubmit(event: Event): void {
    if (event) event.preventDefault();

    const query = Object.assign({}, this.$route.query);
    query.name = this.querySearch;
    query.page = this.page;
    query.target = this.target;
    query.sort = this.sort;
    query.order = this.order;
    query.per_page = this.per_page;
    this.$router.push({ query });

    this.$store.dispatch("searchForData", {
      nameQuery: this.querySearch,
      pageQuery: this.page,
      target: this.target,
      sort: this.sort,
      order: this.order,
      per_page: this.per_page,
    });
  }

  pageNumbers(): number {
    return Math.ceil(this.$store.state.totalCount / this.per_page);
  }

  handlePageChange(newPageNumber: number): void {
    this.page = newPageNumber;
    this.$store.commit("setCurrentPage", newPageNumber);
    console.log(this.$store.state.currentPage);

    const query = Object.assign({}, this.$route.query);
    query.name = this.querySearch;
    query.page = newPageNumber;
    query.target = this.target;
    query.sort = this.sort;
    query.order = this.order;
    query.per_page = this.per_page;
    this.$router.push({ query });

    this.$store.dispatch("searchForData", {
      nameQuery: this.querySearch,
      pageQuery: newPageNumber,
      target: this.target,
      sort: this.sort,
      order: this.order,
      per_page: this.per_page,
    });
  }

  pagination(current: number, total: number): [] {
    const center = [
        Number(current) - 2,
        Number(current) - 1,
        Number(current),
        Number(current) + 1,
        Number(current) + 2,
      ],
      filteredCenter = center.filter((p) => p > 1 && p < total),
      includeThreeLeft = Number(current) === 5,
      includeThreeRight = Number(current) === total - 4,
      includeLeftDots = Number(current) > 5,
      includeRightDots = Number(current) < total - 4;

    if (includeThreeLeft) filteredCenter.unshift(2);
    if (includeThreeRight) filteredCenter.push(total - 1);

    if (includeLeftDots) filteredCenter.unshift("...");
    if (includeRightDots) filteredCenter.push("...");

    if (total <= 1) return [1];
    return [1, ...filteredCenter, total];
  }

  @Watch("$route", { immediate: false, deep: true })
  onUrlChange(): void {
    if (this.$store.state.currentPage !== this.$route.query.page) {
      this.$store.state.currentPage = this.$route.query.page;

      this.$store.dispatch("searchForData", {
        nameQuery: this.querySearch,
        pageQuery: this.$route.query.page,
        target: this.target,
        sort: this.sort,
        order: this.order,
        per_page: this.per_page,
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
.searchForm {
  width: 100%;
}
.inputWrap {
  margin-bottom: 5px;
  position: relative;
  width: 100%;
}
.searchInput {
  padding: 15px 30px;
  width: 100%;
  border-radius: 20px;
  border: 0;
  background-image: linear-gradient(
    to right,
    #41b883,
    #38ae79,
    #2ea370,
    #239966,
    #178f5d,
    #118655,
    #097e4d,
    #027545,
    #026b3c,
    #026234,
    #01582c,
    #004f24
  );
  font-family: "Open Sans", sans-serif;
  font-size: 13px;
  color: #ffff;
}

.searchInput::placeholder {
  color: #ffff;
  font-family: "Open Sans", sans-serif;
}

.searchIcon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: #ffff;
}

.searchIconButton {
  border: none;
  cursor: pointer;
}

.searchInput:focus {
  outline: none;
}

.settingsWrap {
  padding: 40px 30px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 3px 26px rgb(32 33 36 / 28%);
  border-color: rgba(223, 225, 229, 0);
}

.settingsTitle {
  margin-bottom: 35px;
  width: 100%;
  font-size: 14px;
  text-transform: uppercase;
}
.queriesList {
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.queryElement {
  margin-bottom: 25px;
  width: 20%;
  display: flex;
  flex-direction: column;
  align-content: center;
}
.queryElement select,
.queryElement input {
  background-color: #cccccc1e;
}
.queryElement select {
  padding: 10px 15px;
  border-radius: 15px;
  font-size: 14px;
  cursor: pointer;
}

.queryLabel {
  margin-bottom: 3px;
  font-size: 14px;
}

.controlPanelWrap {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.resultsCount {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #000;
}
.resultNumber {
  margin-right: 3px;
  font-weight: bold;
}
.buttonsWrap {
  display: flex;
}

.resetButton {
  margin-right: 15px;
  border: 0;
  font-size: 14px;
  text-transform: uppercase;
  background: transparent;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  font-family: "Open Sans", sans-serif;
}
.searchButton {
  padding: 10px 18px;
  border: 0;
  background-image: linear-gradient(
    to right,
    #41b883,
    #38ae79,
    #2ea370,
    #239966,
    #178f5d,
    #118655,
    #097e4d,
    #027545,
    #026b3c,
    #026234,
    #01582c,
    #004f24
  );
  border-radius: 20px;
  font-size: 14px;
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;
  color: #ffff;
  cursor: pointer;
}

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

.prev-button-margin {
  margin-right: 5px;
}

.prev-button {
  margin-right: 10px;
}
.next-button {
  margin-left: 10px;
}

@media screen and (max-width: 768px) {
  .queryElement {
    width: 45%;
  }
}
</style>
