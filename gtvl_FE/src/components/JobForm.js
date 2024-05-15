import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { authApi, endpoints } from "../services/api"; // Sử dụng authApi
import { MyContext } from "../context/MyContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const JobForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [state, dispatch] = useContext(MyContext);

  const handleSubmit = async () => {
    try {
      const response = await authApi.post(endpoints.jobs, {
        title: title,
        description: description,
        requirements: requirements,
        salary: salary,
        location: location,
        job_type: jobType,
      });
      console.log("Job created:", response.data);
      // ... (xử lý thành công)
    } catch (error) {
      console.error("Lỗi khi tạo Job:", error);
      // Xử lý lỗi
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tiêu đề"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Yêu cầu"
        value={requirements}
        onChangeText={setRequirements}
      />
      <TextInput
        style={styles.input}
        placeholder="Mức lương"
        value={salary}
        onChangeText={setSalary}
      />
      <TextInput
        style={styles.input}
        placeholder="Địa điểm"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Loại công việc"
        value={jobType}
        onChangeText={setJobType}
      />
      <Button title="Đăng tin" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
});

export default JobForm;
