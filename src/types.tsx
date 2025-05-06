export type CardType = {
  id: string;
  title: string;
};

export type ColumnType = {
  id: string;
  title: string;
  cards: CardType[];
};

export type BoardType = {
  id: string;
  name: string;
  columns: ColumnType[];
};
