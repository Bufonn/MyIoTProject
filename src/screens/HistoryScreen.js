import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { buscarHistorico, limparHistorico } from '../services/appCrud';

const ICON_MAP = {
  temp: { icon: 'thermometer', color: '#E74C3C', label: 'Temperatura', unit: '°C' },
  umid: { icon: 'water-percent', color: '#3498DB', label: 'Umidade', unit: '%' },
  luz:  { icon: 'lightbulb-on', color: '#F1C40F', label: 'Luz', unit: '' },
};

function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

function formatValor(tipo, valor) {
  if (tipo === 'luz') return valor === '1' || valor === 1 ? 'Ligada' : 'Desligada';
  return `${valor}${ICON_MAP[tipo]?.unit ?? ''}`;
}

export default function HistoryScreen({ onBack }) {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    const dados = await buscarHistorico(100);
    setRegistros(dados);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleLimpar = () => {
    Alert.alert(
      'Limpar Histórico',
      'Deseja apagar todos os registros?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await limparHistorico();
            await carregar();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const meta = ICON_MAP[item.tipo] ?? { icon: 'help-circle', color: '#888', label: item.tipo, unit: '' };
    return (
      <View style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: meta.color + '22' }]}>
          <Icon name={meta.icon} size={28} color={meta.color} />
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardLabel}>{meta.label}</Text>
          <Text style={styles.cardTime}>{formatTimestamp(item.timestamp)}</Text>
        </View>
        <Text style={[styles.cardValue, { color: meta.color }]}>
          {formatValor(item.tipo, item.valor)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Histórico</Text>
        <TouchableOpacity onPress={handleLimpar} style={styles.clearBtn} activeOpacity={0.7}>
          <Icon name="trash-can-outline" size={22} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#3498DB" size="large" style={{ marginTop: 60 }} />
      ) : registros.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="database-off-outline" size={60} color="#444" />
          <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
          <Text style={styles.emptySubText}>Os dados recebidos via MQTT{'\n'}aparecerão aqui automaticamente.</Text>
        </View>
      ) : (
        <FlatList
          data={registros}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); carregar(); }}
              tintColor="#3498DB"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backBtn: {
    padding: 4,
  },
  title: {
    flex: 1,
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 14,
  },
  clearBtn: {
    padding: 4,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardLabel: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  cardTime: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#555',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubText: {
    color: '#444',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
