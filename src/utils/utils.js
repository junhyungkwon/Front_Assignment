export const multiDragAwareReorder = ({ entities, selectedTaskIds, source, destination }) => {
    if (!entities || !entities.columns) {
      console.error("Entities or columns are undefined:", entities);
      return { entities, selectedTaskIds };
    }
  
    const { columnId: sourceColumnId, index: sourceIndex } = source;
    const { columnId: destinationColumnId, index: destinationIndex } = destination;
  
    const start = entities.columns[sourceColumnId];
    const finish = entities.columns[destinationColumnId];
  
    if (!start || !finish) {
      console.error("Start or finish column is undefined:", start, finish);
      return { entities, selectedTaskIds };
    }
  
    const startTaskIds = Array.from(start.items);
    const finishTaskIds = Array.from(finish.items);
  
    const movingItems = selectedTaskIds.map(id => startTaskIds.splice(startTaskIds.findIndex(item => item.id === id), 1)[0]);
    finishTaskIds.splice(destinationIndex, 0, ...movingItems);
  
    const newStart = {
      ...start,
      items: startTaskIds,
    };
  
    const newFinish = {
      ...finish,
      items: finishTaskIds,
    };
  
    return {
      entities: {
        ...entities,
        columns: {
          ...entities.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      },
      selectedTaskIds,
    };
  };
  