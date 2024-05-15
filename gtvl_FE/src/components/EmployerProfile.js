import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import apiClient, { endpoints } from "../services/api";

const EmployerProfile = ({ employerId }) => {
  const [employer, setEmployer] = useState(null);

  useEffect(() => {
    const fetchEmployerProfile = async () => {
      try {
        const response = await apiClient.get(
          endpoints.employerProfile(employerId) // Sử dụng endpoint chính xác
        );
        setEmployer(response.data);
      } catch (error) {
        console.error(error);
        // Xử lý lỗi
      }
    };

    fetchEmployerProfile();
  }, [employerId]);

  if (!employer) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: employer.avatar_url }} // Sử dụng trường avatar_url từ backend
        style={styles.logo}
      />
      <Text style={styles.companyName}>{employer.company_name}</Text>
      <Text style={styles.description}>{employer.company_description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
  },
});

export default EmployerProfile;
