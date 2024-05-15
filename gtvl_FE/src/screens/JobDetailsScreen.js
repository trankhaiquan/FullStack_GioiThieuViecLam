import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView, Button, StyleSheet } from "react-native";
import apiClient, { endpoints, authApi } from "../services/api"; // Import authApi
import { MyContext } from "../context/MyContext";

const JobDetailsScreen = ({ route, navigation }) => {
  const { jobId } = route.params;
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await authApi.get(endpoints.jobDetails(jobId));
        setJob(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết công việc:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleApply = () => {
    if (state.isAuthenticated) {
      navigation.navigate("ApplicationForm", { jobId });
    } else {
      // Hiển thị thông báo yêu cầu đăng nhập
      alert("Bạn cần đăng nhập để nộp đơn ứng tuyển.");
    }
  };

  if (!job) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Công việc :{job.title}</Text>
      <Text style={styles.company}>Công ty:{job.employer.company_name}</Text>
      <Text style={styles.location}>Địa chỉ:{job.location}</Text>
      <Text style={styles.description}>Mô tả:{job.description}</Text>
      {/* ... other job details (requirements, salary, etc.) */}
      <Button title="Nộp đơn ứng tuyển" onPress={handleApply} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  company: {
    fontSize: 18,
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default JobDetailsScreen;
