# 🛡️ Vault-X Pro: Cyber Security Password Analyzer

Vault-X is an advanced web-based security application designed to evaluate password strength and detect credential exposure. This tool helps users move beyond simple character-set requirements by focusing on **entropy** and **real-world leak data**.

---

## 📝 Project Overview
* **Problem Statement:** 81% of data breaches are caused by weak or reused passwords. Most users rely on predictable patterns that are easily cracked by modern brute-force tools.
* **Objective:** To provide a privacy-first platform where users can assess their digital hygiene without compromising their sensitive data.
* **Solution:** A React-based application utilizing the `zxcvbn` library for realistic strength estimation and the `Have I Been Pwned` API for breach detection.

## 🚀 Core Features
- **Real-time Strength Meter:** Dynamically calculates password complexity (Score 0-4).
- **Breach Detection:** Checks if a password has appeared in known data leaks using the k-Anonymity protocol.
- **Entropy Visualization:** Displays the mathematical "bits of entropy" ($E = \log_2(R^L)$) to show true randomness.
- **Secure Generator:** Uses the `window.crypto` API (CSPRNG) to generate unbreakable, high-entropy passwords.

## 🛠️ Technical Implementation (Security Logic)

### 1. k-Anonymity Protocol (Privacy)
To ensure the user's password never leaves the browser, we implement the **k-Anonymity** model:
- The password is converted into a **SHA-1 Hash** locally.
- Only the **first 5 characters** of the hash are sent to the HIBP API.
- The API returns a list of matching prefixes, and the final comparison happens **locally** in the user's browser.
- **Result:** The full password or full hash is never exposed to the network.

### 2. Entropy vs. Complexity
Unlike standard meters that just look for "1 Uppercase/1 Number," Vault-X uses pattern matching (dictionary words, sequences, and repeat characters) to simulate how a professional cracker would approach the password.

## 💻 Installation & Setup

1. Clone the repository:
   ```bash
   git clone [https://github.com/ManupriyaSahu/vault-x-analyzer.git](https://github.com/ManupriyaSahu/vault-x-analyzer.git)