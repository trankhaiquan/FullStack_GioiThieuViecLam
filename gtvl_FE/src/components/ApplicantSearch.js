// src/components/ApplicantSearch.js
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

const ApplicantSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tìm kiếm ứng viên..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <Button title="Tìm kiếm" onPress={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
  },
});

export default ApplicantSearch;
