import { create } from 'zustand';

interface ICredential {
  name: string;
  email: string;
  accessLevel: number;
}

interface AuthState {
  credential: ICredential;
  csrfToken: string;
  setCSRFToken: (newToken: string) => void;
  getCSRFToken: () => string;
}

const authStore = create<AuthState>((set, get) => ({
  credential: {
    name: '',
    email: '',
    accessLevel: 0,
  },
  csrfToken: '',
  setCSRFToken: (newToken: string) => set({ csrfToken: newToken }),
  getCSRFToken: () => get().csrfToken,
  clearCSRFToken: () => set({ csrfToken: '' }),
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
