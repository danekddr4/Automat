# Drinkomat - Chytrý Automat na Nápoje 🥤

Tento projekt obsahuje kompletní řešení pro automat na nápoje ovládaný přes webové rozhraní s platbou přes Stripe a hardwarem postaveným na ESP32.

## 📂 Struktura složek (Co kam patří)

- **`/` (Hlavní složka)** - Zde je backend server (`server.js`) a webové stránky (`index.html`, `style.css`, obrázky). Toto nahrajte na hosting nebo spusťte na PC.
- **`/firmware`** - Zde je kód pro čip ESP32 (`esp32_firmware.ino`). Toto se nahrává do mikrokontroléru.
- **`.env`** - (Skrytý soubor) Zde jsou vaše tajné API klíče. **Tento soubor NIKDY nenahrávejte na GitHub!**

---

## 🚀 Návod na zprovoznění

### 1. Backend a Web (Server)
Toto běží na počítači nebo serveru, ke kterému se ESP32 připojuje.

1.  **Nainstalujte Node.js**: Stáhněte a nainstalujte z [nodejs.org](https://nodejs.org/).
2.  **Otevřete terminál** ve složce projektu.
3.  **Nainstalujte závislosti**:
    ```bash
    npm install
    ```
4.  **Nastavte API klíče**:
    *   Otevřete soubor `.env`.
    *   Zaregistrujte se na [Stripe Dashboard](https://dashboard.stripe.com/).
    *   Zkopírujte své testovací klíče (`pk_test_...` a `sk_test_...`) do souboru `.env`.
    *   *(Volitelné)* Pro webhooky nastavte i `STRIPE_WEBHOOK_SECRET`.
5.  **Spusťte server**:
    ```bash
    npm start
    ```
    Web nyní běží na `http://localhost:3000`.

### 2. Hardware (ESP32)
Toto ovládá relé (motory) automatu.

1.  Stáhněte a nainstalujte **Arduino IDE**.
2.  Otevřete soubor `firmware/esp32_firmware.ino`.
3.  **Nainstalujte knihovny** (Menu -> Sketch -> Include Library -> Manage Libraries):
    *   `ArduinoJson`
    *   `WiFiManager` (od tzapu)
4.  **Nastavte adresu serveru**:
    *   V kódu najděte řádek `const char* serverUrl = ...`.
    *   Pokud server běží na vašem PC, musíte zjistit jeho IP adresu (v příkazovém řádku napište `ipconfig`).
    *   Přepište adresu např. na `http://192.168.1.15:3000/api/poll`.
5.  **Nahrajte do ESP32**.
6.  **Připojení k WiFi**:
    *   Po zapnutí ESP32 vytvoří WiFi síť `DrinkomatAP`.
    *   Připojte se k ní mobilem/PC.
    *   Otevře se stránka (nebo jděte na 192.168.4.1) a nastavte svou domácí WiFi.

## ⚠️ Důležité poznámky

*   **API Klíče**: V souboru `.env` jsou nyní pouze "placeholdery" (ukázkové texty). Aby platby fungovaly, **musíte tam vložit své skutečné klíče ze Stripe!**
*   **Veřejná IP**: Pokud chcete, aby automat fungoval odkudkoliv (nejen doma na WiFi), musíte backend nahrát na veřejný hosting (např. Railway, Heroku, VPS) a upravit adresu v ESP32.
