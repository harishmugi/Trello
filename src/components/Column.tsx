import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { ColumnType, CardType } from '../types';
import Card from './Card';

type Props = {
  column: ColumnType;
  columns: ColumnType[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
  updateColumn: (columnId: string, updatedColumn: ColumnType) => void;
};

const BATCH_SIZE = 10;

const Column = ({ column, columns, setColumns, updateColumn }: Props) => {
  const [visibleCards, setVisibleCards] = useState<CardType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Detect when column is visible in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  // Load/reset visible cards when column.cards change
  useEffect(() => {
    if (column.cards.length === 0) {
      setVisibleCards([]);
      setHasMore(false);
    } else {
      const initial = column.cards.slice(0, BATCH_SIZE);
      setVisibleCards(initial);
      setHasMore(column.cards.length > BATCH_SIZE);
    }
  }, [column.cards]);

  const fetchMoreCards = () => {
    const currentLength = visibleCards.length;
    const more = column.cards.slice(currentLength, currentLength + BATCH_SIZE);

    setVisibleCards((prev) => {
      const updated = [...prev, ...more];
      if (updated.length >= column.cards.length) {
        setHasMore(false);
      }
      return updated;
    });
  };

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return;

    const newCard: CardType = {
      id: `${column.id}-${Date.now()}`,
      title: newCardTitle,
    };

    const updatedColumn: ColumnType = {
      ...column,
      cards: [...column.cards, newCard],
    };

    updateColumn(column.id, updatedColumn);
    setNewCardTitle('');
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedColumn = {
      ...column,
      cards: column.cards.filter((card) => card.id !== cardId),
    };
    updateColumn(column.id, updatedColumn);
  };

  const handleDeleteColumn = () => {
    setColumns(columns.filter((col) => col.id !== column.id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('card-id');
    const fromColumnId = e.dataTransfer.getData('from-column');

    if (!cardId || !fromColumnId || fromColumnId === column.id) return;

    const fromColumn = columns.find((col) => col.id === fromColumnId);
    const toColumn = columns.find((col) => col.id === column.id);

    if (!fromColumn || !toColumn) return;

    const card = fromColumn.cards.find((c) => c.id === cardId);
    if (!card) return;

    const updatedFromColumn = {
      ...fromColumn,
      cards: fromColumn.cards.filter((c) => c.id !== cardId),
    };

    const updatedToColumn = {
      ...toColumn,
      cards: [...toColumn.cards, card],
    };

    const updatedColumns = columns.map((col) => {
      if (col.id === fromColumnId) return updatedFromColumn;
      if (col.id === column.id) return updatedToColumn;
      return col;
    });

    setColumns(updatedColumns);
  };

  if (!isVisible) {
    return <div ref={ref} className="column-placeholder" />;
  }

  return (
    <div
      ref={ref}
      className="column"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="column-header">
        <h3 className="column-title">{column.title}</h3>
        <button className="delete-column-btn" onClick={handleDeleteColumn}>Delete Column</button>
      </div>

      <div
        className="card-list"
        id={`scrollable-${column.id}`}
        style={{
          overflowX: 'auto',
          display: 'flex',
          flexDirection: 'row',
          maxWidth: '100%',
          whiteSpace: 'nowrap',
        }}
      >
        <InfiniteScroll
          dataLength={visibleCards.length}
          next={fetchMoreCards}
          hasMore={hasMore}
          scrollThreshold={0.9}
          scrollableTarget={`scrollable-${column.id}`}
          loader={<h4 style={{ textAlign: 'center' }}>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Add your task here!</b>
            </p>
          }
        >
          {visibleCards.map((card) => (
            <Card
              key={card.id}
              card={card}
              columnId={column.id}
              handleDeleteCard={handleDeleteCard}
            />
          ))}
        </InfiniteScroll>
      </div>

      <div className="add-task-controls">
        <input
          type="text"
          placeholder="New task"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          className="new-card-input"
        />
        <button className="add-card-btn" onClick={handleAddCard}>
          Add Task
        </button>
      </div>
    </div>
  );
};

export default Column;
