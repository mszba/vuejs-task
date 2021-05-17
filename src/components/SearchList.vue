<template>
  <div class="wrapper">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <div v-if="loading">
      <v-icon class="loadingIcon" name="circle-notch" scale="2.5" spin />
    </div>

    <!-- <div
      class="repoContainer"
      v-for="(repo, index) in this.dataList"
      :key="index"
    >
      <div class="dataWrap">
        <span class="dataTitleLabel">Repository name:</span>
        <h3 class="dataTitle">{{ repo.name }}</h3>
      </div>
      <div class="dataWrap">
        <span class="dataTitleLabel">Commits list:</span>
        <h3 class="dataTitle">asdasd asda sdsad a commit</h3>
      </div>
      <div class="dataWrap">
        <span class="dataTitleLabel">Contributors list:</span>
        <h3 class="dataTitle">asdasda sdsa dasdas</h3>
      </div>
    </div> -->

    <div
      class="repoContainer"
      v-for="(repo, index) in this.dataList"
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

    <!-- <div class="repoContainer">
      <div class="userPresent">
        <div class="userAvatar" />
        <h3 class="userName">example Name</h3>
      </div>

      <div class="userInfoWrap">
        <span class="dataTitleLabel">Following:</span>
        <h3 class="dataTitle">repo name vue-react12</h3>
      </div>

      <div class="userInfoWrap">
        <span class="dataTitleLabel">Following:</span>
        <h3 class="dataTitle">repo name vue-react12</h3>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop({ default: [], type: Array, required: true }) dataList!: [];
  @Prop({ default: false, type: Boolean, required: true }) loading!: boolean;
  // contributorsList = [];
  // commitsList = [];

  mounted(): void {
    // if (this.dataList.length > 0) {
    //   this.contributorsList = this.dataList.contributors;
    //   this.commitsList = this.dataList.commits;
    //   console.log("contr", this.dataList);
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
.dataWrap {
  /* width: 28%; */
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
/* .dataElementTitle + .dataElementTitle {
  margin-right: 10px;
} */
.dataCommit {
  margin-left: 15px;
  font-size: 12px;
  list-style: none;
  /* font-weight: bold; */
}

.dataCommit::before {
  content: "\2022"; /* Add content: \2022 is the CSS Code/unicode for a bullet */
  color: #118655; /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 1em; /* Also needed for space (tweak if needed) */
  margin-left: -1em; /* Also needed for space (tweak if needed) */
}

.elementsList {
  display: flex;
  flex-wrap: wrap;
}

.commitsList {
  max-height: 200px;
  overflow-y: scroll;
}

.userPresent {
  display: flex;
  align-items: center;
}

.userAvatar {
  margin-right: 10px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: red;
}
.contributorAvatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.abc {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
</style>
