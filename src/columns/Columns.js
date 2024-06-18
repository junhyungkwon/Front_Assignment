import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Item from './Item';

const Column = ({ columnId, items }) => {

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
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
            padding: 8,
            width: 250,
            minHeight: 300,
            margin: 8
          }}
        >
          <div className='Column-title'>{columnTitles[columnId]}</div>
          {items.map((item, index) => (
            <Item key={item.id} item={item} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Column;