import { USER_ROLES } from '@/enum/role.enum';

export const userDetailsMock = {
  idUser: 0,
  createdAt: '2025-05-10',
  name: 'Rafael Horauti',
  birthDate: '',
  email: 'rafafel_h44@hotmail.com',
  phone: '5511941221211',
  mediaObject: {
    idMedia: 4,
    mediaUrl: 'https://github.com/shadcn.png',
  },
  fallbackName: 'RH',
  isActive: true,
  isEmailConfirmed: false,
  isWhatsapp: true,
  role: USER_ROLES.USER,
  address: {
    idAddress: 0,
    postalCode: '18074-761',
    type: 'HOUSE',
    street: 'Rua Geraldo Pachedo Valente',
    number: '452',
    district: 'Horto Florestal',
    city: 'Sorocaba',
    state: 'SP',
    blockType: 'Quadra',
    block: '10',
    lotType: 'Lote',
    lot: '26',
  },
};
