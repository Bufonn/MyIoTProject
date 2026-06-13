import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function StatCard({ label, valor, cor, icone }) {
  const exibirValor = valor ?? '—';
  return (
    <View style={styles.card}>
      <Icon name={icone} size={22} color={cor} />
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.valor, { color: cor }]}>{exibirValor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    color: '#999999',
    fontSize: 12,
    marginTop: 8,
  },
  valor: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
