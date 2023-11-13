import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const TaskFilter = ({ onChangeFilter }) => {
  const [filter, setFilter] = useState('all'); // Inicia com 'all', que representa "Todos"

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
    onChangeFilter(selectedFilter);
  };

  return (
    <div style={{ marginBottom: '2em', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <label style={{ color: '#fff', marginBottom: '.5em', fontSize: '16px' }}> <FontAwesomeIcon icon={faFilter} style={{ marginRight: '.51em'}} />Filtrar Tarefas: </label>
      <select style={{ padding: '1em 1em', background: '#8758ff', color: '#fff', border: 'none', borderRadius: '8px' }} value={filter} onChange={handleFilterChange}>
        <option style={{ color: '#fff' }} value="all"> Todas</option>
        <option style={{ color: '#fff' }} value="completed">Concluídas</option>
        <option style={{ color: '#fff' }} value="notCompleted">Não Concluídas</option>
      </select>
    </div>
  );
};

export default TaskFilter;
