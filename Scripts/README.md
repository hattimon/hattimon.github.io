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
  - GPU i sterowniki (`lspci -nnk`, `lsmod`, opcjonalnie `inxi -Faz`).
- Zapisuje informacje o środowisku graficznym:
  - typ sesji (Wayland/X11), GDM, GNOME Shell, rozszerzenia GNOME.
- Tworzy katalog diagnostyczny z czytelną strukturą oraz archiwum `.tar.gz` gotowe do wysłania.
- Posiada proste menu tekstowe z kolorami:
  - `1` – pełne zbieranie logów (rekomendowane),
  - `2` – szybkie podsumowanie sprzętu/GPU,
  - `3` – tworzenie archiwum `.tar.gz`,
  - `4` – informacja o planowanej automatycznej naprawie (placeholder).

> **Uwaga:** na ten moment skrypt niczego nie zmienia w systemie – tylko zbiera informacje i pakuje je do katalogu / archiwum.

---

## Wymagania

- System:
  - Ubuntu 26.04 (lub inny system z `systemd` i `journalctl`).
- Uprawnienia:
  - **wymagane jest uruchomienie z `sudo`** (część logów i informacji o sprzęcie wymaga uprawnień administratora).
- Narzędzia (większość powinna być dostępna domyślnie na Ubuntu):
  - `bash`, `journalctl`, `dmesg`, `lsblk`, `lsusb`, `lspci`, `lsmod`, `loginctl`, `gsettings`
  - opcjonalnie: `inxi` (jeśli nie ma, skrypt sam zasugeruje instalację).

---

## Instalacja

### 1. Klonowanie repozytorium

Jeżeli nie masz jeszcze lokalnej kopii repozytorium:

```bash
git clone https://github.com/hattimon/hattimon.github.io.git
cd hattimon.github.io/Scripts
```

Upewnij się, że plik `ubuntu_freeze_diag.sh` znajduje się w katalogu `Scripts`:

```bash
ls
# powinieneś zobaczyć m.in.:
# ubuntu_freeze_diag.sh
```

### 2. Nadanie uprawnień do wykonywania

Nadaj skryptowi prawa wykonywania:

```bash
chmod +x ubuntu_freeze_diag.sh
```

### 3. (Opcjonalnie) instalacja `inxi`

Dla pełniejszej informacji o sprzęcie możesz zainstalować `inxi`:

```bash
sudo apt update
sudo apt install inxi
```

Skrypt zadziała także bez `inxi`, ale w pliku logów pojawi się informacja, że narzędzie nie jest dostępne.

---

## Szybki start (uruchomienie skryptu)

Skrypt należy uruchomić z uprawnieniami administratora:

```bash
cd hattimon.github.io/Scripts
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
  - wycinki z `/var/log` (`syslog_tail_500.log`, `kernlog_tail_500.log`, itp.).
- `hardware/` – informacje o sprzęcie:
  - `system_info_basic.txt`
  - `cpu_mem_disk.txt`
  - `gpu_info.txt`
  - `usb_devices.txt`
  - `inxi_full.txt` (jeżeli `inxi` jest dostępne).
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
