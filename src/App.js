import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Column from './columns/Columns'; 
import './styles/App.css'

const createItems = (columnId) => (
  Array.from({ length: 4 }, (v, k) => ({
    id: `${columnId}-item${k + 1}`,
    content: `Item ${k + 1}`
  }))
);

const initialData = {
  columns: {
    'item1': { id: 'item1', items: createItems('item1') },
    'item2': { id: 'item2', items: createItems('item2') },
    'item3': { id: 'item3', items: createItems('item3') },
    'item4': { id: 'item4', items: createItems('item4') }
  }
};

function App() {
  const [data, setData] = useState(initialData);

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      if (!destination) {
        return;
      }

      const isEven = (id) => parseInt(id.split('-item')[1]) % 2 === 0;

      // 첫 번째 칼럼에서 세 번째 칼럼으로 이동하는 것을 막기
      if (source.droppableId === 'item1' && destination.droppableId === 'item3') {
        alert("첫 번째 칼럼에서 세 번째 칼럼으로는 이동할 수 없습니다.");
        return;
      }

      const sourceColumn = data.columns[source.droppableId];
      const destColumn = data.columns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [movedItem] = sourceItems.splice(source.index, 1);

      // 짝수 아이템이 짝수 아이템 아래로 이동하는 것을 막기
      if (isEven(movedItem.id)) {
        // 같은 컬럼 내에서 이동하는 경우
        if (source.droppableId === destination.droppableId) {
          if (destination.index > 0) {
            const prevItem = sourceItems[destination.index - 1];
            if (prevItem && isEven(prevItem.id)) {
              alert("짝수 아이템은 다른 짝수 아이템 아래로 이동할 수 없습니다.");
              return;
            }
          }
        } 
        // 다른 컬럼으로 이동하는 경우
        else {
          if (destination.index > 0) {
            const prevItem = destItems[destination.index - 1];
            if (prevItem && isEven(prevItem.id)) {
              alert("짝수 아이템은 다른 짝수 아이템 아래로 이동할 수 없습니다.");
              return;
            }
          }
        }
      }

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='App' style={{ display: 'flex' }}>
        {Object.entries(data.columns).map(([columnId, column]) => (
          <Column
            key={columnId}
            columnId={columnId}
            items={column.items}
          />
        ))}
      </div>
    </DragDropContext>
  );
}

export default App;