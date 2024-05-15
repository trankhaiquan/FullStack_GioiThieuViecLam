import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/HomeScreen";
import JobDetailsScreen from "./src/screens/JobDetailsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import EmployerProfileScreen from "./src/screens/EmployerProfileScreen";
import ApplicantProfileScreen from "./src/screens/ApplicantProfileScreen";
import ApplicationForm from "./src/components/ApplicationForm";
import ProfileScreen from "./src/screens/ProfileScreen";
import JobForm from "./src/components/JobForm";
import { MyProvider } from "./src/context/MyContext";
import JobFormScreen from "./src/screens/JobFormScreen";
// ... import các screen khác

const Stack = createStackNavigator();

const App = () => {
  return (
    <MyProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
          <Stack.Screen
            name="EmployerProfile"
            component={EmployerProfileScreen}
          />
          <Stack.Screen
            name="ApplicantProfile"
            component={ApplicantProfileScreen}
          />
          <Stack.Screen name="ApplicationForm" component={ApplicationForm} />
          <Stack.Screen name="JobForm" component={JobFormScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MyProvider>
  );
};

export default App;
