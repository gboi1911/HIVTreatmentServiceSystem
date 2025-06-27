import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TestInfoScreen from "./TestInfo";
import MedicalHistoryScreen from "./MedicalHistory";

const Tab = createMaterialTopTabNavigator();

export default function MedicalHistoryTabs() {
  return (
    <Tab.Navigator
      id={undefined}
      initialRouteName="TestInfo"
      screenOptions={{
        tabBarActiveTintColor: "#1E90FF", // xanh dương
        tabBarLabelStyle: { fontWeight: "bold", fontSize: 15 },
        tabBarIndicatorStyle: { backgroundColor: "#1E90FF", height: 3 }, // xanh dương
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarPressColor: "#fff",
        tabBarPressOpacity: 0,
      }}
    >
      <Tab.Screen
        name="TestInfo"
        component={TestInfoScreen}
        options={{ tabBarLabel: "Tra cứu xét nghiệm" }}
      />
      <Tab.Screen
        name="MedicalHistory"
        component={MedicalHistoryScreen}
        options={{ tabBarLabel: "Lịch sử khám bệnh" }}
      />
    </Tab.Navigator>
  );
}
