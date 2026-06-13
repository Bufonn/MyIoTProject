import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { buscarHistorico } from '../services/appCrud';
import { filtrarPorPeriodo, statsTemperatura, statsUmidade, contagemLampada, serieTemperatura, serieUmidade } from '../utils/analytics';
import FiltroBar from '../components/FiltroBar';
import StatCard from '../components/StatCard';
import GraficoLinha from '../components/GraficoLinha';

export default function AnalyticsScreen({ onBack }) {
  const [filtro, setFiltro] = useState('hoje');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const dados = await buscarHistorico(500);
      setEntries(dados);
      setLoading(false);
    })();
  }, [filtro]);

  const filtrados = useMemo(() => filtrarPorPeriodo(entries, filtro), [entries, filtro]);

  const tempStats = useMemo(() => statsTemperatura(filtrados), [filtrados]);
  const umidStats = useMemo(() => statsUmidade(filtrados), [filtrados]);
  const qtdLampada = useMemo(() => contagemLampada(filtrados), [filtrados]);
  const serieTemp = useMemo(() => serieTemperatura(filtrados), [filtrados]);
  const serieUmid = useMemo(() => serieUmidade(filtrados), [filtrados]);

  const formatStat = (val, suffix) => (val === '—' ? '—' : Number(val).toFixed(1) + suffix);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Gráficos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.filtroWrap}>
          <FiltroBar selecionado={filtro} onChange={setFiltro} />
        </View>

        {loading ? (
          <ActivityIndicator color="#4DA6FF" size="large" style={{ marginTop: 60 }} />
        ) : (
          <>
            <View style={styles.cardsGrid}>
              <View style={styles.cardRow}>
                <StatCard
                  label="Média Temp"
                  valor={formatStat(tempStats.media, '°C')}
                  cor="#FF6B6B"
                  icone="thermometer-outline"
                />
                <StatCard
                  label="Média Umidade"
                  valor={formatStat(umidStats.media, '%')}
                  cor="#4DA6FF"
                  icone="water-outline"
                />
              </View>
              <View style={styles.cardRow}>
                <StatCard
                  label="Máx / Mín Temp"
                  valor={
                    tempStats.max === '—'
                      ? '—'
                      : Number(tempStats.max).toFixed(1) + '° / ' + Number(tempStats.min).toFixed(1) + '°'
                  }
                  cor="#FF6B6B"
                  icone="stats-chart-outline"
                />
                <StatCard
                  label="Lâmpada ligada"
                  valor={qtdLampada + 'x'}
                  cor="#FFD700"
                  icone="bulb-outline"
                />
              </View>
            </View>

            <GraficoLinha
              titulo="Temperatura ao longo do tempo"
              dados={serieTemp.dados}
              labels={serieTemp.labels}
              cor="#FF6B6B"
              unidade="°C"
            />
            <GraficoLinha
              titulo="Umidade ao longo do tempo"
              dados={serieUmid.dados}
              labels={serieUmid.labels}
              cor="#4DA6FF"
              unidade="%"
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
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
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  filtroWrap: {
    marginBottom: 20,
  },
  cardsGrid: {
    gap: 10,
    marginBottom: 24,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
