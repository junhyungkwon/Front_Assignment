import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Item = ({ item, index, isSelected, toggleSelection }) => {
  const handleClick = () => {
    toggleSelection(item.id);
  };

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          className={`Item ${snapshot.isDragging ? 'Dragging' : ''} ${isSelected ? 'Selected' : ''}`}
        >
          {item.content}
        </div>
      )}
    </Draggable>
  );
};

export default Item;
