import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import MQTTService from './src/services/mqttService';
import StatusModal from './src/components/StatusModal';
import LightControl from './src/components/LightControl';
import Gauges from './src/components/Gauges';
import HistoryScreen from './src/screens/HistoryScreen';
import { salvarHistorico } from './src/services/appCrud';

const mqtt = new MQTTService();

export default function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'history'
  const [isConnected, setIsConnected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);

  const mqttConfig = {
    host: process.env.EXPO_PUBLIC_MQTT_HOST,
    port: parseInt(process.env.EXPO_PUBLIC_MQTT_PORT),
    path: process.env.EXPO_PUBLIC_MQTT_PATH,
    user: process.env.EXPO_PUBLIC_MQTT_USER,
    pass: process.env.EXPO_PUBLIC_MQTT_PASS,
    clientId: 'RN_App_' + Math.random().toString(16).slice(2),
  };

  useEffect(() => {
    startConnection();
    return () => mqtt.disconnect();
  }, []);

  const startConnection = () => {
    setShowError(false);
    mqtt.connectBroker(
      mqttConfig,
      // onMessage: atualiza estado E persiste no json-server
      async (topic, message) => {
        if (topic === 'casa/temp') {
          const val = parseFloat(message);
          setTemp(val);
          await salvarHistorico('temp', val);
        }
        if (topic === 'casa/umid') {
          const val = parseFloat(message);
          setHum(val);
          await salvarHistorico('umid', val);
        }
        if (topic === 'casa/luz') {
          setIsLightOn(message === '1');
          await salvarHistorico('luz', message);
        }
      },
      // onConnect
      () => {
        setIsConnected(true);
        mqtt.subscribe('casa/temp');
        mqtt.subscribe('casa/umid');
        mqtt.subscribe('casa/luz');
      },
      // onFailure
      () => {
        setIsConnected(false);
        setShowError(true);
      }
    );
  };

  const toggleLight = () => {
    const newState = isLightOn ? '0' : '1';
    mqtt.publish('casa/luz', newState);
  };

  if (screen === 'history') {
    return <HistoryScreen onBack={() => setScreen('home')} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Smart Home IoT</Text>

        <View style={styles.headerRight}>
          {/* Indicador de conexão */}
          <View style={[styles.dot, { backgroundColor: isConnected ? '#27AE60' : '#E74C3C' }]} />

          {/* Botão Histórico */}
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => setScreen('history')}
            activeOpacity={0.7}
          >
            <Icon name="history" size={20} color="#FFF" />
            <Text style={styles.historyBtnText}>Histórico</Text>
          </TouchableOpacity>
        </View>
      </View>

      <LightControl isLightOn={isLightOn} onToggle={toggleLight} />

      <Gauges temp={temp} hum={hum} />

      <StatusModal
        visible={showError}
        onRetry={startConnection}
        onLater={() => setShowError(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 50,
    marginBottom: 20,
  },
  header: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  historyBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
