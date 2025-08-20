import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useMemo} from 'react';
import {ImageSource} from '../../constants/image-source';
import {View, Animated, ActivityIndicator} from 'react-native';
import {styles} from './styles';

function SplashScreen(): JSX.Element {
  const logoOpacity = useMemo(() => new Animated.Value(0), []);
  const logoScale = useMemo(() => new Animated.Value(0), []);
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

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

  return (
    <View style={styles.container}>
      <Animated.Image
        style={{
          ...styles.logo,
          opacity: logoOpacity,
          transform: [{scale: logoScale}],
        }}
        source={ImageSource.logo}
      />
      <View style={styles.bottomView}>
        <ActivityIndicator
          size={`large`}
          color="#8e51f7"
          style={styles.activityIndicator}
        />
      </View>
    </View>
  );
}

export default SplashScreen;
