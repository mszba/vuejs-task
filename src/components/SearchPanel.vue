<template>
  <form @submit="handleSubmit" class="searchForm">
    <div class="inputWrap">
      <input
        required
        v-model="queryParams.name"
        class="searchInput"
        type="text"
        placeholder="Type keywords"
        @change="changePageToDefault"
      />
      <button type="submit" :disabled="isLoading" class="searchIconButton">
        <v-icon class="searchIcon" name="search" scale="1.1" />
      </button>
    </div>
    <div class="settingsWrap">
      <h2 class="settingsTitle">Advanced search</h2>
      <div class="queriesList">
        <div class="queryElement">
          <label class="queryLabel" for="target">Search for</label>
          <select
            v-model="queryParams.target"
            name="target"
            id="target"
            @change="changePageToDefault"
          >
            <option value="repositories">repositories</option>
            <option value="users">users</option>
          </select>
        </div>
        <div class="queryElement">
          <label class="queryLabel" for="sort">Sort by</label>
          <select
            v-model="queryParams.sort"
            name="sort"
            id="sort"
            @change="changePageToDefault"
          >
            <option value="stars">stars</option>
            <option value="forks">forks</option>
            <option value="help-wanted-issues">help-wanted-issues</option>
          </select>
        </div>
        <div class="queryElement">
          <label class="queryLabel" for="order">Order by</label>
          <select
            v-model="queryParams.order"
            name="order"
            id="order"
            @change="changePageToDefault"
          >
            <option value="desc">desc</option>
            <option value="asc">asc</option>
          </select>
        </div>
        <div class="queryElement">
          <label class="queryLabel" for="per_page">Items per page</label>
          <select
            v-model="queryParams.per_page"
            name="per_page"
            id="per_page"
            @change="changePageToDefault"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
      <div class="controlPanelWrap">
        <span v-if="totalCount >= 0" class="resultsCount">
          <span class="resultNumber">{{ totalCount }}</span>
          results</span
        >
        <span></span>
        <div class="buttonsWrap">
          <button type="submit" :disabled="isLoading" class="searchButton">
            Search
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
// import HomePage from "@/components/HomePage.vue";

@Component
export default class SearchPanel extends Vue {
  @Prop({ required: true }) handleSubmit;
  @Prop({ required: true }) queryParams;

  get totalCount(): number {
    return this.$store.state.totalCount;
  }

  get isLoading(): boolean {
    return this.$store.state.isLoading;
  }

  changePageToDefault(): void {
    this.queryParams.page = 1;
  }
}
</script>

<style scoped>
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

@media screen and (max-width: 768px) {
  .queryElement {
    width: 45%;
  }
}
</style>