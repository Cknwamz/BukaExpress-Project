# STORE. 🛍️

A robust, full-featured mobile E-Commerce application built with **React Native (Expo)** and **TypeScript**. This project demonstrates a complete digital shopping experience, featuring secure authentication, global state management, dark mode, and a comprehensive end-to-end testing suite with **100% code coverage**.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)

## 📱 Features

### 🛒 Shopping Experience
- **Product Discovery:** Browse products with category filtering (All, Shoes, Clothing, etc.) and real-time search.
- **Product Details:** Rich product views with image galleries, descriptions, and "Add to Cart" functionality.
- **Wishlist:** Save items for later with a persistent wishlist system.
- **Cart Management:** Add, remove, and adjust quantities with dynamic total calculation.

### 🔐 User & Security
- **Authentication Flow:** Secure Login and Sign-Up with strict form validation (Email domain checks, Password strength rules).
- **Profile Management:** Edit profile details (Name, Bio, Phone) and upload avatars.
- **Order History:** View past orders and their status (Processing/Delivered).

### ⚙️ System & UX
- **Dark Mode:** Fully supported system-wide Dark/Light theme toggle via `SettingsContext`.
- **Checkout Flow:** Integrated shipping address form and simulated payment gateway (Credit Card & Apple Pay flows).
- **Persistence:** User sessions and settings are saved locally using `AsyncStorage`.

---

## 🛠️ Tech Stack

- **Framework:** React Native (via Expo SDK)
- **Language:** TypeScript
- **State Management:** React Context API (`CartContext`, `UserContext`, `SettingsContext`)
- **Navigation:** React Navigation (Native Stack & Bottom Tabs)
- **Testing:** Jest & React Native Testing Library
- **Storage:** Async Storage
- **Networking:** Axios

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- Node.js (LTS version)
- Expo Go app on your phone (or an Android/iOS Simulator)

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/your-username/ecommerce-app.git](https://github.com/your-username/ecommerce-app.git)
   cd ecommerce-app