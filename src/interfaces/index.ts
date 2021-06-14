export interface Data {
  data: object;
  total_count: number;
  items: [];
  status: number;
}

export interface Items {
  name: string;
  commits_url: string;
  contributors_url: string;
}

export interface Commits {
  commit: {
    [message: string]: string;
  };
}

export interface contributorsTypes {
  contributorName: string;
  contributorAvatar: string;
}

export interface contributorObject {
  login: string;
  avatar_url: string;
}

export interface reposArray {
  name: string;
  commits: string[];
  contributors: contributorsTypes[];
}

export interface usersInterface {
  url: string;
}

export interface usersArrayInterface {
  userProfile: object;
}
