
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "../screens/DashboardScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import DeviceModelScreen from "../screens/DeviceModelScreen";
import DeviceModelListScreen from "../screens/DeviceModelListScreen";
import DeviceModelDetailScreen from "../screens/DeviceModelDetailsScreen";

export type RootStackParamList = {
  Dashboard: undefined;
  Register: undefined;
  Login: undefined;
  DeviceModel: undefined;
  DeviceModelList: undefined;
  DeviceModelDetail: { publicId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Register"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
      />

      <Stack.Screen
        name="DeviceModel"
        component={DeviceModelScreen}
      />

      <Stack.Screen
        name="DeviceModelList"
        component={DeviceModelListScreen}
      />

      <Stack.Screen
        name="DeviceModelDetail"
        component={DeviceModelDetailScreen}
      />
    </Stack.Navigator>
  );
}
