# 🧊 Ubuntu Freeze Diagnostic (`ubuntu_freeze_diag.sh`)

Skrypt diagnostyczny do zbierania logów i informacji o sprzęcie na Ubuntu 26.04 (GNOME 50, Wayland) w sytuacjach zawieszania się środowiska graficznego lub całego systemu.  
Wykorzystuje standardowe narzędzia systemd i Linux (`journalctl`, `dmesg`, `/var/log`, `lspci`, `lsusb`, `inxi` itd.), zgodnie z typowymi praktykami analizy logów na nowoczesnych dystrybucjach. [web:19][web:20][web:26]

---

## ✨ Co robi ten skrypt?

- 📜 Zbiera pełne logi systemowe z bieżącego i poprzedniego uruchomienia:
  - `journalctl -b`, `journalctl -b -1`
  - logi kernela: `journalctl -k`, `dmesg` w kilku wariantach.
- 💾 Zapisuje wycinki z `/var/log` (np. `syslog`, `kern.log`, `dmesg`). [web:23]
- 🧩 Zbiera szczegółowe informacje o sprzęcie:
  - CPU, RAM, dyski (`lscpu`, `free -h`, `lsblk`)
  - GPU i sterowniki (`lspci -nnk`, `lsmod`, opcjonalnie `inxi -Faz`). [web:22][web:25]
- 🖥️ Zapisuje informacje o środowisku graficznym:
  - typ sesji (Wayland/X11), GDM, GNOME Shell, rozszerzenia GNOME.
- 📦 Tworzy katalog diagnostyczny z czytelną strukturą oraz archiwum `.tar.gz` gotowe do wysłania.
- 🎛️ Posiada proste menu tekstowe z kolorami:
  - `1` – pełne zbieranie logów (**rekomendowane**),
  - `2` – szybkie podsumowanie sprzętu/GPU,
  - `3` – tworzenie archiwum `.tar.gz`,
  - `4` – informacja o planowanej automatycznej naprawie (placeholder).

> ⚠️ **Uwaga:** obecna wersja skryptu **nie modyfikuje systemu** – tylko zbiera informacje i pakuje je do katalogu / archiwum.

---

## ✅ Wymagania

- 🐧 **System:**
  - Ubuntu 26.04 lub inny Debian/Ubuntu z `systemd` i `journalctl`. [web:19]
- 🔐 **Uprawnienia:**
  - Wymagane jest uruchomienie z `sudo` (część logów i informacji o sprzęcie wymaga uprawnień administratora).
- 🛠️ **Narzędzia (standardowo dostępne na Ubuntu, ale na wszelki wypadek komendy instalacyjne):**
  - `bash`, `journalctl`, `dmesg`, `lsblk`, `lsusb`, `lspci`, `lsmod`, `loginctl`, `gsettings`.
  - Opcjonalnie: `inxi` (dla pełnego raportu sprzętowego).

---

## 🧰 Instalacja – użytkownik bez Git, curl, wget

Ten fragment jest dla osób **totalnie zielonych** w terminalu – wszystko krok po kroku.

### 1. Aktualizacja listy pakietów

Najpierw zaktualizuj listę pakietów:

```bash
sudo apt update
```

### 2. Instalacja Git (opcjonalnie)

Git nie jest wymagany do samego działania skryptu, ale ułatwia pobieranie aktualizacji z repozytorium. [web:32][web:34][web:41]

```bash
sudo apt install git
git --version
```

### 3. Instalacja curl (opcjonalnie)

Jeśli system zgłasza:

```text
curl: command not found
```

Zainstaluj curl: [web:36][web:39][web:45]

```bash
sudo apt install curl
curl --version
```

### 4. Instalacja wget (opcjonalnie)

Jeśli system zgłasza:

```text
wget: command not found
```

Zainstaluj wget: [web:37][web:40][web:43]

```bash
sudo apt install wget
wget --version
```

---

## 📥 Pobranie skryptu – kilka prostych wariantów

### 🖱️ Wariant A: ręczne skopiowanie skryptu (dla osób bez Git/curl/wget)

1. Otwórz w przeglądarce stronę z kodem skryptu (np. GitHub).
2. Skopiuj całą zawartość pliku do schowka.
3. Na maszynie z Ubuntu w terminalu wpisz:

   ```bash
   nano ubuntu_freeze_diag.sh
   ```

4. Wklej zawartość (zwykle `Ctrl+Shift+V` w terminalu).
5. Zapisz plik:
   - `Ctrl+O` → Enter,
   - `Ctrl+X` (wyjście z `nano`).

6. Nadaj prawa wykonywania:

   ```bash
   chmod +x ubuntu_freeze_diag.sh
   ```

---

### 🌐 Wariant B: pobranie przez `wget`

Jeżeli masz `wget` (albo właśnie go zainstalowałeś):

```bash
wget https://raw.githubusercontent.com/hattimon/hattimon.github.io/main/Scripts/ubuntu_freeze_diag.sh

chmod +x ubuntu_freeze_diag.sh
```

> ℹ️ Upewnij się, że adres URL odpowiada **surowej** (raw) wersji pliku w repozytorium.

---

### 🌐 Wariant C: pobranie przez `curl`

Jeśli wolisz `curl`:

```bash
curl -o ubuntu_freeze_diag.sh https://raw.githubusercontent.com/hattimon/hattimon.github.io/main/Scripts/ubuntu_freeze_diag.sh

chmod +x ubuntu_freeze_diag.sh
```

---

### 🧱 Wariant D: użycie Git (dla bardziej zaawansowanych)

Jeżeli masz Git i chcesz mieć całe repozytorium:

```bash
git clone https://github.com/hattimon/hattimon.github.io.git
cd hattimon.github.io/Scripts
chmod +x ubuntu_freeze_diag.sh
```

---

## 🚀 Szybki start (uruchomienie skryptu)

Skrypt należy uruchomić z uprawnieniami administratora:

```bash
# jeśli skrypt jest w katalogu domowym:
cd ~
sudo ./ubuntu_freeze_diag.sh
```

Po uruchomieniu zobaczysz kolorowe menu:

- `1` – **Zbierz pełne logi diagnostyczne (REKOMENDOWANE)**  
- `2` – Pokaż szybkie podsumowanie sprzętu/GPU w terminalu  
- `3` – Utwórz archiwum `.tar.gz` z logami (do wysłania / backupu)  
- `4` – Informacja o planowanej automatycznej naprawie  
- `0` – Wyjście  

---

## 🔄 Typowy scenariusz debugowania zawieszek

> 👤 Scenariusz dla „nie‐linuxowca” – krok po kroku:

1. **System się zawiesił**  
   - zapamiętaj przybliżony czas (np. „zawieszenie ok. 09:05”);
   - wymuś restart laptopa / PC.

2. **Po restarcie:**
   - otwórz terminal,
   - przejdź do katalogu, gdzie jest skrypt,
   - uruchom:

     ```bash
     sudo ./ubuntu_freeze_diag.sh
     ```

   - wybierz `1` (zbierz logi), poczekaj aż skrypt zakończy pracę;
   - wybierz `3`, aby spakować wszystko do `.tar.gz`.

3. **Analiza / wysyłka:**
   - przejrzyj pliki w katalogu diagnostycznym,
   - ewentualnie zanonimizuj dane (nazwy hostów, użytkowników),
   - wyślij archiwum lub kluczowe pliki (`journal_errors_current.log`, `gpu_info.txt`, `gdm_gnome_shell_tail.log`) do osoby, która pomoże z analizą.

---

## 📁 Gdzie trafiają zebrane dane?

Skrypt tworzy katalog w Twoim katalogu domowym, np.:

```text
/home/<użytkownik>/ubuntu_freeze_diag_20260708_091500
```

Struktura:

- `README_DIAG.txt` – krótkie wyjaśnienie zawartości i jak używać logów.
- `system/` – logi systemowe:
  - `journal_current_boot.log`
  - `journal_previous_boot.log`
  - `journal_kernel_current.log`
  - `journal_errors_current.log`
  - `dmesg_full.log`
  - `dmesg_err_warn.log`
  - `dmesg_human_timestamp.log`
  - wycinki z `/var/log` (`syslog_tail_500.log`, `kernlog_tail_500.log`, itp.). [web:19][web:23][web:26]
- `hardware/` – informacje o sprzęcie:
  - `system_info_basic.txt`
  - `cpu_mem_disk.txt`
  - `gpu_info.txt`
  - `usb_devices.txt`
  - `inxi_full.txt` (jeżeli `inxi` jest dostępne). [web:22]
- `desktop/` – informacje o środowisku graficznym:
  - `session_info.txt`
  - `gdm_gnome_shell_tail.log`
  - `gnome_extensions.txt`

Dodatkowo skrypt może utworzyć archiwum:

```text
/home/<użytkownik>/ubuntu_freeze_diag_20260708_091500.tar.gz
```

Gotowe do wysłania lub zachowania jako backup.

---

## 🛠️ Automatyczna naprawa (planowana)

Menu zawiera opcję `4`, która na ten moment **nie wykonuje żadnych zmian** w systemie – wyświetla jedynie informację, że:

- skrypt jest w trybie **bezpiecznym** (tylko zbieranie logów),
- dopiero po analizie logów zostanie przygotowana część „auto‑fix”, dopasowana do:
  - konkretnego GPU (Intel / AMD / NVIDIA),
  - wersji sterowników,
  - problemów widocznych w logach (`journalctl`, `dmesg`). [web:30]

Docelowo może się pojawić np. opcja:

- `3) Zalecana naprawa` – która:
  - wykona backup kluczowych plików konfiguracyjnych (GNOME, sterowniki),
  - spróbuje zastosować bezpieczne poprawki (np. przełączenie sterownika, wyłączenie problematycznych rozszerzeń),
  - umożliwi powrót do stanu sprzed zmian.

---

## 🤝 Wkład / modyfikacje

Jeżeli chcesz:

- dodać kolejne źródła logów,
- rozszerzyć część auto‑naprawy,
- dopasować skrypt pod inne dystrybucje (np. Mint, Fedora, Arch),

mile widziane są pull requesty z usprawnieniami.

---

## ⚖️ Zastrzeżenie

Skrypt jest narzędziem pomocniczym do diagnostyki.  
Twórcy nie ponoszą odpowiedzialności za skutki użycia – zwłaszcza przyszłej części „auto‑fix”.  
Obecna wersja **nie modyfikuje systemu**, jedynie zbiera logi i informacje, co jest względnie bezpieczne.
