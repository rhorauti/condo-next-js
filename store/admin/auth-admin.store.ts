import { create } from 'zustand';

interface ICredential {
  idUser: number;
  name: string;
  email: string;
  fallbackName: string;
  isActive: boolean;
  accessLevel: number;
  photoUrl: string;
}

interface AuthAdminState {
  credential: ICredential;
  onSetCredential: (credential: ICredential) => void;
  onGetCredential: () => void;
  onClearCredential: () => void;
  onSetFallbackName: () => void;
  onShowProfile: () => void;
}

const useAuthAdminStore = create<AuthAdminState>((set, get) => ({
  credential: {
    idUser: 1,
    name: 'Rafael Kazuo Horauti',
    email: '',
    fallbackName: '',
    isActive: false,
    accessLevel: 0,
    photoUrl: 'https://github.com/shadcn.png',
  },
  isDarkMode: true,
  onSetCredential: (credential: ICredential) =>
    set({
      credential: {
        idUser: credential.idUser,
        name: credential.name,
        email: credential.email,
        fallbackName: credential.fallbackName,
        isActive: false,
        accessLevel: credential.accessLevel,
        photoUrl: credential.photoUrl,
      },
    }),
  onGetCredential: () => get().credential,
  onClearCredential: () =>
    set({
      credential: {
        idUser: 0,
        name: '',
        email: '',
        fallbackName: '',
        isActive: false,
        accessLevel: 0,
        photoUrl: '',
      },
    }),
  onSetFallbackName: () => {
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
  onShowProfile: () => {},
}));

export default useAuthAdminStore;
