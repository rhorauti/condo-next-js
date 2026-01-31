export interface IAdminUsersPageInfo {
  condo: ICondoInfo;
  users: IAdminUser[];
}

export interface ICondoInfo {
  idCondo: number;
  name: string;
  blockUnit: string;
  lotUnit: string;
}

export interface IAdminUser {
  idUser: number;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  fallbackName: string;
  isActive: boolean;
  isEmailConfirmed: boolean;
  accessLevel: number;
  address: {
    idAddress: number;
    block: string;
    lot: string;
  };
}
