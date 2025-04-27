import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { auth } from '../config/firebase-config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('เข้าสู่ระบบสำเร็จ!', `Welcome ${userCredential.user.email}`);
      router.replace('(tabs)');
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', error.message);
    }
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('สมัครสมาชิกสำเร็จ!', `Welcome ${userCredential.user.email}`);
      router.push('/Register');
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#A3CC01' }}>
      <ImageBackground
        source={require('../assets/bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.container}>
            <Image source={require('../assets/logo2.png')} style={styles.logo} resizeMode="contain" />

            <View style={styles.card}>
              <Text style={styles.title}>เข้าสู่ระบบ</Text>

              {/* ช่องกรอกอีเมล */}
              <View style={styles.inputWrapper}>
                <Image source={require('../assets/user.png')} style={styles.iconLeft} />
                <TextInput
                  style={styles.input}
                  placeholder="ชื่อผู้ใช้หรืออีเมล"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* ช่องกรอกรหัสผ่าน */}
              <View style={styles.inputWrapper}>
                <Image source={require('../assets/lock.png')} style={styles.iconLeftSmall} />
                <TextInput
                  style={styles.input}
                  placeholder="รหัสผ่าน"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <Image source={require('../assets/eye.png')} style={styles.iconRight} />
              </View>

              <TouchableOpacity onPress={() => Alert.alert('ลืมรหัสผ่าน')}>
                <Text style={styles.forgot}>เปลี่ยนรหัสผ่าน</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/Home')}>
                <Text style={styles.loginText}>เข้าสู่ระบบ</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/Register')}>
              <Text style={styles.signupText}>สมัครสมาชิก</Text>
              </TouchableOpacity>



              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>ช่องทางอื่นๆ</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.socialContainer}>
                <Image source={require('../assets/facebook.png')} style={styles.socialIcon} />
                <Image source={require('../assets/google.png')} style={styles.socialIcon} />
                <Image source={require('../assets/line.png')} style={styles.socialIcon} />
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
  },
  container: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#A3CC01',
    borderRadius: 10,
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  iconLeft: {
    width: 30,
    height: 30,
  },
  iconLeftSmall: {
    width: 25,
    height: 25,
  },
  iconRight: {
    width: 22,
    height: 22,
    tintColor: '#aaa',
  },
  forgot: {
    alignSelf: 'flex-end',
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#A3CC01',
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
  },
  loginText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#fff',
    borderColor: '#A3CC01',
    borderWidth: 2,
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
  },
  signupText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#000',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
});
