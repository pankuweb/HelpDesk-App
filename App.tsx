import 'react-native-gesture-handler';
import NavigationWrapper from './src/routes/root-navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  return <GestureHandlerRootView style={{ flex: 1 }}><NavigationWrapper /></GestureHandlerRootView>;
}

export default App;
