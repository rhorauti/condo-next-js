import { create } from 'zustand';

interface ICredential {
  name: string;
  email: string;
  isActive: boolean;
  accessLevel: number;
  photoUrl: string;
}

interface AuthState {
  credential: ICredential;
  setCredential: (credential: ICredential) => void;
  getCredential: () => void;
  clearCredential: () => void;
}

const authStore = create<AuthState>((set, get) => ({
  credential: {
    name: '',
    email: '',
    isActive: false,
    accessLevel: 0,
    photoUrl: '',
  },
  setCredential: (credential: ICredential) =>
    set({
      credential: {
        name: credential.name,
        email: credential.email,
        isActive: false,
        accessLevel: credential.accessLevel,
        photoUrl: credential.photoUrl,
      },
    }),
  getCredential: () => get().credential,
  clearCredential: () =>
    set({
      credential: {
        name: '',
        email: '',
        isActive: false,
        accessLevel: 0,
        photoUrl: '',
      },
    }),
}));

export default authStore;
