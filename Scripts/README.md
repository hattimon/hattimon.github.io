# Ubuntu Freeze Diagnostic (`ubuntu_freeze_diag.sh`)

Skrypt diagnostyczny do zbierania logów i informacji o sprzęcie na Ubuntu 26.04 (GNOME 50, Wayland) w sytuacjach zawieszania się środowiska graficznego lub całego systemu.  
Wykorzystuje standardowe narzędzia systemd i Linux (`journalctl`, `dmesg`, `/var/log`, `lspci`, `lsusb`, `inxi` itd.), zgodnie z typowymi praktykami analizy logów na nowoczesnych dystrybucjach. [web:19][web:20][web:26]

---

## Funkcje skryptu

- Zbiera pełne logi systemowe z bieżącego i poprzedniego uruchomienia:
  - `journalctl -b`, `journalctl -b -1`
  - logi kernela: `journalctl -k`, `dmesg` w kilku wariantach.
- Zapisuje wycinki z `/var/log` (np. `syslog`, `kern.log`, `dmesg`).
- Zbiera szczegółowe informacje o sprzęcie:
  - CPU, RAM, dyski (`lscpu`, `free -h`, `lsblk`)
  - GPU i sterowniki (`lspci -nnk`, `lsmod`, opcjonalnie `inxi -Faz`). [web:22][web:25]
- Zapisuje informacje o środowisku graficznym:
  - typ sesji (Wayland/X11), GDM, GNOME Shell, rozszerzenia GNOME.
- Tworzy katalog diagnostyczny z czytelną strukturą oraz archiwum `.tar.gz` gotowe do wysłania.
- Posiada proste menu tekstowe z kolorami:
  - `1` – pełne zbieranie logów (rekomendowane),
  - `2` – szybkie podsumowanie sprzętu/GPU,
  - `3` – tworzenie archiwum `.tar.gz`,
  - `4` – informacja o planowanej automatycznej naprawie (placeholder).

> **Uwaga:** obecna wersja skryptu **nie modyfikuje systemu** – tylko zbiera informacje i pakuje je do katalogu / archiwum.

---

## Wymagania

- System:
  - Ubuntu 26.04 lub inny Debian/Ubuntu z `systemd` i `journalctl`. [web:19]
- Uprawnienia:
  - **Wymagane jest uruchomienie z `sudo`** (część logów i informacji o sprzęcie wymaga uprawnień administratora).
- Narzędzia (standardowo dostępne na Ubuntu, ale na wszelki wypadek podane komendy instalacyjne):
  - `bash`, `journalctl`, `dmesg`, `lsblk`, `lsusb`, `lspci`, `lsmod`, `loginctl`, `gsettings`.
  - opcjonalnie: `inxi` (dla pełnego raportu sprzętowego).

---

## Instalacja – użytkownik bez Git, curl, wget

Jeśli **nie masz zainstalowanego gita / curl / wget**, możesz:

1. Zainstalować potrzebne narzędzia przez `apt`.
2. Albo skopiować zawartość skryptu ręcznie do pliku.

### 1. Aktualizacja listy pakietów

Najpierw zaktualizuj listę pakietów:

```bash
sudo apt update
```

### 2. Instalacja Git (opcjonalnie, jeśli chcesz używać repozytorium)

Git nie jest wymagany do samego działania skryptu, ale ułatwia pobieranie aktualizacji. [web:31][web:34][web:41]

```bash
sudo apt install git
# Sprawdzenie wersji:
git --version
```

### 3. Instalacja curl (opcjonalnie, jeśli chcesz pobierać pliki przez HTTP)

Jeśli system zgłasza: `curl: command not found`, możesz go zainstalować: [web:36][web:39][web:45]

```bash
sudo apt install curl
# Sprawdzenie wersji:
curl --version
```

### 4. Instalacja wget (opcjonalnie, jeśli wolisz wget zamiast curl)

Jeśli system zgłasza: `wget: command not found`, możesz go zainstalować: [web:37][web:40][web:43]

```bash
sudo apt install wget
# Sprawdzenie:
wget --version
```

---

## Pobranie skryptu – kilka wariantów

### Wariant A: ręczne skopiowanie skryptu (najprostsze)

1. Otwórz stronę z kodem skryptu w przeglądarce (np. GitHub).
2. Skopiuj całą zawartość do schowka.
3. Na maszynie z Ubuntu w terminalu wykonaj:

```bash
nano ubuntu_freeze_diag.sh
```

4. Wklej zawartość (np. `Ctrl+Shift+V` w terminalu).
5. Zapisz plik w `nano` (`Ctrl+O`, Enter, potem `Ctrl+X`).

6. Nadaj prawa wykonywania:

```bash
chmod +x ubuntu_freeze_diag.sh
```

Gotowe – możesz przejść do sekcji „Szybki start”.

---

### Wariant B: pobranie przez wget

Jeżeli masz `wget` (albo go właśnie zainstalowałeś):

```bash
# w katalogu, w którym chcesz mieć skrypt:
wget https://raw.githubusercontent.com/hattimon/hattimon.github.io/main/Scripts/ubuntu_freeze_diag.sh

chmod +x ubuntu_freeze_diag.sh
```

Adres URL musisz dopasować do rzeczywistej ścieżki pliku w repozytorium (raw plik z GitHub).

---

### Wariant C: pobranie przez curl

Jeśli wolisz `curl`:

```bash
curl -o ubuntu_freeze_diag.sh https://raw.githubusercontent.com/hattimon/hattimon.github.io/main/Scripts/ubuntu_freeze_diag.sh

chmod +x ubuntu_freeze_diag.sh
```

---

### Wariant D: użycie Git (dla zaawansowanych)

Jeżeli masz git i chcesz mieć całe repozytorium:

```bash
git clone https://github.com/hattimon/hattimon.github.io.git
cd hattimon.github.io/Scripts
chmod +x ubuntu_freeze_diag.sh
```

---

## Szybki start (uruchomienie skryptu)

Skrypt należy uruchomić z uprawnieniami administratora:

```bash
# jeśli skrypt leży np. w katalogu domowym:
cd ~
sudo ./ubuntu_freeze_diag.sh
```

Po uruchomieniu zobaczysz kolorowe menu:

- `1` – **Zbierz pełne logi diagnostyczne (REKOMENDOWANE)**  
- `2` – Pokaż szybkie podsumowanie sprzętu/GPU w terminalu  
- `3` – Utwórz archiwum `.tar.gz` z logami (do wysłania / backupu)  
- `4` – Informacja o planowanej automatycznej naprawie  
- `0` – Wyjście  

Najczęstszy scenariusz:

1. Wybierz opcję `1`, żeby skrypt zebrał pełny zestaw logów i informacji.
2. Następnie wybierz opcję `3`, aby utworzyć archiwum `.tar.gz`.
3. Archiwum możesz dołączyć do zgłoszenia na forum / GitHub issue / wysłać osobie analizującej problem.

---

## Gdzie trafiają zebrane dane?

Skrypt tworzy katalog w Twoim katalogu domowym, np.:

```text
/home/<użytkownik>/ubuntu_freeze_diag_20260708_091500
```

W środku znajdziesz m.in.:

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

## Typowy workflow przy debugowaniu zawieszek

1. **Wystąpiło zawieszenie:**  
   - zapamiętaj przybliżony czas (np. „zawieszenie koło 09:05”);
   - zrestartuj laptop / PC.

2. **Po restarcie:**  
   - uruchom `sudo ./ubuntu_freeze_diag.sh`;  
   - wybierz `1` (zbierz logi), poczekaj aż skrypt zakończy pracę;  
   - wybierz `3`, aby spakować wszystko do `.tar.gz`.

3. **Analiza / wysyłka:**  
   - przejrzyj pliki w katalogu diagnostycznym, ewentualnie zanonimizuj dane (nazwy hostów, użytkowników);
   - wyślij archiwum lub kluczowe pliki (`journal_errors_current.log`, `gpu_info.txt`, `gdm_gnome_shell_tail.log`) do osoby, która pomoże z analizą.

---

## Automatyczna naprawa (planowana)

Menu zawiera opcję `4`, która na ten moment **nie wykonuje żadnych zmian** w systemie – wyświetla jedynie informację, że:

- skrypt jest w trybie **bezpiecznym** (tylko zbieranie logów),
- dopiero po analizie logów zostanie przygotowana część „auto‑fix”, dopasowana do:
  - konkretnego GPU (Intel / AMD / NVIDIA),
  - wersji sterowników,
  - problemów widocznych w logach (`journalctl`, `dmesg`).

Docelowo może się pojawić np. opcja:

- `3) Zalecana naprawa` – która:
  - wykona backup kluczowych plików konfiguracyjnych (GNOME, sterowniki),
  - spróbuje zastosować bezpieczne poprawki (np. przełączenie sterownika, wyłączenie problematycznych rozszerzeń),
  - umożliwi powrót do stanu sprzed zmian.

---

## Wkład / modyfikacje

Jeżeli chcesz:

- dodać kolejne źródła logów,
- rozszerzyć część auto‑naprawy,
- dopasować skrypt pod inne dystrybucje (np. Mint, Fedora, Arch),

możesz edytować `ubuntu_freeze_diag.sh` i zgłosić pull request w tym repozytorium.

---

## Zastrzeżenie

Skrypt jest narzędziem pomocniczym do diagnostyki.  
Twórcy nie ponoszą odpowiedzialności za skutki użycia – zwłaszcza przyszłej części „auto‑fix”.  
Obecna wersja **nie modyfikuje systemu**, jedynie zbiera logi i informacje, co jest względnie bezpieczne.
