import { IRole, IUserDetail } from '@/interfaces/user.interface';
import { create } from 'zustand';

interface AuthState {
  credential: IUserDetail;
  onSetCredential: (credential: IUserDetail) => void;
  onGetCredential: () => void;
  onClearCredential: () => void;
  onSetFallbackName: () => void;
  onShowProfile: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  credential: {
    idUser: 0,
    name: '',
    email: '',
    fallbackName: '',
    createdAt: '',
    birthDate: '',
    isActive: false,
  },
  isDarkMode: true,
  onSetCredential: (credential: IUserDetail) =>
    set({
      credential: {
        idUser: credential.idUser,
        name: credential.name,
        email: credential.email,
        fallbackName: credential.fallbackName,
        birthDate: credential.birthDate,
        createdAt: credential.createdAt,
        isActive: credential.isActive,
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
        createdAt: '',
        birthDate: '',
        isActive: false,
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

export default useAuthStore;
