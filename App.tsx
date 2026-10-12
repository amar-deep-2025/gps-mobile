
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>GPS Tracker</Text>
      <Text style={styles.subtitle}>
        Track your devices in real time
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Devices</Text>
        <Text style={styles.deviceCount}>0 Devices Connected</Text>
        <Text style={styles.status}>
          Waiting for GPS device...
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Live Location</Text>
        <Text style={styles.location}>
          Location will appear here
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
    padding: 24,
    paddingTop: 70,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#172554',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 28,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  deviceCount: {
    fontSize: 16,
    marginTop: 16,
    color: '#334155',
  },
  status: {
    fontSize: 14,
    color: '#D97706',
    marginTop: 8,
  },
  location: {
    color: '#64748B',
    marginTop: 14,
  },
});
