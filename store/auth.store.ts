import { create } from 'zustand';

interface ICredential {
  name: string;
  email: string;
  accessLevel: number;
}

interface AuthState {
  credential: ICredential;
}

const authStore = create<AuthState>((set, get) => ({
  credential: {
    name: '',
    email: '',
    accessLevel: 0,
  },
  setCredential: (credential: ICredential) =>
    set({
      credential: {
        name: credential.name,
        email: credential.email,
        accessLevel: credential.accessLevel,
      },
    }),
  getCredential: () => get().credential,
  clearCredential: () =>
    set({
      credential: {
        name: '',
        email: '',
        accessLevel: 0,
      },
    }),
}));

export default authStore;
