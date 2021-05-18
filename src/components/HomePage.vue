<template>
  <div class="wrapper">
    <form @submit="searchForData" class="searchForm">
      <div class="inputWrap">
        <input
          required
          v-model="querySearch"
          class="searchInput"
          type="text"
          placeholder="Type keywords"
        />
        <button type="submit" :disabled="loading" class="searchIconButton">
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
          <div class="queryElement">
            <label class="queryLabel" for="page">Page number</label>
            <input
              v-model="page"
              id="page"
              type="number"
              placeholder="Page numbers"
            />
          </div>
        </div>
        <div class="controlPanelWrap">
          <span v-if="totalCount >= 0" class="resultsCount">
            <span style="font-weight: bold">{{ totalCount }}</span>
            results</span
          >
          <span></span>
          <div class="buttonsWrap">
            <button type="button" @click="clearSearch" class="resetButton">
              Reset
            </button>
            <button type="submit" :disabled="loading" class="searchButton">
              Search
            </button>
          </div>
        </div>
      </div>
    </form>
    <SearchList
      :usersList="usersArray"
      :reposList="reposArray"
      :loading="loading"
      :totalCount="totalCount"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SearchList from "./SearchList.vue";
import axios from "axios";
import {
  Data,
  Items,
  Commits,
  contributorsTypes,
  contributorObject,
  reposArray,
  usersInterface,
  usersArrayInterface,
} from "../interfaces/index";

@Component({
  components: {
    SearchList,
  },
})
export default class HomePage extends Vue {
  target = "repositories";
  querySearch = "";
  sort = "stars";
  order = "desc";
  per_page = 10;
  page = 1;
  loading = false;
  totalCount = -1;
  usersArray: usersArrayInterface[] = [];
  reposArray: reposArray[] = [];

  clearSearch(): void {
    this.target = "repositories";
    this.querySearch = "";
    this.sort = "stars";
    this.order = "desc";
    this.per_page = 10;
    this.page = 1;
  }

  async searchForData(event: Event): Promise<void> {
    if (event) {
      event.preventDefault();
    }
    this.reposArray = [];
    this.usersArray = [];
    this.loading = true;
    if (this.target === "repositories") {
      const requestRepos = await axios.get<Data>(
        `https://api.github.com/search/repositories?sort=${this.sort}&per_page=${this.per_page}&page=${this.page}&order=${this.order}&q=${this.querySearch}`
      );
      this.totalCount = requestRepos.data.total_count;
      if (requestRepos.status === 200) {
        this.loading = false;
        requestRepos.data.items.forEach((repo: Items) => {
          let commitUrl: string = repo.commits_url;
          let commitsArray: string[] = [];
          let contributorsArray: contributorsTypes[] = [];
          let commitsList: string = commitUrl.slice(0, commitUrl.length - 6);
          axios
            .get(commitsList)
            .then((res) => {
              res.data.forEach((commit: Commits) => {
                commitsArray.push(commit.commit.message);
              });
            })
            .catch(() => {
              commitsArray = [];
            });
          axios
            .get(repo.contributors_url)
            .then((res) => {
              res.data.forEach((contributor: contributorObject) => {
                contributorsArray.push({
                  contributorName: contributor.login,
                  contributorAvatar: contributor.avatar_url,
                });
              });
            })
            .catch(() => {
              contributorsArray = [];
            });
          this.reposArray.push({
            name: repo.name,
            commits: commitsArray,
            contributors: contributorsArray,
          });
        });
      }
    } else {
      const requestUsers = await axios.get<Data>(
        `https://api.github.com/search/users?sort=${this.sort}&per_page=${this.per_page}&page=${this.page}&order=${this.order}&q=${this.querySearch}`
      );
      this.totalCount = requestUsers.data.total_count;

      if (requestUsers.status === 200) {
        this.loading = false;
        requestUsers.data.items.forEach((user: usersInterface) => {
          axios
            .get(user.url)
            .then((res) => {
              let userProfile = res.data;
              this.usersArray.push({
                userProfile,
              });
            })
            .catch(() => {
              this.usersArray = [];
            });
        });
      }
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
  color: #ffff;
}

.searchInput::placeholder {
  color: #ffff;
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
  font-size: 13px;
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
  width: 15%;
  display: flex;
  flex-direction: column;
}
.queryElement select,
.queryElement input {
  background-color: #cccccc;
}

.queryLabel {
  font-size: 13px;
}

.controlPanelWrap {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.resultsCount {
  font-size: 14px;
  color: #000;
}
.buttonsWrap {
  display: flex;
}

.resetButton {
  margin-right: 15px;
  border: 0;
  font-size: 13px;
  text-transform: uppercase;
  background: transparent;
  color: #000;
  font-weight: bold;
  cursor: pointer;
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
  font-size: 13px;
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
