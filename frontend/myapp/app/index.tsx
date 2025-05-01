import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Image, StyleSheet } from 'react-native';

export default function IndexRedirect() {
  const [showImage, setShowImage] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(false);
      router.replace('/login'); // Navigate to the login page after 3 seconds
    }, 4000); // Show the image for 3 seconds

    return () => clearTimeout(timer); // Clear the timer when the component unmounts
  }, []);

  return (
    <View style={styles.container}>
      {showImage && (
        <Image
          source={require('../assets/logo1.png')} // Adjusted path
          style={styles.image}
          resizeMode="contain" // Ensures the image scales within the container without distortion
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9c8', // Green background
  },
  image: {
    width: '30%', // Adjust width to 50% of the screen size
    height: undefined, // Automatically adjusts the height based on the width and aspect ratio
    aspectRatio: 1, // Maintains the aspect ratio of the image
  },
});
