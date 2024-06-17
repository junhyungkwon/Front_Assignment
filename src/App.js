import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Column from './columns/Columns'; 
import './styles/App.css'

const initialData = {
  columns: {
    'item1': { id: 'item1', items: Array.from({ length: 4 }, (v, k) => ({ id: `item${k}`, content: `items${k + 1}` })) },
    'item2': { id: 'item2', items: [] },
    'item3': { id: 'item3', items: [] },
    'item4': { id: 'item4', items: [] }
  }
};

function App() {
  const [data, setData] = useState(initialData);
  const [selectedItems, setSelectedItems] = useState([]);

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      if (!destination) {
        return;
      }

      if (source.droppableId === 'item1' && destination.droppableId === 'item3') {
        alert("이동할 수 없습니다.");
        return;
      }

      const sourceColumn = data.columns[source.droppableId];
      const destColumn = data.columns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [movedItem] = sourceItems.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceItems.splice(destination.index, 0, movedItem);
        const newColumn = {
          ...sourceColumn,
          items: sourceItems
        };
        setData((prevData) => ({
          ...prevData,
          columns: {
            ...prevData.columns,
            [source.droppableId]: newColumn
          }
        }));
      } else {
        destItems.splice(destination.index, 0, movedItem);
        const newSourceColumn = {
          ...sourceColumn,
          items: sourceItems
        };
        const newDestColumn = {
          ...destColumn,
          items: destItems
        };
        setData((prevData) => ({
          ...prevData,
          columns: {
            ...prevData.columns,
            [source.droppableId]: newSourceColumn,
            [destination.droppableId]: newDestColumn
          }
        }));
      }
    },
    [data]
  );

  const toggleSelection = (itemId) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(itemId)
        ? prevSelectedItems.filter((id) => id !== itemId)
        : [...prevSelectedItems, itemId]
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='App' style={{ display: 'flex' }}>
        <div className='dsd'>
        {Object.entries(data.columns).map(([columnId, column]) => (
          <Column
            key={columnId}
            columnId={columnId}
            items={column.items}
            selectedItems={selectedItems}
            toggleSelection={toggleSelection}
          />
        ))}
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
