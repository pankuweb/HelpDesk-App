import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ImageSource } from '../../../constants';
import { fetchImage } from '../../../backend/RequestAPI';

interface PersonaProps {
  name: string;
  mail: string;
  size?: number;
}

const imageCache: Record<string, string> = {};

const Persona: React.FC<PersonaProps> = ({ name, mail, size = 26 }) => {
  const [image, setImage] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const loadImage = async () => {
      if (!mail) return;

      if (imageCache[mail]) {
        setImage(imageCache[mail]);
        return;
      }

      try {
        const res = await fetchImage(mail, 'M');
        if (res && isMounted.current) {
          imageCache[mail] = res;
          setImage(res);
        }
      } catch (err) {
        console.log('Error loading user image:', err);
      }
    };

    loadImage();

    return () => {
      isMounted.current = false;
    };
  }, [mail]);

  return (
    <View style={styles.container}>
      <Image
        source={
          image
            ? { uri: image }
            : ImageSource?.userphoto
        }
        style={[
          styles.image,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
        resizeMode="cover"
      />
      <Text style={styles.name}>
        {name?.length > 15 ? `${name.substring(0, 15)}...` : name}
      </Text>
    </View>
  );
};

export default Persona;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    marginRight: 10,
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#026367',
  },
});
