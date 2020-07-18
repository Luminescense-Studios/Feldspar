import { observable, decorate} from "mobx"

class LuminescenceStore {
    @observable loggedIn = false;
    username = "";
    accessToken = "";
    refreshToken = "";
}

decorate(LuminescenceStore, {
    loggedIn: observable,
    username: observable,
    accessToken: observable,
    refreshToken: observable,
})

var store = new LuminescenceStore()
export default store