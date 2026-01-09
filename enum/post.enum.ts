export enum POST_TYPE {
  QUESTION_FEEDBACK = 0,
  BULLETIN_BOARD = 1,
  COMPLAINS = 2,
  OTHERS = 3,
}

export const translatePostToString = (post: POST_TYPE): string => {
  switch (post) {
    case 0: {
      return 'Dúvidas & Sugestões';
    }
    case 1: {
      return 'Avisos';
    }
    case 2: {
      return 'Reclamações';
    }
    case 3: {
      return 'Outros';
    }
  }
  return 'Outros';
};

export const translatePostToNumber = (post: string): POST_TYPE => {
  switch (post) {
    case 'Dúvidas & Sugestões': {
      return 0;
    }
    case 'Avisos': {
      return 1;
    }
    case 'Reclamações': {
      return 2;
    }
    case 'Outros': {
      return 3;
    }
  }
  return 3;
};
