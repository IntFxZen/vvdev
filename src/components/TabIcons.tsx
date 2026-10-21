import React from 'react';
import { View, StyleSheet } from 'react-native';

export function TodayIcon({ color }: { color: string }) {
  return (
    <View style={styles.iconContainer}>
      <View style={[styles.calendarOuter, { borderColor: color }]}>
        <View style={[styles.calendarHeader, { backgroundColor: color }]} />
        <View style={styles.calendarGrid}>
          <View style={[styles.calendarDot, { backgroundColor: color }]} />
          <View style={[styles.calendarDot, { backgroundColor: color }]} />
          <View style={[styles.calendarDot, { backgroundColor: color }]} />
          <View style={[styles.calendarDot, { backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
}

export function ProgressIcon({ color }: { color: string }) {
  return (
    <View style={styles.iconContainer}>
      <View style={styles.pulseRow}>
        <View style={[styles.pulseLine, { backgroundColor: color, width: 3 }]} />
        <View style={[styles.pulsePeak, { backgroundColor: color }]} />
        <View style={[styles.pulseDip, { backgroundColor: color }]} />
        <View style={[styles.pulseLine, { backgroundColor: color, width: 3 }]} />
      </View>
    </View>
  );
}

export function SettingsIcon({ color }: { color: string }) {
  return (
    <View style={styles.iconContainer}>
      <View style={[styles.gearToothVertical, { backgroundColor: color }]} />
      <View style={[styles.gearToothHorizontal, { backgroundColor: color }]} />
      <View style={[styles.gearRing, { borderColor: color }]}>
        <View style={[styles.gearCenterDot, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Calendar
  calendarOuter: {
    width: 17,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  calendarHeader: {
    height: 4,
    width: '100%',
  },
  calendarGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 1.5,
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  calendarDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
  },
  // Progress
  pulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 18,
  },
  pulseLine: {
    height: 2,
    borderRadius: 1,
  },
  pulsePeak: {
    width: 2,
    height: 12,
    borderRadius: 1,
    marginHorizontal: 1,
  },
  pulseDip: {
    width: 2,
    height: 6,
    borderRadius: 1,
    marginHorizontal: 1,
  },
  // Settings
  gearToothVertical: {
    position: 'absolute',
    width: 2,
    height: 18,
    borderRadius: 1,
  },
  gearToothHorizontal: {
    position: 'absolute',
    height: 2,
    width: 18,
    borderRadius: 1,
  },
  gearRing: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gearCenterDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
});