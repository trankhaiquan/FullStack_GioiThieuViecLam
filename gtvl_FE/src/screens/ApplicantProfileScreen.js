import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";
import { MyContext } from "../context/MyContext";
import ApplicantProfile from "../components/ApplicantProfile";
import apiClient, { endpoints } from "../services/api";

const ApplicantProfileScreen = () => {
  const [state, dispatch] = useContext(MyContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          endpoints.candidateProfile + state.user.id + "/"
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin hồ sơ:", error);
        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
      } finally {
        setLoading(false);
      }
    };

    if (state.isAuthenticated) {
      fetchProfile();
    }
  }, [state.isAuthenticated]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!profile) {
    return <Text>Không tìm thấy hồ sơ.</Text>;
  }

  return (
    <ScrollView>
      <ApplicantProfile profile={profile} />
      {/* ... hiển thị danh sách đơn ứng tuyển hoặc thông tin liên quan khác */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default ApplicantProfileScreen;
