import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import apiClient, { endpoints } from "../services/api";

const ApplicationForm = ({ jobId, navigation }) => {
  const [coverLetter, setCoverLetter] = useState("");

  const handleSubmit = async () => {
    try {
      await apiClient.post(endpoints.applyToJob(jobId), {
        cover_letter: coverLetter,
      });
      navigation.goBack();
      // Hiển thị thông báo thành công
    } catch (error) {
      console.error(error);
      // Xử lý lỗi
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={coverLetter}
        onChangeText={setCoverLetter}
        placeholder="Thư xin việc"
        multiline
      />
      <Button title="Nộp đơn" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    textAlignVertical: "top", // Để text bắt đầu từ trên xuống
  },
});

export default ApplicationForm;
