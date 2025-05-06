import  { useState } from 'react';
import Board from './components/Board';
import type { ColumnType } from './types';
import './index.css'
const App = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);

  return <Board columns={columns} setColumns={setColumns} />;
};

export default App;
