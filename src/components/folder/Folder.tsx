import React, { useRef, useEffect, useState } from 'react';
import {Animated, View, StyleSheet, PanResponder, Text, ScrollView, PanResponderInstance,TouchableOpacity} from 'react-native';

enum Type {
  folder = 1,
  file = 2
}

const folderFileHeight = 85;

interface InputParameters {
  elements: any[],
  moveFolderToParent(index: number): void,
  moveFolderToFolder(sourceIndex: number, targetIndex: number): void,
  createFolderFromTwoFiles(fileOne: number, fileTwo: number): void,
  addFileToFolder(indexFolder: number, indexFile: number): void,
  elementCicked(index: number): void,
  changeElementPosition(oldIndex: number, newIndex: number): void,
}

const Folder = (props: InputParameters) => {
  const elements = props.elements;
  const pans = useRef<Animated.ValueXY[]>([]);
  const panResponders = useRef<PanResponderInstance[]>([]);
  const zIndexes = useRef<Animated.Value[]>([]);

  elements.map((maker, index) => {
    pans.current[index] = new Animated.ValueXY()
  });

  elements.map((maker, index) => {
    zIndexes.current[index] = new Animated.Value(1)
  })

  elements.map((maker, index) => {
    panResponders.current[index] = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant:() => {
        zIndexes.current[index].setValue(100);
      },
      onPanResponderEnd:() => {
        zIndexes.current[index].setValue(1)
      },
      onPanResponderMove: Animated.event([null, {dx: pans.current[index].x, dy: pans.current[index].y}], {useNativeDriver: false}),
      onPanResponderRelease: (evt, gestureState) => {
        const difference = gestureState.dy > 0 ? Math.ceil((gestureState.dy - (folderFileHeight/3)) / (folderFileHeight/2)) : Math.floor((gestureState.dy + (folderFileHeight/3)) / (folderFileHeight/2))
        console.log("difference",difference);

        const eventMode= Math.abs(difference % 2);
        console.log(eventMode)

        if (eventMode == 1) {
          const steps = gestureState.dy > 0 ? Math.floor(difference / 2) : Math.floor(difference / 2);
          props.changeElementPosition(index, index + steps);
        }

        if (eventMode == 0) {
          const steps = difference / 2;
          if (steps === 0) {
            pans.current[index].setValue({ x: 0, y: 0 });
            return;
          }
  
          if ((index + steps) < 0) {
            props.moveFolderToParent(index);
            pans.current[index].setValue({ x: 0, y: 0 });
            return;
          }
  
          const elementTarget = elements.at(index + steps);
          const elementSource = elements.at(index);
          if (elementTarget && elementSource) {
            if(elementTarget.type === Type.folder && elementSource.type === Type.file) props.addFileToFolder(index + steps, index);
            if(elementTarget.type === Type.folder && elementSource.type === Type.folder) props.moveFolderToFolder(index, index + steps);
            if(elementTarget.type === Type.file && elementSource.type === Type.file) props.createFolderFromTwoFiles(index, index + steps);
          }
        }

        pans.current[index].setValue({ x: 0, y: 0 });
      },
    })
  });
  return (
    <View style={styles.container}>
      <ScrollView>
      <View style={styles.topBox}>
        <Text>Parent Folder</Text>
      </View>
      {
        elements.map((maker, index) => 
          <Animated.View
            key={index}
            style={{
              transform: [{translateX: pans.current[index].x}, {translateY: pans.current[index].y}],
              zIndex: zIndexes.current[index],
              marginRight: 20,
              marginLeft: 20,
            }}
            {...panResponders.current[index].panHandlers}>
            <TouchableOpacity onPressIn={() => zIndexes.current[index].setValue(-1)} onPress={() => props.elementCicked(index)} style={{...styles.box, backgroundColor: elements[index].type == Type.folder ? 'yellow' : 'blue'}}>
              <Text style={{textAlign: 'center'}}>INDEX: {index}</Text>
              <Text style={{textAlign: 'center'}}>{elements[index].type == Type.folder ? 'FOLDER' : 'FILE'}</Text>
              <Text style={{textAlign: 'center'}}>{elements[index].name}</Text>
            </TouchableOpacity>
          </Animated.View>
        )
      }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aqua'
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  box: {
    zIndex: 0,
    paddingBottom: 10,
    height: folderFileHeight,
    width: '100%',
    backgroundColor: 'blue',
    borderRadius: 15,
  },
  topBox: {
    height: 50,
    width: '100%',
    backgroundColor: 'green',
  },
});

export default Folder;