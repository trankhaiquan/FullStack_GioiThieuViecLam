import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import apiClient, { endpoints } from "../services/api";
import { MyContext } from "../context/MyContext";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // ... other registration fields (e.g., email, full_name, role)
  const [state, dispatch] = useContext(MyContext);

  const handleRegister = async () => {
    try {
      const data = {
        username,
        password,
        // ... other registration fields
      };
      await apiClient.post(endpoints.register, data); // Thay endpoints.register bằng endpoint đăng ký của backend

      // Sau khi đăng ký thành công, có thể tự động đăng nhập hoặc điều hướng người dùng đến màn hình đăng nhập
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      // Xử lý lỗi
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {/* ... other input fields for registration */}
      <Button title="Đăng ký" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default RegisterScreen;
