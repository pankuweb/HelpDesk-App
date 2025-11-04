import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import { ImageSource } from '../../constants/image-source';
import { View, Animated, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { useSelector, useDispatch } from 'react-redux';
import { updateLoginData } from '../../redux/slices/loginSlice';


function SplashScreen(): JSX.Element {
  const logoOpacity = useMemo(() => new Animated.Value(0), []);
  const logoScale = useMemo(() => new Animated.Value(0), []);
  const navigation = useNavigation();
  const dispatch = useDispatch();
        const login = useSelector((state: RootState) => state?.login);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoOpacity, logoScale]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (login?.token) {
        navigation.replace('Drawer');
      } else {
        navigation.replace('Login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, login?.token]);

  return (
    <View style={styles.container}>
      <Animated.Image
        style={{
          ...styles.logo,
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
        }}
        source={ImageSource.logo}
      />
      <View style={styles.bottomView}>
        <ActivityIndicator
          size="large"
          color="#8e51f7"
          style={styles.activityIndicator}
        />
      </View>
    </View>
  );
}

export default SplashScreen;
