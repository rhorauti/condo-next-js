import { create } from 'zustand';

interface ICredential {
  name: string;
  email: string;
  fallbackName: string;
  isActive: boolean;
  accessLevel: number;
  photoUrl: string;
}

interface AuthState {
  credential: ICredential;
  isDarkMode: boolean;
  setCredential: (credential: ICredential) => void;
  getCredential: () => void;
  clearCredential: () => void;
  setFallbackName: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  credential: {
    name: 'Rafael Kazuo Horauti',
    email: '',
    fallbackName: '',
    isActive: false,
    accessLevel: 0,
    photoUrl: 'https://github.com/shadcn.png',
  },
  isDarkMode: true,
  setCredential: (credential: ICredential) =>
    set({
      credential: {
        name: credential.name,
        email: credential.email,
        fallbackName: credential.fallbackName,
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
        fallbackName: '',
        isActive: false,
        accessLevel: 0,
        photoUrl: '',
      },
    }),
  setFallbackName: () => {
    const { credential } = get();
    const trimmed = credential.name?.trim() || '';

    if (!trimmed) {
      set({
        credential: {
          ...credential,
          fallbackName: '',
        },
      });
      return;
    }

    const parts = trimmed.split(' ').filter(Boolean);

    let fallback = '';
    if (parts.length === 1) {
      fallback = parts[0][0]?.toUpperCase() ?? '';
    } else {
      const first = parts[0][0] ?? '';
      const last = parts[parts.length - 1][0] ?? '';
      fallback = (first + last).toUpperCase();
    }

    set({
      credential: {
        ...credential,
        fallbackName: fallback,
      },
    });
  },
}));

export default useAuthStore;
