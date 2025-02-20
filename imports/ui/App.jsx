import React from 'react';
import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';
import FormBuilder from './FormBuilder';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const App = () => (
  <div>
    <DndProvider backend={HTML5Backend}>
      <FormBuilder />
    </DndProvider>
  </div>
);
