import {
  observable,
  action,
  computed
} from "mobx";

class LuminescenceStore {
  @observable loggedIn = false;
  @observable username = "";
  @observable accessToken = "";
  @observable refreshToken = "";
  @observable loginModal = false;
  @observable logoutModal = false;
  @observable addClickListener = false;

  //LoggedIn---------------------------------------------
  @action setLoggedIn = (login) => {
    this.loggedIn = login
  }

  @computed get getLoggedIn() {
    return this.loggedIn
  }

  //Username--------------------------------------------
  @action setUsername = (name) => {
    this.username = name
  }

  @computed get getUsername() {
    return this.username
  }

  //AccessToken--------------------------------------------
  @action setAccessToken = (accessToken) => {
    this.accessToken = accessToken
  }

  @computed get getAccessToken() {
    return this.accessToken
  }

  //RefreshToken--------------------------------------------
  @action setRefreshToken = (token) => {
    this.refreshToken = token
  }

  @computed get getRefreshToken() {
    return this.refreshToken
  }

  //LoginModal---------------------------------------------
  @action setLoginModal = (show) => {
    this.loginModal = show
  }

  @computed get showLoginModal() {
    return this.loginModal
  }

  //LogoutModal---------------------------------------------
  @action setLogoutModal = (show) => {
    this.logoutModal = show
  }

  @computed get showLogoutModal() {
    return this.logoutModal
  }

  //AddClickListener---------------------------------------------
  @action setClickListener = (bool) => {
    this.addClickListener = bool
  }

  @computed get getClickListener() {
    return this.addClickListener
  }
}

var store = new LuminescenceStore();
export default store;