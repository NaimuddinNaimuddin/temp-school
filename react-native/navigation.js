import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
//import Form from './form';
import LoginPage from './LoginPage';
import dashboard from './dashbord';
import Form  from './form';
const MainNavigator = createStackNavigator({
  Profile: {screen: LoginPage},
  Home: {screen: dashboard},
  signup:{screen: Form}
  
});
const App1 = createAppContainer(MainNavigator);
export default App1;