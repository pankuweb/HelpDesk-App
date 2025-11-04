import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { clearLoginData } from '../redux/slices/loginSlice';

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      dispatch(clearLoginData());
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return logout;
};
