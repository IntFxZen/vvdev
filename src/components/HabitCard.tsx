import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { Habit } from '../types';
import RoundCheckbox from './RoundCheckbox';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';
import { formatHabitSchedule } from '../utils/habits';

interface HabitCardProps {
  item: Habit;
  todayDate: string;
  selectionMode: boolean;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onToggle: () => void;
  onToggleSelection: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  item,
  todayDate,
  selectionMode,
  isSelected,
  onPress,
  onLongPress,
  onToggle,
  onToggleSelection,
}) => {
  const { theme } = useTheme();
  const isCompletedToday = (item.history || []).includes(todayDate);
  const formattedTitle = (item.title || '').toUpperCase().replace(/\s+/g, '_');
  const timeSubtitle = formatHabitSchedule(item);

  const cardBackground = selectionMode
    ? theme.card
    : isCompletedToday
    ? theme.cardCompleted
    : theme.cardPending;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.card,
        {
          borderWidth: 0.8,
          borderColor: selectionMode
            ? isSelected ? theme.selectedCardBorder : theme.subtleBorder
            : isCompletedToday ? theme.completedBorder : theme.subtleBorder,
          backgroundColor: cardBackground,
        },
      ]}
      onPress={() => {
        if (selectionMode) {
          onToggleSelection();
          return;
        }
        onPress();
      }}
      onLongPress={() => {
        onLongPress();
        Vibration.vibrate(10);
      }}
    >
      <View style={styles.checkboxWrapper}>
        <RoundCheckbox
          isChecked={selectionMode ? isSelected : isCompletedToday}
          variant={selectionMode ? 'delete' : 'check'}
          onPress={() => {
            if (selectionMode) {
              onToggleSelection();
              return;
            }
            onToggle();
          }}
        />
      </View>

      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          {item.emoji ? `${item.emoji} ${formattedTitle}` : formattedTitle}
        </Text>
        {timeSubtitle ? (
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            {timeSubtitle}
          </Text>
        ) : null}
      </View>

      {!selectionMode && (
        <TouchableOpacity
          style={[
            styles.statusBadge,
            {
              backgroundColor: isCompletedToday
                ? theme.doneBadgeBg
                : theme.pendingBadgeBg,
            },
          ]}
          onPress={onToggle}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.statusBadgeText,
              {
                color: isCompletedToday
                  ? theme.doneBadgeText
                  : theme.pendingBadgeText,
              },
            ]}
          >
            {isCompletedToday ? '[DONE]' : '[PENDING]'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  checkboxWrapper: {
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: monoFont,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
});

export default HabitCard;
