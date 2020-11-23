import {
  observable,
  action,
  computed
} from "mobx";

class LuminescenceStore {
  @observable loggedIn = false;
  @observable loggedInWithApp = "";
  @observable username = "";
  @observable accessToken = "";
  @observable refreshToken = "";
  @observable config = {};
  @observable loginModal = false;
  @observable logoutModal = false;
  @observable infoModal = false;
  @observable addClickListener = false;
  @observable saveFileModal = false;
  @observable loadFileModal = false;

  //LoggedIn---------------------------------------------
  @action setLoggedIn = (login) => {
    this.loggedIn = login
  }

  @computed get getLoggedIn() {
    return this.loggedIn
  }

  //LoggedInWithApp---------------------------------------------
  @action setLoggedInWithApp = (login) => {
    this.loggedInWithApp = login
  }

  @computed get getLoggedInWithApp() {
    return this.loggedInWithApp
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

  //Config--------------------------------------------
  @computed get getConfig() {
    return {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    };
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

  //InfoModal---------------------------------------------
  @action setInfoModal = (show) => {
    this.infoModal = show
  }

  @computed get showInfoModal() {
    return this.infoModal
  }

  //AddClickListener---------------------------------------------
  @action setClickListener = (bool) => {
    this.addClickListener = bool
  }

  @computed get getClickListener() {
    return this.addClickListener
  }

  //Save File Modal---------------------------------------------
  @action setSaveFileModal = (bool) => {
    this.saveFileModal = bool
  }

  @computed get showSaveFileModal() {
    return this.saveFileModal
  }

  //Load File Modal---------------------------------------------
  @action setLoadFileModal = (bool) => {
    this.loadFileModal = bool
  }

  @computed get showLoadFileModal() {
    return this.loadFileModal
  }

}

var store = new LuminescenceStore();
export default store;