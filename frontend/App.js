import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StartScreen from "./Interfaces/LandingScreen";
import EmpecemosScreen from "./Interfaces/EmpecemosScreen";
import LandingScreen from "./Interfaces/LandingScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
              headerShown: false, // Oculta el encabezado en todas las pantallas
            }}
        >
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Empecemos" component={EmpecemosScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

