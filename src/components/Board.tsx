import React, { useState, useEffect } from 'react';
import type { ColumnType } from '../types';
import Column from './Column';

type Props = {
  columns: ColumnType[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
};

const Board = ({ columns, setColumns }: Props) => {
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;

    const newColumn: ColumnType = {
      id: `col-${Date.now()}`,
      title: newColumnTitle,
      cards: [],
    };

    setColumns([...columns, newColumn]);
    setNewColumnTitle('');
  };

  const updateColumn = (columnId: string, updatedColumn: ColumnType) => {
    setColumns(columns.map(col => col.id === columnId ? updatedColumn : col));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  return (
    <div className="board-container">
      <div className="columns-row">
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            columns={columns}
            setColumns={setColumns}
            updateColumn={updateColumn}
          />
        ))}
      </div>

      {/* Draggable New Column UI */}
      <div
        className="new-column"
        style={{
          position: 'absolute',
          top: position.y,
          left: position.x,
          cursor: 'move',
          zIndex: 1000,
        }}
        onMouseDown={handleMouseDown}
      >
        <input
          className="new-column-input"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          placeholder="New column title"
        />
        <button className="add-column-btn" onClick={handleAddColumn}>
          Add Column
        </button>
      </div>
    </div>
  );
};

export default Board;
