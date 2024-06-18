import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Item from './Item';

const Column = ({ columnId, items, selectedItems, toggleSelection }) => {
  const columnTitles = {
    item1: 'Column 1',
    item2: 'Column 2',
    item3: 'Column 3',
    item4: 'Column 4'
  };

  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`Column ${snapshot.isDraggingOver ? 'DraggingOver' : ''}`}
        >
          <h2>{columnTitles[columnId]}</h2>
          {items.map((item, index) => (
            <Item
              key={item.id}
              item={item}
              index={index}
              isSelected={selectedItems.includes(item.id)}
              toggleSelection={toggleSelection} 
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
