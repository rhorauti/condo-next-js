export interface IAddress {
  idAddress: number;
  postalCode: string | null;
  type: string | null;
  street: string | null;
  number: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  blockType: string | null;
  block: string | null;
  lotType: string | null;
  lot: string | null;
}

export interface IResponseViaCep {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}
