# ⚡ HabitTracker — React Native Habit Tracker App

Современное мобильное приложение для трекинга ежедневных привычек, разработанное на React Native с фокусом на высокую производительность, минималистичный дизайн и удобство использования.

---

## 🚀 Основной функционал

1. **Главный экран со списком привычек (`HomeScreen`)**:
   - Отображение привычек с динамической датой, эмодзи, временем и статусом (`[DONE]` / `[PENDING]`).
   - Подсчет текущего стрика (`STREAK`) и прогресса за день (`DONE TODAY`).
   - Поисковая строка (`Search habits`) и быстрая фильтрация по статусам (`ALL`, `DONE`, `PENDING`).
   - Режим мультивыбора (по долгому нажатию) для удобного удаления привычек.

2. **Экран создания привычки (`AddHabitScreen`)**:
   - Обязательное поле названия с автоматической валидацией и защитой от дубликатов.
   - Выбор эмодзи (с ограничением в один символ).
   - **Нативный выбор времени (`REMINDER_TIME`)**: встроенный системный аналоговый/цифровой циферблат часов (`@react-native-community/datetimepicker`).
   - Переключатель целевой длительности (`TARGET_DURATION`).

3. **История и детали привычки (`HabitDetailsScreen`)**:
   - Статистика выполнений (всего дней и % за последние 35 дней).
   - **Календарная сетка активности (Activity Heatmap)** за 35 дней с цветовой градацией интенсивности.
   - Лог истории (`// HISTORY_LOG`) с возможностью интерактивного изменения статуса за любую прошлую дату.

4. **Темная и светлая темы**:
   - Переключение темы в один клик.
   - Фирменная моноширинная типографика **Lilex** (с уникальной точкой внутри нулей `0`), подключенная нативно под iOS и Android.

5. **Сверхбыстрое локальное хранилище**:
   - Хранение всех данных в **MMKV** (`react-native-mmkv`), работающем на C++ JSI без накладных расходов JS-моста.

---

## 🛠 Технический стек

- **Framework**: React Native 0.88 (React Native CLI)
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack)
- **Storage**: MMKV (`react-native-mmkv`)
- **Native TimePicker**: `@react-native-community/datetimepicker`
- **Typography**: Lilex Font
- **State Management**: React Hooks & Context API (`ThemeContext`)

---

## 📱 Инструкция по запуску

### Предварительные требования
- Node.js >= 22
- Android Studio / Android SDK (для Android)
- Xcode (для iOS)

### Установка зависимостей

```bash
npm install
```

### Запуск Metro Bundler

```bash
npm start
```

### Запуск на Android

```bash
npm run android
```

### Запуск на iOS

```bash
cd ios && pod install && cd ..
npm run ios
```
