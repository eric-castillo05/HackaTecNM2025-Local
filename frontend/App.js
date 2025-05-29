import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StartScreen from "./Interfaces/LandingScreen";
import EmpecemosScreen from "./Interfaces/EmpecemosScreen";
import LandingScreen from "./Interfaces/LandingScreen";
import FormularioAdopScreen from "./Interfaces/FormularioAdopScreen";
import SignUp from "./Interfaces/SignUp";
import SignIn from "./Interfaces/SignIn";

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
            <Stack.Screen name="Formulario" component={FormularioAdopScreen} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="SignIn" component={SignIn} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

