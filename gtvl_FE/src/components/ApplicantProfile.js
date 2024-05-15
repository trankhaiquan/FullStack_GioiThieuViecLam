import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import apiClient, { endpoints } from "../services/api";

const ApplicantProfile = ({ applicantId }) => {
  const [applicant, setApplicant] = useState(null);

  useEffect(() => {
    const fetchApplicantProfile = async () => {
      try {
        const response = await apiClient.get(
          endpoints.applicantProfile(applicantId)
        );
        setApplicant(response.data);
      } catch (error) {
        console.error(error);
        // Xử lý lỗi
      }
    };

    fetchApplicantProfile();
  }, [applicantId]);

  if (!applicant) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: applicant.avatar_url }} style={styles.avatar} />
      <Text style={styles.fullName}>{applicant.full_name}</Text>
      {/* Hiển thị các thông tin khác của ứng viên */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  fullName: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ApplicantProfile;
