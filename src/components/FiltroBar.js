import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const OPCOES = [
  { chave: 'hora', label: 'Última Hora' },
  { chave: 'hoje', label: 'Hoje' },
  { chave: 'tudo', label: 'Tudo' },
];

export default function FiltroBar({ selecionado, onChange }) {
  return (
    <View style={styles.row}>
      {OPCOES.map((op) => {
        const ativo = selecionado === op.chave;
        return (
          <TouchableOpacity
            key={op.chave}
            style={[styles.btn, ativo ? styles.ativo : styles.inativo]}
            onPress={() => onChange(op.chave)}
            activeOpacity={0.7}
          >
            <Text style={[styles.texto, ativo ? styles.textoAtivo : styles.textoInativo]}>
              {op.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  ativo: {
    backgroundColor: '#4DA6FF',
  },
  inativo: {
    backgroundColor: '#242424',
  },
  texto: {
    fontSize: 13,
    fontWeight: '600',
  },
  textoAtivo: {
    color: '#FFFFFF',
  },
  textoInativo: {
    color: '#999999',
  },
});
