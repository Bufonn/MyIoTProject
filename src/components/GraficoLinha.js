import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const largura = Dimensions.get('window').width - 32;

export default function GraficoLinha({ titulo, dados, labels, cor, unidade }) {
  if (!dados || dados.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>{titulo}</Text>
        <View style={styles.vazio}>
          <Text style={styles.textoVazio}>Sem dados para o período</Text>
        </View>
      </View>
    );
  }

  const exibirLabels =
    labels.length > 10
      ? labels.map((l, i) =>
          i % Math.ceil(labels.length / 8) === 0 ? l : ''
        )
      : labels;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      <LineChart
        data={{
          labels: exibirLabels,
          datasets: [{ data: dados }],
        }}
        width={largura}
        height={180}
        chartConfig={{
          backgroundColor: '#1A1A1A',
          backgroundGradientFrom: '#1A1A1A',
          backgroundGradientTo: '#242424',
          decimalPlaces: 1,
          color: (opacity = 1) =>
            `${cor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
          labelColor: () => '#999999',
          propsForDots: { r: '3', strokeWidth: '1', stroke: cor },
        }}
        bezier
        style={{ borderRadius: 12 }}
        withInnerLines={false}
        withOuterLines={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  vazio: {
    height: 180,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoVazio: {
    color: '#555555',
    fontSize: 14,
  },
});
