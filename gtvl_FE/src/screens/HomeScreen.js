// HomeScreen.js
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MyContext } from "../context/MyContext";
import JobItem from "../components/JobItem";
import { authApi, endpoints } from "../services/api";

const HomeScreen = ({ navigation }) => {
  const [state, dispatch] = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const response = await authApi.get(endpoints.jobs, {
        params: { page: page },
      });
      console.log("Jobs data:", response.data);
      setJobs(response.data.results);
      setCurrentPage(response.data.current_page || 1);
      setTotalPages(Math.ceil(response.data.count / 20));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách công việc:", error);
    } finally {
      setLoading(false);
      console.log("Trang hiện tại sau khi fetch:", currentPage);
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      setLoading(true);
      try {
        const user = await authApi.get(endpoints.currentUser);
        console.log("User data:", user.data);
        dispatch({
          type: "login",
          payload: {
            username: user.data.username,
            avatar: user.data.avatar,
            role: user.data.role,
          },
        });
        console.log("Trước khi gọi fetchJobs");
        fetchJobs(); // Gọi fetchJobs sau khi cập nhật state
        console.log("Sau khi gọi fetchJobs");
      } catch (error) {
        console.error("Lỗi kiểm tra đăng nhập:", error);
        navigation.navigate("Login");
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
    console.log("User role:", state.user.role);
  }, []);

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  useEffect(() => {
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [jobs, searchTerm]);

  const renderItem = ({ item }) => (
    <JobItem
      job={item}
      onPress={() => navigation.navigate("JobDetails", { jobId: item.id })}
    />
  );

  const handlePagePress = (page) => {
    console.log("Bấm vào trang:", page);
    fetchJobs(page);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        {state.isAuthenticated
          ? `Xin chào, ${state.user.username}!`
          : "Vui lòng đăng nhập"}
      </Text>
      {state.isAuthenticated && (
        <Text style={styles.roleShow}>Vai trò: {state.user.role}</Text>
      )}
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm công việc..."
        value={searchTerm}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredJobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      {/* Nút phân trang */}
      <View style={styles.paginationContainer}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <TouchableOpacity
            key={page}
            style={[
              styles.pageButton,
              currentPage === page && styles.currentPageButton,
            ]}
            onPress={() => handlePagePress(page)}
          >
            <Text
              style={[
                styles.pageButtonText,
                currentPage === page && styles.currentPageButtonText,
              ]}
            >
              {page}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {state.isAuthenticated && state.user.role === "employer" && (
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("EmployerProfile")}
        >
          <Text style={styles.profileButtonText}>Hồ sơ nhà tuyển dụng</Text>
        </TouchableOpacity>
      )}
      {state.isAuthenticated && state.user.role === "employer" && (
        <TouchableOpacity
          style={styles.postJobButton}
          onPress={() => navigation.navigate("JobForm")}
        >
          <Text style={styles.postJobButtonText}>Đăng tin</Text>
        </TouchableOpacity>
      )}
      {state.isAuthenticated && (
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.profileButtonText}>Hồ sơ</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  roleShow: {
    margin: 3,
    color: "red",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "yellow",
    padding: 3,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  profileButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  profileButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  postJobButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 10, // Giảm padding ngang
    paddingVertical: 8, // Giảm padding dọc
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    alignSelf: "flex-center", // Canh phải
  },
  postJobButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  pageButton: {
    marginHorizontal: 5,
    padding: 8, // Giảm padding
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  pageButtonText: {
    fontSize: 16,
  },
  currentPageButton: {
    backgroundColor: "#007bff", // Tô màu nền xanh cho trang hiện tại
  },
  currentPageButtonText: {
    color: "white", // Tô màu chữ trắng cho trang hiện tại
  },
});

export default HomeScreen;
