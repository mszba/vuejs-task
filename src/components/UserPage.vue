<template>
  <div class="wrapper">
    <div class="basicInfoWrap">
      <img
        class="userAvatar"
        :src="`${userObject.avatar_url}`"
        :alt="`${userObject.login} - avatar`"
      />
      <h1 class="userName">
        {{ userObject.login }}
      </h1>
      <p v-if="userObject.bio" class="userBio">{{ userObject.bio }}</p>
      <span class="userLocation">
        <v-icon class="markerLocation" name="map-marker-alt" scale="2" />{{
          userObject.location ? userObject.location : "N/A"
        }}
      </span>
      <div class="socialItemsWrap">
        <v-icon class="usersIcon" name="user-friends" scale="2" />
        <div class="socialElement">
          Followers:
          {{ userObject.followers }}
        </div>
        |
        <div class="socialElement">Following: {{ userObject.following }}</div>
      </div>
      <div class="moreInfoWrap">
        <div class="infoElement">
          Created at: {{ userObject.created_at | moment("DD-MM-YYYY") }}
        </div>
        <div class="infoElement">
          Updated at: {{ userObject.updated_at | moment("DD-MM-YYYY") }}
        </div>
        <div class="infoElement">
          Repositories: {{ userObject.public_repos }}
        </div>
        <div class="infoElement linkElement">
          <a :href="`${userObject.html_url}`" class="linkHref">
            <v-icon class="linkIcon" name="link" scale="1.2" />
            /{{ userObject.login }}
          </a>
        </div>
        <div class="infoElement linkElement">
          <v-icon class="linkIcon" name="building" scale="1.2" />
          {{ userObject.company ? userObject.company : "N/A" }}
        </div>
        <div class="infoElement linkElement">
          <a :href="`${userObject.blog}`" class="linkHref">
            <v-icon class="linkIcon" name="blog" scale="1.2" />
            {{ userObject.blog ? "blog" : "N/A" }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";

@Component
export default class UserPage extends Vue {
  userObject = {};
  mounted(): void {
    axios
      .get(`https://api.github.com/users/${this.$route.params.id}`)
      .then((res) => {
        this.userObject = res.data;
      });
  }
}
</script>

<style scoped>
.wrapper {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.userAvatar {
  margin-bottom: 25px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
}
.basicInfoWrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.userName {
  margin-bottom: 10px;
}
.userBio {
  margin-bottom: 10px;
  text-align: center;
}
.userLocation {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.markerLocation {
  margin-right: 7px;
  color: #097e4d;
}
.socialItemsWrap {
  margin-bottom: 25px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  border-radius: 12px;
  border: 1px solid rgb(64 60 67 / 16%);
  box-shadow: 0 2px 10px 1px rgb(64 60 67 / 16%);
}
.usersIcon {
  margin-right: 5px;
  color: #097e4d;
}
.socialElement:first-of-type {
  margin-right: 5px;
}
.socialElement:nth-of-type(2) {
  margin-left: 5px;
}
.moreInfoWrap {
  display: grid;
  align-items: baseline;
  justify-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 30px 30px;
}
.infoElement {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid rgb(64 60 67 / 16%);
  box-shadow: 0 2px 10px 1px rgb(64 60 67 / 16%);
}
.infoElement {
  font-size: 15px;
}
.linkIcon {
  color: #097e4d;
}
.linkHref {
  text-decoration: none;
  color: #000;
}
@media screen and (max-width: 768px) {
  .moreInfoWrap {
    grid-template-columns: 1fr 1fr;
  }
}
@media screen and (max-width: 480px) {
  .moreInfoWrap {
    grid-template-columns: 1fr;
  }
}
</style>