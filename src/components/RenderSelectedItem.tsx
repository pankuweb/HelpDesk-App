import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchImage } from "../backend/RequestAPI";
import { ImageSource } from "../constants";

export const RenderSelectedItem = ({ item, unSelect, styles }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadImage = async () => {
      if (item?.Users?.EMail) {
        const url = await fetchImage(item.Users.EMail, "M");
        if (isMounted) {
          setPhotoUrl(url);
        }
      }
    };
    loadImage();

    return () => {
      isMounted = false;
    };
  }, [item?.Users?.EMail]);

  return (
    <View style={styles.selectedItem}>
      <Image
        source={
          photoUrl
            ? { uri: photoUrl }
            : ImageSource?.userphoto
        }
        style={[styles.image, { width: 28, height: 28, borderRadius: 16 }]}
        resizeMode="cover"
      />
      <Text style={styles.selectedTextMulti}>{item.value}</Text>
      <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
        <Ionicons name="close-circle" size={18} color="#555" />
      </TouchableOpacity>
    </View>
  );
};
