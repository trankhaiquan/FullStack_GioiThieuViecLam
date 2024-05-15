import React, { useEffect, useState, useContext } from "react";
import { FlatList, View, Text, ActivityIndicator } from "react-native";
import apiClient, { endpoints } from "../services/api";
import JobItem from "./JobItem";
import { MyContext } from "../context/MyContext";

const JobList = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false); // Thêm state loading
  const [state, dispatch] = useContext(MyContext);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const response = await apiClient.get(endpoints.jobs);
        setJobs(response.data.results); // Lấy dữ liệu từ response.data.results
      } catch (error) {
        console.error(error);
        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchJobs();
  }, []);

  const handleJobPress = (jobId) => {
    navigation.navigate("JobDetails", { jobId });
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      {state.isAuthenticated ? (
        <FlatList
          data={jobs}
          renderItem={({ item }) => (
            <JobItem job={item} onPress={() => handleJobPress(item.id)} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text>Bạn cần đăng nhập để xem danh sách công việc</Text>
      )}
    </View>
  );
};

export default JobList;
