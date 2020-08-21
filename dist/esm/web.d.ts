import { WebPlugin } from '@capacitor/core';
import { GoogleAuthPlugin } from './definitions';
import { User, Authentication } from './user';
export declare class GoogleAuthWeb extends WebPlugin implements GoogleAuthPlugin {
    gapiLoaded: Promise<void>;
    get webConfigured(): boolean;
    constructor();
    initialize(): void;
    platformJsLoaded(): void;
    signIn(): Promise<User>;
    private getServerAuthCode;
    refresh(): Promise<Authentication>;
    signOut(): Promise<any>;
    private addUserChangeListener;
    private getUserFrom;
}
declare const GoogleAuth: GoogleAuthWeb;
export { GoogleAuth };
