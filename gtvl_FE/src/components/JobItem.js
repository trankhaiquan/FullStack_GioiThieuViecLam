import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const JobItem = ({ job, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.company}>{job.employer.company_name}</Text>
      <Text style={styles.location}>{job.location}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  company: {
    fontSize: 16,
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: "gray",
  },
});

export default JobItem;
