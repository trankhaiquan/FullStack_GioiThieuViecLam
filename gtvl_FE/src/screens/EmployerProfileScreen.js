import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { MyContext } from "../context/MyContext";
import JobItem from "../components/JobItem";
import ApplicantSearch from "../components/ApplicantSearch";
import apiClient, { endpoints } from "../services/api";

const EmployerProfileScreen = ({ navigation }) => {
  const [state, dispatch] = useContext(MyContext);
  const [employer, setEmployer] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employerId, setEmployerId] = useState(null);
  const [foundApplicants, setFoundApplicants] = useState([]);

  useEffect(() => {
    console.log("EmployerProfileScreen useEffect running...");
    if (state.user && state.user.role === "employer") {
      setEmployerId(state.user.id);
      console.log("Employer ID:", state.user.id);

      // Gọi fetchEmployerData trực tiếp sau khi setEmployerId
      const fetchEmployerData = async () => {
        if (employerId) {
          try {
            const employerResponse = await apiClient.get(
              endpoints.employerProfile + employerId + "/"
            );
            setEmployer(employerResponse.data);
            console.log("Employer Data:", employer);

            const jobsResponse = await apiClient.get(endpoints.jobs, {
              params: { employer: employerId },
            });
            setJobs(jobsResponse.data.results);
          } catch (error) {
            console.error("Error fetching employer data:", error);
          } finally {
            setLoading(false);
          }
        }
      };

      fetchEmployerData();
    } else {
      navigation.navigate("Home");
    }
  }, [state.user]);
  const handleSearchApplicants = async (searchTerm) => {
    try {
      const response = await apiClient.get(endpoints.searchApplicants, {
        params: { search: searchTerm },
      });
      console.log("Applicant Search Response:", response.data); // Debug: Kiểm tra response
      setFoundApplicants(response.data);
      console.log("Found Applicants:", foundApplicants); // Debug: Kiểm tra state
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  const handleCreateJob = () => {
    navigation.navigate("JobForm");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Kiểm tra employer trước khi hiển thị
  if (!employer) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy thông tin nhà tuyển dụng.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Hiển thị thông tin nhà tuyển dụng */}
      <Text style={styles.role}>
        Bạn đang đăng nhập với tư cách: {state.user.role}
      </Text>
      <Text style={styles.companyName}>{employer.company_name}</Text>
      <Text style={styles.description}>{employer.company_description}</Text>

      {/* Danh sách công việc */}
      <Text style={styles.jobsTitle}>Danh sách công việc:</Text>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <JobItem
            job={item}
            onPress={() =>
              navigation.navigate("JobDetails", { jobId: item.id })
            }
          />
        )}
      />

      {/* Thanh tìm kiếm ứng viên */}
      <ApplicantSearch onSearch={handleSearchApplicants} />

      {/* Danh sách ứng viên tìm được */}
      <FlatList
        data={foundApplicants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.profile.full_name}</Text>
            {/* Hiển thị thêm thông tin ứng viên ở đây */}
          </View>
        )}
      />

      {/* Nút tạo công việc */}
      <Button title="Đăng tin mới" onPress={handleCreateJob} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  role: {
    fontSize: 16,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  jobsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
});

export default EmployerProfileScreen;
