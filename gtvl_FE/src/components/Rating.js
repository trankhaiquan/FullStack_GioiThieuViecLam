import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import apiClient, { endpoints } from "../services/api";
import { MyContext } from "../context/MyContext";

const RatingComponent = ({ employerId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [state, dispatch] = useContext(MyContext);

  const handleSubmit = async () => {
    try {
      const response = await apiClient.post(endpoints.ratings, {
        employer: employerId,
        rating: rating,
        comment: comment,
      });
      console.log("Rating submitted:", response.data);
      // Xử lý thành công, ví dụ: hiển thị thông báo hoặc cập nhật UI
    } catch (error) {
      console.error("Error submitting rating:", error);
      // Xử lý lỗi
    }
  };

  return (
    <View style={styles.container}>
      <Text>Đánh giá: {rating}</Text>
      {/* Thêm component để cho phép người dùng chọn đánh giá (ví dụ: sử dụng slider hoặc star rating) */}
      <TextInput
        style={styles.input}
        placeholder="Bình luận"
        value={comment}
        onChangeText={setComment}
      />
      <Button title="Gửi đánh giá" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
});

export default RatingComponent;
