import Vue from 'vue';
import Vuex from 'vuex';
import {
  Items,
  Commits,
  contributorsTypes,
  contributorObject,
  reposArray,
  usersInterface,
  usersArrayInterface,
} from '../interfaces/index';
import { axiosInstance } from '../api';

Vue.use(Vuex);

const commitsApiCall = (repoName: string, commitsArray: string[]) => {
  axiosInstance
    .get(`/repos/${repoName}/commits`)
    .then((res) => {
      res.data.forEach((commit: Commits) => {
        commitsArray.push(commit.commit.message);
      });
    })
    .catch(() => {
      commitsArray = [];
    });
};
const contributorsApiCall = (
  repoName: string,
  contributorsArray: contributorsTypes[]
) => {
  axiosInstance
    .get(`/repos/${repoName}/contributors`)
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
};

export default new Vuex.Store({
  state: {
    reposArray: [],
    usersArray: [],
    user: {},
    savedUsers: [],
    currentPage: 1,
    totalCount: -1,
    isLoading: false,
    isUserLoading: false,
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
      state.user = payload;
    },
    addNewUser(state, payload) {
      state.savedUsers.push(payload);
    },
  },
  actions: {
    fetchUser(state, username) {
      if (state.getters.getUser.login == username) return;
      const savedUser = this.state.savedUsers.find(
        (user) => user.login == username
      );
      if (savedUser) {
        state.commit('setCurrentUser', savedUser);
        return;
      }

      this.state.isUserLoading = true;

      axiosInstance
        .get(`/users/${username}`)
        .then((res) => {
          state.commit('setCurrentUser', res.data);
          state.commit('addNewUser', res.data);
          this.state.isUserLoading = false;
        })
        .catch((error) => {
          state.commit('setCurrentUser', {});
          this.state.isUserLoading = false;
          this.state.isError = true;
          this.state.errorMessage = error.response.data.message;
        });
    },
    searchForData(state, formData) {
      if (formData.name == null) return;

      this.state.isError = false;
      this.state.isLoading = true;
      state.commit('setCurrentUsers', []);
      state.commit('setCurrentRepos', []);

      let reposPayload: reposArray[] = [];
      let usersPayload: usersArrayInterface[] = [];

      if (formData.target === 'repositories') {
        axiosInstance
          .get(
            `/search/repositories?sort=${formData.sort}&per_page=${formData.per_page}&page=${formData.page}&order=${formData.order}&q=${formData.name}`
          )
          .then((res) => {
            if (res.data.total_count == 0) state.commit('setCurrentRepos', []);

            this.state.totalCount = res.data.total_count;
            this.state.isLoading = false;

            res.data.items.forEach((repo: Items) => {
              const commitsArray: string[] = [];
              const contributorsArray: contributorsTypes[] = [];

              commitsApiCall(repo.full_name, commitsArray);

              contributorsApiCall(repo.full_name, contributorsArray);

              reposPayload.push({
                name: repo.name,
                commits: commitsArray,
                contributors: contributorsArray,
              });
            });
          })
          .then(() => {
            state.commit('setCurrentRepos', reposPayload);
            setTimeout(() => {
              reposPayload = [];
            }, 500);
          })
          .catch((error) => {
            this.state.isLoading = false;
            this.state.isError = true;
            this.state.errorMessage = error.response.data.message;
            state.commit('setCurrentRepos', []);
            return;
          });
      } else {
        axiosInstance
          .get(
            `/search/users?sort=${formData.sort}&per_page=${formData.per_page}&page=${formData.page}&order=${formData.order}&q=${formData.name}`
          )
          .then((res) => {
            if (res.data.total_count == 0) state.commit('setCurrentUsers', []);

            this.state.totalCount = res.data.total_count;
            this.state.isLoading = false;

            res.data.items.forEach((user: usersInterface) => {
              axiosInstance
                .get(user.url)
                .then((res) => {
                  const userProfile = res.data;
                  usersPayload.push({
                    userProfile,
                  });
                })
                .catch(() => {
                  usersPayload = [];
                });
            });
          })
          .then(() => {
            state.commit('setCurrentUsers', usersPayload);
            setTimeout(() => {
              usersPayload = [];
            }, 500);
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
    getIsUserLoading: (state) => state.isUserLoading,
    getIsError: (state) => state.isError,
    getErrorMessage: (state) => state.errorMessage,
    getTotalCount: (state) => state.totalCount,
    getUser: (state) => state.user,
  },
});
