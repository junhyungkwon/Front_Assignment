// App.js
import React, { useState, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './columns/Columns';
import './styles/App.css';

const createItems = (columnId) => (
  Array.from({ length: 8 }, (v, k) => ({
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
  const [selectedItems, setSelectedItems] = useState([]);
  console.log(selectedItems, 'test')
  
  const toggleSelection = useCallback(
    (itemId) => {
      setSelectedItems((prevSelectedItems) => {
        if (prevSelectedItems.includes(itemId)) {
          // 이미 선택된 아이템인 경우 제거
          return prevSelectedItems.filter((id) => id !== itemId);
        } else {
          // 새로 선택된 아이템인 경우 추가
          return [...prevSelectedItems, itemId];
        }
      });
    },
    [] // 이 부분은 데이터 의존성이 없으므로 빈 배열로 처리합니다.
  );

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      if (!destination) {
        return;
      }
  
      const isEven = (id) => parseInt(id.split('-item')[1]) % 2 === 0;
  
      if (source.droppableId === 'item1' && destination.droppableId === 'item3') {
        alert("첫 번째 칼럼에서 세 번째 칼럼으로는 이동할 수 없습니다.");
        return;
      }
  
      const sourceColumn = data.columns[source.droppableId];
      const destColumn = data.columns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [movedItem] = sourceItems.splice(source.index, 1);
  
      if (isEven(movedItem.id)) {
        if (source.droppableId === destination.droppableId) {
          if (destination.index > 0) {
            const prevItem = sourceItems[destination.index - 1];
            if (prevItem && isEven(prevItem.id)) {
              alert("짝수 아이템은 다른 짝수 아이템 아래로 이동할 수 없습니다.");
              return;
            }
          }
        } else {
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
  
      // 드래그 앤 드롭 완료 후 선택된 아이템 초기화
      setSelectedItems([]);
    },
    [data]
  );
  

  return (
    <DragDropContext
    onDragStart={(start) => {
      const { source, draggableId } = start;
      setSelectedItems([draggableId]);
    }}
    onDragUpdate={(update) => {
      const { draggableId } = update;
      setSelectedItems([draggableId]); // 드래그 중에도 선택된 아이템 업데이트
    }}
    onDragEnd={onDragEnd}
  >
      <div>
        <div className='Column-item'>
          {Object.entries(data.columns).map(([columnId, column]) => (
            <Column
              key={columnId}
              columnId={columnId}
              items={column.items}
              selectedItems={selectedItems}
              toggleSelection={toggleSelection} // toggleSelection 전달
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
