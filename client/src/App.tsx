import './App.css';
import History from './components/History'
import Form from './components/Form'
import ResultURL from './components/ResultURL';
import { useState } from 'react';

function App() {

  const [inputValue, setInputvalue] = useState("")

  return (
    <>
      <div>
        <Form setInputvalue={setInputvalue} />
        <ResultURL inputValue={inputValue} />
      </div>
      <History />
    </>



  );
}

export default App;
