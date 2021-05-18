<template>
  <div class="wrapper">
    <div v-if="loading">
      <v-icon class="loadingIcon" name="circle-notch" scale="2.5" spin />
    </div>
    <div v-if="totalCount === 0">
      <span class="noResults">no results</span>
    </div>
    <div
      class="repoContainer"
      v-for="(repo, index) in this.reposList"
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
          >
            <router-link :to="`/user/${contributor.contributorName}`">
              <img
                class="contributorAvatar"
                :src="`${contributor.contributorAvatar}`"
                :alt="`${contributor.contributorName}`"
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
            {{ commit }}
          </li>
        </ul>
        <span v-if="repo.commits.length === 0">none</span>
      </div>
    </div>

    <a
      class="userContainer"
      v-for="(user, index) in this.usersList"
      :key="index"
      :href="`/user/${user.userProfile.login}`"
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
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop({ default: [], type: Array, required: true }) reposList!: [];
  @Prop({ default: [], type: Array, required: true }) usersList!: [];
  @Prop({ default: false, type: Boolean, required: true }) loading!: boolean;
  @Prop({ default: false, type: Number, required: true }) totalCount!: number;
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
}
.userContainer {
  padding: 15px 30px;
  margin-bottom: 5px;
  width: 100%;
  min-height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  border-radius: 12px;
  border: 1px solid rgb(64 60 67 / 16%);
  box-shadow: 0 2px 10px 1px rgb(64 60 67 / 16%);
  text-decoration: none;
  color: #000;
  transition: all 0.3s ease;
}
.userContainer:hover {
  box-shadow: 0 2px 8px 1px rgb(64 60 67 / 24%);
  border-color: rgba(223, 225, 229, 0);
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
  font-size: 12px;
  list-style: none;
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
