import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { authApi, endpoints } from "../services/api"; // Sử dụng authApi
import { MyContext } from "../context/MyContext";
import RadioGroup from "react-native-radio-buttons-group";

const JobFormScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("full-time");
  const [state, dispatch] = useContext(MyContext);

  const [jobTypeOptions, setJobTypeOptions] = useState([
    {
      id: "full-time",
      label: "Toàn thời gian",
      value: "full-time",
      selected: true, // Chọn "Toàn thời gian" làm mặc định
    },
    {
      id: "part-time",
      label: "Bán thời gian",
      value: "part-time",
    },
    {
      id: "internship",
      label: "Thực tập",
      value: "internship",
    },
  ]);

  const [selectedJobTypeId, setSelectedJobTypeId] = useState("full-time");

  const handleJobTypeChange = (radioButtonsArray) => {
    setJobTypeOptions(radioButtonsArray);
    // Lấy giá trị ID của radioButton được chọn
    const selectedJobType = radioButtonsArray.find(
      (radioButton) => radioButton.selected === true
    );
    if (selectedJobType) {
      setSelectedJobTypeId(selectedJobType.id); // Cập nhật selectedJobTypeId
      setJobType(selectedJobType.value);
    }
  };

  const handleSubmit = async () => {
    try {
      const jobData = {
        title: title,
        description: description,
        requirements: requirements,
        salary: salary,
        location: location,
        job_type: jobType,
        employer: state.user.id,
        created_at: new Date(),
      };
      console.log("Dữ liệu gửi lên:", jobData); // In ra dữ liệu trước khi gửi

      const response = await authApi.post(endpoints.jobs, jobData);
      console.log("Job created:", response.data);
    } catch (error) {
      console.error("Lỗi khi tạo Job:", error);
      console.log("Response từ backend:", error.response); // In ra response từ backen
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
      <Text>Loại công việc:</Text>
      <RadioGroup
        radioButtons={jobTypeOptions}
        onPress={handleJobTypeChange}
        selectedId={selectedJobTypeId}
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

export default JobFormScreen;
