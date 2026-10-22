import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';

export interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  onRequestClose?: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onRequestClose,
}) => {
  const { theme, isDark } = useTheme();

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.dialogContainer,
                {
                  backgroundColor: isDark ? '#18181A' : '#FFFFFF',
                  borderColor: theme.subtleBorder,
                },
              ]}
            >
              <Text style={[styles.title, { color: theme.text }]}>
                {title}
              </Text>

              {message ? (
                <Text style={[styles.message, { color: theme.textSecondary }]}>
                  {message}
                </Text>
              ) : null}

              <View
                style={[
                  styles.buttonRow,
                  buttons.length > 2 && styles.buttonColumn,
                ]}
              >
                {buttons.map((btn, index) => {
                  const isDestructive = btn.style === 'destructive';
                  const isCancel = btn.style === 'cancel';

                  let btnBg = theme.buttonBackground;
                  let textColor = theme.text;

                  if (isDestructive) {
                    btnBg = theme.deleteButtonBg;
                    textColor = theme.deleteButtonText;
                  } else if (isCancel) {
                    btnBg = isDark ? '#222224' : '#EFEFF4';
                    textColor = theme.textSecondary;
                  } else {
                    btnBg = theme.primary;
                    textColor = isDark ? '#000000' : '#FFFFFF';
                  }

                  return (
                    <TouchableOpacity
                      key={`${btn.text}-${index}`}
                      activeOpacity={0.8}
                      style={[
                        styles.button,
                        { backgroundColor: btnBg },
                        buttons.length <= 2 && { flex: 1 },
                      ]}
                      onPress={() => {
                        btn.onPress?.();
                        onRequestClose?.();
                      }}
                    >
                      <Text style={[styles.buttonText, { color: textColor }]}>
                        {btn.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 17,
    fontFamily: monoFont,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontFamily: monoFont,
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  buttonColumn: {
    flexDirection: 'column',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 13,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
});

export default CustomAlert;
