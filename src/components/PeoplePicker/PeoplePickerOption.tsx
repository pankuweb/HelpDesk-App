import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ImageSource } from '../../constants';
import { fetchImage } from '../../backend/RequestAPI';

const PeoplePickerOption = ({ name, mail, size = 30 }) => {
  const [image, setImage] = React.useState<string | null>(null);
  
    React.useEffect(() => {
    const loadImages = async () => {
      if (mail) {
        const res = await fetchImage(mail, "M");
        setImage(res);
      }
    };
  
    loadImages();
  }, [mail]);
  return (
    <View style={styles.container}>
        <Image
            source={mail && image ? { uri: image } : ImageSource?.userphoto}
            style={[styles.image, { width: 32, height: 32, borderRadius: size / 2 }]}
            resizeMode="cover"
        />
        <View>
            <Text style={styles.name}>
                {name
                ? name.length > 15
                    ? `${name.substring(0, 15)}...`
                    : name
                : "Unknown User"}
            </Text>
            <Text style={styles.mail}>
                {mail
                ? mail.length > 35
                    ? `${mail.substring(0, 35)}...`
                    : mail
                : "Unknown User"}
            </Text>
            </View>
    </View>
  );
};

export default PeoplePickerOption;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    marginVertical: 4,
  },
  image: {
    marginHorizontal: 10,
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: '#000',
  },
  mail: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#000',
  },
});
