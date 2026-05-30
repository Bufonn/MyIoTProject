import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

export default class MQTTService {
  constructor() {
    this.client = null;
  }

  /**
   * @param {object} config - { host, port, path, user, pass, clientId }
   * @param {function} onMessage  - (topic, message) => void
   * @param {function} onConnect  - () => void
   * @param {function} onFailure  - (err) => void
   */
  
  connectBroker(config, onMessage, onConnect, onFailure) {
    const { host, port, path, user, pass, clientId } = config;

    this.client = new Paho.MQTT.Client(host, port, path, clientId);

    this.client.onMessageArrived = (message) => {
      onMessage(message.destinationName, message.payloadString);
    };

    this.client.onConnectionLost = (response) => {
      if (response.errorCode !== 0) {
        console.warn('[MQTT] Conexão perdida:', response.errorMessage);
      }
    };

    const options = {
      userName: user,
      password: pass,
      useSSL: true,
      onSuccess: onConnect,
      onFailure: onFailure,
      timeout: 3,
      keepAliveInterval: 60,
    };

    this.client.connect(options);
  }

  subscribe(topic) {
    if (this.client) this.client.subscribe(topic);
  }

  publish(topic, message) {
    if (!this.client) return;
    const msg = new Paho.MQTT.Message(message);
    msg.destinationName = topic;
    this.client.send(msg);
  }

  disconnect() {
    try {
      if (this.client && this.client.isConnected()) {
        this.client.disconnect();
      }
    } catch (_) {}
  }
}
