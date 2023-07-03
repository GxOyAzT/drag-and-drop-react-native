import React, { useState } from 'react';
import Folder from './src/components/folder/Folder';
import { Alert } from 'react-native';

const App = () => {
  const [elements, setElements] = useState([
    { index: 0, type: Type.file, name: 'NAME A' }, 
    { index: 1, type: Type.file, name: 'NAME B' }, 
    { index: 2, type: Type.folder, name: 'NAME C'}, 
    { index: 3, type: Type.folder , name: 'NAME D'}, 
    { index: 4, type: Type.file, name: 'NAME E' },
    { index: 5, type: Type.file, name: 'NAME F' },
    { index: 6, type: Type.folder, name: 'NAME G' },
    { index: 7, type: Type.file, name: 'NAME H' },
    { index: 8, type: Type.folder, name: 'NAME I' },
    { index: 9, type: Type.folder, name: 'NAME J' },
    { index: 10, type: Type.file, name: 'NAME K' }
  ]);

    const moveFolderToParent = (index: number): void => {
      const newList = elements.filter(x => x.index != index);
      let indexX = 0;
      newList.forEach(x => x.index = indexX++);
      setElements(newList)
      Alert.alert(`FOLDER/FILE ${index} MOVED TO PARENT FOLDER`)
    }

    const moveFolderToFolder = (sourceIndex: number, targetIndex: number) => {
      const newList = elements.filter(x => x.index != sourceIndex);
      let index = 0;
      newList.forEach(x => x.index = index++);
      setElements(newList)
      Alert.alert(`FOLDER ${sourceIndex} MOVED TO FOLDER ${targetIndex}`)
    }

    const createFolderFromTwoFiles = (fileOne: number, fileTwo: number) => {
      const newListWithoutFirstFile = elements.filter(x => x.index != fileOne);
      const newListWithoutSecondFile = newListWithoutFirstFile.filter(x => x.index != fileTwo);
      newListWithoutSecondFile.push({ index: -1, type: Type.folder, name: 'NEW FOLDER :)' })
      let index = 0;
      newListWithoutSecondFile.forEach(x => x.index = index++);
      setElements(newListWithoutSecondFile);
      Alert.alert(`NEW FOLDER CREATED FROM FILES ${fileOne} AND ${fileTwo}`)
    }

    const addFileToFolder = (indexFolder: number, indexFile: number) => {
      const newList = elements.filter(x => x.index != indexFile);
      let indexX = 0;
      newList.forEach(x => x.index = indexX++);
      setElements(newList)
      Alert.alert(`MOVE FILE ${indexFile} TO FOLDER ${indexFolder}`)
    }

    const elementCicked = (index: number) => {
      Alert.alert(`ELEMENT ${index} CLICKED`)
    }

    const changeElementPosition = (oldIndex: number, newIndex: number) => {
      if (oldIndex == newIndex) return;

      const newElementsList = []
      if (oldIndex < newIndex) { // down
        for (let i = 0; i < elements.length; i++) {
          if (i != oldIndex) {
            newElementsList.push(elements[i])
          }
          if (i === newIndex) {
            newElementsList.push(elements[oldIndex])
          }
        }
      }

      if (oldIndex > newIndex) { // up
        for (let i = 0; i < elements.length; i++) {
          if (i != oldIndex) {
            newElementsList.push(elements[i])
          }
          if (i === newIndex) {
            newElementsList.push(elements[oldIndex])
          }
        }
      }

      let indexX = 0;
      newElementsList.forEach(x => x.index = indexX++);
      setElements(newElementsList)
      console.log(`ELEMENT ${oldIndex} CHANGED POSITION TO ${newIndex}`);
    }

  return (
    <Folder 
      moveFolderToParent={moveFolderToParent} 
      moveFolderToFolder={moveFolderToFolder}
      createFolderFromTwoFiles={createFolderFromTwoFiles}
      addFileToFolder={addFileToFolder}
      elementCicked={elementCicked}
      changeElementPosition={changeElementPosition}
      elements={elements}/>
  );
};

export enum Type {
  folder = 1,
  file = 2
}

export default App;