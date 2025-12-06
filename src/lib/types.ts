export type PecCard = {
  id: string;
  name: string;
  category: string;
  imageSrc: string;
  isFavorite?: boolean;
};

export type PhraseItem =
  | { type: 'card'; id: string; data: PecCard }
  | { type: 'text'; id: string; data: { text: string } };
