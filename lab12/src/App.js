import logo from './logo.svg';
import './App.css';
import HelloCGU from './cgu_hello'
import MultiButton from './cgu_multiButton'
const styleArgument = {fontSize:'100px',color:'red'};


function App() {
  return (
    <div className="App">
      <div>
        {HelloCGU()}
      </div>
      <div>
        {MultiButton(10)}
      </div>
      
    </div>
  );
}

export default App;


//<header className="App-header">
//<img src={logo} className="App-logo" alt="logo" />
//<p>
  //Edit <code>src/App.js</code> and save to reload.
//</p>
//<a
  //className="App-link"
  //href="https://reactjs.org"
  //target="_blank"
  //rel="noopener noreferrer"
//>
  //Learn React
//</a>
//</header>