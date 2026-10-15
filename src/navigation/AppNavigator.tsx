import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import DeviceModelScreen from "../screens/DeviceModelScreen";
import DeviceModelListScreen from "../screens/DeviceModelListScreen";
import DeviceModelDetailScreen from "../screens/DeviceModelDetailsScreen";
import DeviceListScreen from "../screens/DeviceListScreen";
import AddDeviceScreen from "../screens/AddDeviceScreen";
import DeviceDetailScreen from "../screens/DeviceDetailScreen";

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Login: undefined;
  Dashboard: undefined;
  DeviceModel: undefined;
  DeviceModelList: undefined;
  DeviceModelDetail: { publicId: string };
  DeviceList: undefined;
  AddDevice: undefined;
  DeviceDetail: { publicId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="DeviceModel" component={DeviceModelScreen} />
      <Stack.Screen
        name="DeviceModelList"
        component={DeviceModelListScreen}
      />
      <Stack.Screen
        name="DeviceModelDetail"
        component={DeviceModelDetailScreen}
      />
      <Stack.Screen name="DeviceList" component={DeviceListScreen} />
      <Stack.Screen name="AddDevice" component={AddDeviceScreen} />
      <Stack.Screen name="DeviceDetail" component={DeviceDetailScreen} />
    </Stack.Navigator>
  );
}