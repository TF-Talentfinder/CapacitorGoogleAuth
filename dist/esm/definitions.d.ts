import { User } from './user';
declare module '@capacitor/core' {
    interface PluginRegistry {
        GoogleAuth: GoogleAuthPlugin;
    }
}
export interface GoogleAuthPlugin {
    signIn(): Promise<User>;
    signOut(): Promise<unknown>;
}
