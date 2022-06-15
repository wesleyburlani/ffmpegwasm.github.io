import React from 'react';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import FadeIn from 'react-fade-in';
import Demo from './Demo';

function App() {
  return (
    <Container maxWidth="md">
      <FadeIn>
        <Divider />
        <div id="demo" />
        <Demo />
      </FadeIn>
    </Container>
  );
}

export default App;
