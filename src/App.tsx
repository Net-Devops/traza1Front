import { BrowserRouter as Router } from "react-router-dom";
import {Provider} from 'react-redux';
import store from '../src/redux/Store';
import Sider from './components/element/menuLateral/Sider';


function App() {
  

  return (
    <Provider store ={store}>
    <Router>
   
         
           
            <Sider />
            
         
   
    </Router>
    </Provider>
  
  )
}

export default App
