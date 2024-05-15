import React, { useContext } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { MyContext } from "../context/MyContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ navigation }) => {
  const [state, dispatch] = useContext(MyContext);
  console.log("State user:", state.user);
  console.log("Avatar URL:", state.user?.avatar); // Sử dụng optional chaining

  const handleLogout = async () => {
    try {
      if (state.user) {
        await AsyncStorage.removeItem("access_token");
        dispatch({ type: "logout" });
        navigation.navigate("Login"); // Chuyển hướng ngay lập tức
      }
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>Xin chào, {state.user?.username}!</Text>
      {state.user.avatar &&
        (console.log("Avatar URL before Image:", state.user.avatar),
        (<Image source={{ uri: state.user.avatar }} style={styles.avatar} />))}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1715645942867-4c8649966352?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        style={styles.avatar}
      />
      <Button title="Đăng xuất" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default ProfileScreen;
