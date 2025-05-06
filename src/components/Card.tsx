import React from 'react';
import type { CardType } from '../types';
import DeleteIcon from '../assets/delete.png';


type Props = {
  card: CardType;
  columnId: string;
  handleDeleteCard: (cardId: string, columnId: string) => void;
};

const Card = ({ card, columnId, handleDeleteCard }: Props) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('card-id', card.id);
    e.dataTransfer.setData('from-column', columnId);
  };

  const handleDelete = () => {
    handleDeleteCard(card.id, columnId);
  };

  return (
    <div
      className="card"
      draggable
      onDragStart={handleDragStart}

    >
      <div className="card-content">
        <div>{card.title}</div>
        <button className="delete-card-btn" onClick={handleDelete}>
<img src={DeleteIcon}  width={'20px'}/>        </button>
      </div>
    </div>
  );
};

export default Card;
