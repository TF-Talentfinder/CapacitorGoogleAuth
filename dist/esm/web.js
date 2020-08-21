var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebPlugin } from '@capacitor/core';
// @ts-ignore
import config from '../../../../../apps/craftswerk/capacitor.config.json';
export class GoogleAuthWeb extends WebPlugin {
    constructor() {
        super({
            name: 'GoogleAuth',
            platforms: ['web'],
        });
        if (!this.webConfigured)
            return;
        this.gapiLoaded = new Promise((resolve) => {
            // HACK: Relying on window object, can't get property in gapi.load callback
            window.gapiResolve = resolve;
            this.initialize();
        });
        this.addUserChangeListener();
    }
    get webConfigured() {
        return document.getElementsByName('google-signin-client_id').length > 0;
    }
    initialize() {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.defer = true;
        script.async = true;
        script.onload = this.platformJsLoaded;
        script.src = 'https://apis.google.com/js/platform.js';
        head.appendChild(script);
    }
    platformJsLoaded() {
        gapi.load('auth2', () => {
            var _a;
            const clientConfig = {
                client_id: document.getElementsByName('google-signin-client_id')[0].content,
            };
            if (((_a = config.plugins.GoogleAuth) === null || _a === void 0 ? void 0 : _a.scopes) != null) {
                clientConfig.scope = config.plugins.GoogleAuth.scopes.join(' ');
            }
            gapi.auth2.init(clientConfig);
            window.gapiResolve();
        });
    }
    signIn() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const needsOfflineAccess = ((_b = (_a = config.plugins) === null || _a === void 0 ? void 0 : _a.GoogleAuth) === null || _b === void 0 ? void 0 : _b.serverClientId) != null;
            const serverAuthCode = needsOfflineAccess ? yield this.getServerAuthCode() : null;
            if (!needsOfflineAccess) {
                yield gapi.auth2.getAuthInstance().signIn();
            }
            const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
            if (needsOfflineAccess) {
                // HACK: AuthResponse is null if we don't do this when using grantOfflineAccess
                yield googleUser.reloadAuthResponse();
            }
            const user = this.getUserFrom(googleUser);
            user.serverAuthCode = serverAuthCode;
            return user;
        });
    }
    getServerAuthCode() {
        return __awaiter(this, void 0, void 0, function* () {
            const offlineAccessResponse = yield gapi.auth2.getAuthInstance().grantOfflineAccess();
            return offlineAccessResponse.code;
        });
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const authResponse = yield gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
            return {
                accessToken: authResponse.access_token,
                idToken: authResponse.id_token,
            };
        });
    }
    signOut() {
        return __awaiter(this, void 0, void 0, function* () {
            return gapi.auth2.getAuthInstance().signOut();
        });
    }
    addUserChangeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.gapiLoaded;
            gapi.auth2.getAuthInstance().currentUser.listen((googleUser) => {
                this.notifyListeners('userChange', googleUser.isSignedIn() ? this.getUserFrom(googleUser) : null);
            });
        });
    }
    getUserFrom(googleUser) {
        const user = {};
        const profile = googleUser.getBasicProfile();
        user.email = profile.getEmail();
        user.familyName = profile.getFamilyName();
        user.givenName = profile.getGivenName();
        user.id = profile.getId();
        user.imageUrl = profile.getImageUrl();
        user.name = profile.getName();
        const authResponse = googleUser.getAuthResponse(true);
        user.authentication = {
            accessToken: authResponse.access_token,
            idToken: authResponse.id_token,
        };
        return user;
    }
}
const GoogleAuth = new GoogleAuthWeb();
export { GoogleAuth };
import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(GoogleAuth);
//# sourceMappingURL=web.js.map