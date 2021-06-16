<template>
  <div class="wrapper">
    <div v-if="isLoading">
      <v-icon class="loadingIcon" name="circle-notch" scale="2.5" spin />
    </div>
    <div v-if="totalCount === 0">
      <span class="noResults">no results</span>
    </div>
    <div v-if="isError">
      <span class="noResults">{{ errorMessage }}</span>
    </div>
    <div class="contentWrap" v-if="!isLoading">
      <div
        class="repoContainer"
        v-for="(repo, index) in currentRepos"
        :key="index"
      >
        <div class="dataWrap">
          <span class="dataTitleLabel">Repository name:</span>
          <h3 class="dataTitle">{{ repo.name }}</h3>
        </div>

        <div class="dataWrap">
          <span class="dataTitleLabel">Contributors:</span>
          <ul class="elementsList">
            <li
              v-for="(contributor, index) in repo.contributors"
              :key="index"
              class="dataElementTitle"
              @click="dispatchUser(contributor.contributorName)"
            >
              <router-link :to="`/user/${contributor.contributorName}`">
                <img
                  class="contributorAvatar"
                  :src="`${contributor.contributorAvatar}`"
                  :alt="`${contributor.contributorName}`"
                  loading="lazy"
                />
              </router-link>
            </li>
          </ul>
          <span v-if="repo.contributors.length === 0">none</span>
        </div>
        <div class="dataWrap">
          <span class="dataTitleLabel">Commits:</span>

          <ul class="commitsList">
            <li
              v-for="(commit, index) in repo.commits"
              :key="index"
              class="dataCommit"
            >
              <p class="commitMessage">{{ commit }}</p>
            </li>
          </ul>
          <span v-if="repo.commits.length === 0">none</span>
        </div>
      </div>

      <div
        class="userContainer"
        v-for="(user, index) in currentUsers"
        :key="index"
        @click="dispatchUser(user.userProfile.login)"
      >
        <router-link
          :to="`/user/${user.userProfile.login}`"
          class="userContainer-wrap"
        >
          <div class="userPresent">
            <img
              class="userAvatar"
              :src="`${user.userProfile.avatar_url}`"
              :alt="`${user.userProfile.login}`"
            />
            <h3 class="userName">{{ user.userProfile.login }}</h3>
          </div>

          <div class="userInfoContainer">
            <div class="userInfoWrap">
              <span class="dataTitleLabel">Followers:</span>
              <h3 class="dataTitle">{{ user.userProfile.followers }}</h3>
            </div>

            <div class="userInfoWrap">
              <span class="dataTitleLabel">Following:</span>
              <h3 class="dataTitle">{{ user.userProfile.following }}</h3>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class SearchList extends Vue {
  get currentRepos(): Array {
    return this.$store.getters.getCurrentRepos;
  }
  get currentUsers(): Array {
    return this.$store.getters.getCurrentUsers;
  }
  get isLoading(): boolean {
    return this.$store.getters.getIsLoading;
  }
  get totalCount(): number {
    return this.$store.getters.getTotalCount;
  }
  get isError(): boolean {
    return this.$store.getters.getIsError;
  }
  get errorMessage(): boolean {
    return this.$store.getters.getErrorMessage;
  }

  dispatchUser(username: string): void {
    this.$store.dispatch("fetchUser", username);
  }
}
</script>

<style scoped>
.wrapper {
  margin-top: 45px;
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.loadingIcon {
  color: #097e4d;
}
.contentWrap {
  width: 100%;
}

.repoContainer {
  padding: 15px 30px;
  margin-bottom: 5px;
  width: 100%;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  border-radius: 12px;
  border: 1px solid rgb(64 60 67 / 16%);
  box-shadow: 0 2px 10px 1px rgb(64 60 67 / 16%);
  overflow: scroll;
}
.userContainer {
  margin-bottom: 5px;
  width: 100%;
  min-height: 100px;
  border-radius: 12px;
  border: 1px solid rgb(64 60 67 / 16%);
  box-shadow: 0 2px 10px 1px rgb(64 60 67 / 16%);
  transition: all 0.3s ease;
}
.userContainer:hover {
  box-shadow: 0 2px 8px 1px rgb(64 60 67 / 24%);
  border-color: rgba(223, 225, 229, 0);
}
.userContainer-wrap {
  padding: 15px 30px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  color: #000;
  text-decoration: none;
}
.userInfoWrap {
  padding: 0 40px;
}

.dataWrap {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}
.dataTitleLabel {
  margin-bottom: 5px;
  font-size: 15px;
  font-weight: bold;
}
.dataTitle {
  font-size: 13px;
  font-weight: normal;
  color: #118655;
}
.dataElementTitle {
  margin-right: 10px;
  cursor: pointer;
  list-style: none;
}

.dataCommit {
  margin-left: 15px;
  display: flex;
  align-items: flex-start;
  font-size: 12px;
  list-style: none;
  white-space: pre-wrap;
}

.commitMessage {
}

.dataCommit::before {
  content: "\2022";
  color: #118655;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

.elementsList {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.commitsList {
  max-height: 200px;
  overflow: scroll;
}

.userInfoContainer {
  padding: 0 35px;
  display: flex;
}

.userPresent {
  display: flex;
  align-items: center;
  width: 200px;
}

.userAvatar {
  margin-right: 10px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.contributorAvatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.userAvatar {
  margin-right: 15px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

.noResults {
  font-size: 30px;
  font-weight: bold;
}

@media screen and (max-width: 768px) {
  .userInfoContainer {
    padding: 0 15px;
  }
  .userInfoWrap {
    padding: 0 20px;
  }
}
@media screen and (max-width: 570px) {
  .userContainer {
    flex-direction: column;
  }
  .userInfoContainer {
    margin-top: 10px;
  }
}
</style>
