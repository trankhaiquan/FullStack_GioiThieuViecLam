import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient, { endpoints, authApi, getUserProfile } from "../services/api"; // Import getUserProfile
import { MyContext } from "../context/MyContext";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useContext(MyContext);

  const handleLogin = async () => {
    setLoading(true);
    console.log("Đã kết nối đến máy chủ backend");
    try {
      const data = {
        grant_type: "password",
        username: username,
        password: password,
        client_id: "lta3CjvdK8ggGU3xRq7YJp2y2n5tPyT1tI15nDDQ",
        client_secret:
          "it3YPnNPn1JKWiFzoZFZ2UuRxyGKKDgoJxJPIuOSqW2TUwgvPo24XXFlCy4gJ8kzV7SfG6CR4ivUjmctIjk6LsC2i5feGiRPvU5MEjj1IUul6EGU9Sv4SMJfDdqUAIkl",
      };
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      };
      console.log("Đã gửi request đăng nhập");
      const response = await authApi.post(endpoints.login, data, {
        headers: headers,
      });

      if (response.data && response.data.access_token) {
        await AsyncStorage.setItem("access_token", response.data.access_token);
        console.log(
          "Access token đã lưu:",
          await AsyncStorage.getItem("access_token")
        );

        // Gọi /api/users/me/ ngay sau khi nhận access token
        try {
          const user = await authApi.get(endpoints["currentUser"]);
          console.log("Headers request /api/users/me/:", user.config.headers); // Kiểm tra header
          console.log("Đã nhận được thông tin người dùng:", user.data); // Kiểm tra response data

          dispatch({
            type: "login",
            payload: {
              username: user.data.username,
              avatar: user.data.avatar,
              role: user.data.role,
            },
            // Lưu username vào context
          });
          //  if (user.data.role === "employer") {
          //         navigation.navigate("EmployerProfile");
          //       } else {
          navigation.navigate("Home"); // Hoặc màn hình khác cho applicant
          //       }
        } catch (error) {
          // Xử lý lỗi khi gọi /api/users/me/
          console.error("Lỗi lấy thông tin người dùng:", error);
          Alert.alert("Lỗi", "Không thể lấy thông tin người dùng.");
        }
      } else {
        console.error("Lỗi đăng nhập:", response.data);
        Alert.alert(
          "Lỗi",
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập."
        );
      }
    } catch (error) {
      // Xử lý lỗi chung, có thể do network error
      console.error("Lỗi đăng nhập:", error);
      if (error.response && error.response.data) {
        console.error("Lỗi từ server:", error.response.data);
        Alert.alert("Lỗi", error.response.data.detail || "Đăng nhập thất bại.");
      } else {
        Alert.alert(
          "Lỗi",
          "Đăng nhập thất bại. Vui lòng kiểm tra kết nối mạng."
        );
      }
    } finally {
      setLoading(false); // Kết thúc loading
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
      <Button title="Đăng nhập" onPress={handleLogin} disabled={loading} />
      {loading && <ActivityIndicator size="large" />}
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

export default LoginScreen;
