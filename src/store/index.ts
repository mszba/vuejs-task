import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import {
  Data,
  Items,
  Commits,
  contributorsTypes,
  contributorObject,
  reposArray,
  usersInterface,
  usersArrayInterface,
} from '../interfaces/index';

Vue.use(Vuex);

const accessHeader = 'token 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';

export default new Vuex.Store({
  state: {
    reposArray: [],
    usersArray: [],
    userObject: {},
    currentPage: 1,
    totalCount: -1,
    isLoading: false,
    isError: false,
    errorMessage: '',
  },
  mutations: {
    setCurrentRepos(state, payload) {
      state.reposArray = payload;
    },
    setCurrentUsers(state, payload) {
      state.usersArray = payload;
    },
    setCurrentPage(state, payload) {
      state.currentPage = payload;
    },
    setCurrentUser(state, payload) {
      state.userObject = payload;
    },
  },
  actions: {
    fetchUser(state, username) {
      if (state.getters.getUserObject.login == username) {
        return;
      }

      this.state.isLoading = true;

      axios
        .get(`https://api.github.com/users/${username}`)
        .then((res) => {
          state.commit('setCurrentUser', res.data);
          this.state.isLoading = false;
        })
        .catch((error) => {
          state.commit('setCurrentUser', {});
          this.state.isLoading = false;
          this.state.isError = true;
          this.state.errorMessage = error.response.data.message;
        });
    },
    searchForData(state, formData) {
      if (formData.name == null) return;

      this.state.isError = false;
      this.state.isLoading = true;

      const reposPayload: reposArray[] = [];
      let usersPayload: usersArrayInterface[] = [];

      if (formData.target === 'repositories') {
        state.commit('setCurrentUsers', []);
        axios
          .get(
            `https://api.github.com/search/repositories?sort=${formData.sort}&per_page=${formData.per_page}&page=${formData.page}&order=${formData.order}&q=${formData.name}`,
            {
              headers: {
                Authorization: accessHeader,
              },
            }
          )
          .then((res) => {
            this.state.totalCount = res.data.total_count;
            this.state.isLoading = false;
            res.data.items.forEach((repo: Items) => {
              const commitUrl: string = repo.commits_url;
              let commitsArray: string[] = [];
              let contributorsArray: contributorsTypes[] = [];
              const commitsList: string = commitUrl.slice(
                0,
                commitUrl.length - 6
              );
              axios
                .get(commitsList, {
                  headers: {
                    Authorization: accessHeader,
                  },
                })
                .then((res) => {
                  res.data.forEach((commit: Commits) => {
                    commitsArray.push(commit.commit.message);
                  });
                })
                .catch(() => {
                  commitsArray = [];
                });
              axios
                .get(repo.contributors_url, {
                  headers: {
                    Authorization: accessHeader,
                  },
                })
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
              reposPayload.push({
                name: repo.name,
                commits: commitsArray,
                contributors: contributorsArray,
              });
              state.commit('setCurrentRepos', reposPayload);
            });
          })
          .catch((error) => {
            this.state.isLoading = false;
            this.state.isError = true;
            this.state.errorMessage = error.response.data.message;
            state.commit('setCurrentRepos', []);
            return;
          });
      } else {
        state.commit('setCurrentRepos', []);

        axios
          .get(
            `https://api.github.com/search/users?sort=${formData.sort}&per_page=${formData.per_page}&page=${formData.page}&order=${formData.order}&q=${formData.name}`,
            {
              headers: {
                Authorization: accessHeader,
              },
            }
          )
          .then((res) => {
            this.state.totalCount = res.data.total_count;
            this.state.isLoading = false;
            res.data.items.forEach((user: usersInterface) => {
              axios
                .get(user.url, {
                  headers: {
                    Authorization: accessHeader,
                  },
                })
                .then((res) => {
                  const userProfile = res.data;
                  usersPayload.push({
                    userProfile,
                  });
                  state.commit('setCurrentUsers', usersPayload);
                })
                .catch(() => {
                  usersPayload = [];
                });
            });
          })
          .catch((error) => {
            this.state.isLoading = false;
            this.state.isError = true;
            this.state.errorMessage = error.response.data.message;
            state.commit('setCurrentUsers', []);
            return;
          });
      }
    },
  },
  modules: {},
  getters: {
    getCurrentRepos: (state) => state.reposArray,
    getCurrentUsers: (state) => state.usersArray,
    getIsLoading: (state) => state.isLoading,
    getIsError: (state) => state.isError,
    getErrorMessage: (state) => state.errorMessage,
    getTotalCount: (state) => state.totalCount,
    getUserObject: (state) => state.userObject,
  },
});
