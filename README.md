# Expenzz 💳 - Smart Expense Management

**Expenzz** is a modern, cross-platform mobile application designed to help users track their personal and group expenses efficiently. Built with React Native and Expo, it offers a seamless experience for managing budgets, wallets, and shared bills with friends.

---

## ✨ Key Features

### 📊 Expense Tracking
- **Personal Expenses**: Easily log daily transactions and categorize them.
- **Visual Analytics**: View spending patterns and activity history via the Dashboard.
- **Multiple Wallets**: Manage different sources of funds separately.

### 👥 Group Expenses & Settlements
- **Create Groups**: Organize expenses with friends, family, or roommates.
- **Shared Bills**: Add expenses to groups and split them automatically.
- **Settlements**: Track who owes whom and simplify payments.
- **Add Friends**: Connect with others via email or manual entry.

### 💰 Budgeting & Bills
- **Budget Management**: Set monthly or category-wise budgets to curb overspending.
- **Bill Reminders**: Keep track of upcoming bills and payments.

### 🔒 Secure Authentication
- **Multiple Login Methods**: Sign in via Email/Password, Google, or OTP.
- **Secure Handling**: Powered by Firebase Auth for robust security.

---

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) / [React Native](https://reactnative.dev/)
- **Language**: TypeScript
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS) & [Gluestack UI](https://gluestack.io/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Database/Auth**: [Firebase](https://firebase.google.com/)
- **UI Components**: Reanimated, Flash-list, FontAwesome

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [npm](https://www.npmjs.com/)
- [Expo Go](https://expo.dev/client) app on your mobile device (to test wirelessly)
- (Optional) Android Studio or Xcode for local emulators

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Akshat-Soni02/ExpenseTracker_mobile.git
   cd ExpenseTracker_mobile/ExpenseTracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the `ExpenseTracker` directory and add your Firebase and API keys:
   ```env
   # Example environment variables
   FIREBASE_API_KEY=your_api_key
   ...
   ```

---

## 📱 App Usage Instructions

1. **Start the development server**:
   ```bash
   npx expo start
   ```

2. **Run on a device/emulator**:
   - Press `i` for iOS Simulator.
   - Press `a` for Android Emulator.
   - Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS) to run on a physical device.

3. **Navigate through the app**:
   - **Dashboard**: Home tab for overview of expenses.
   - **Groups**: Manage shared expenses and friends.
   - **Bills**: Track and pay your upcoming bills.
   - **Activity**: History of all your transactions.