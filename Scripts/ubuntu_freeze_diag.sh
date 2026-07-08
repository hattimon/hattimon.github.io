#!/usr/bin/env bash
# Ubuntu 26.04 GNOME/Wayland - diagnostyka zawieszek
# Autor: Ty + AI
# Ten skrypt:
#  - zbiera logi systemd (journalctl), kernela (dmesg), /var/log
#  - zapisuje szczegółowe informacje o sprzęcie i GPU
#  - tworzy archiwum .tar.gz gotowe do wysłania / analizy
#  - daje proste menu z kolorami i instrukcjami dla mniej technicznych użytkowników

# ========= KOLORY =========
COLOR_RESET="\e[0m"
COLOR_BOLD="\e[1m"
COLOR_DIM="\e[2m"

COLOR_RED="\e[31m"
COLOR_GREEN="\e[32m"
COLOR_YELLOW="\e[33m"
COLOR_BLUE="\e[34m"
COLOR_MAGENTA="\e[35m"
COLOR_CYAN="\e[36m"

info()  { echo -e "${COLOR_CYAN}${COLOR_BOLD}[INFO]${COLOR_RESET} $*"; }
ok()    { echo -e "${COLOR_GREEN}${COLOR_BOLD}[OK]${COLOR_RESET} $*"; }
warn()  { echo -e "${COLOR_YELLOW}${COLOR_BOLD}[OSTRZEŻENIE]${COLOR_RESET} $*"; }
error() { echo -e "${COLOR_RED}${COLOR_BOLD}[BŁĄD]${COLOR_RESET} $*"; }

# ========= SPRAWDZENIE UPRAWNIEŃ =========
require_root() {
  if [[ $EUID -ne 0 ]]; then
    error "Ten skrypt musi być uruchomiony z uprawnieniami administratora (sudo)."
    echo -e "${COLOR_DIM}Przykład:${COLOR_RESET} sudo bash ubuntu_freeze_diag.sh"
    exit 1
  fi
}

# ========= ŚCIEŻKI I KONFIG =========
init_paths() {
  TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
  USERNAME_REAL="${SUDO_USER:-$USER}"
  BASE_DIR="/home/${USERNAME_REAL}/ubuntu_freeze_diag_${TIMESTAMP}"

  mkdir -p "${BASE_DIR}" || {
    error "Nie udało się utworzyć katalogu ${BASE_DIR}"
    exit 1
  }

  LOG_SYS="${BASE_DIR}/system"
  LOG_HW="${BASE_DIR}/hardware"
  LOG_DESKTOP="${BASE_DIR}/desktop"

  mkdir -p "${LOG_SYS}" "${LOG_HW}" "${LOG_DESKTOP}"

  ok "Katalog diagnostyczny: ${BASE_DIR}"
}

# ========= INFORMACJE WSTĘPNE =========
write_readme() {
  local readme="${BASE_DIR}/README_DIAG.txt"
  cat > "${readme}" <<EOF
Ubuntu Freeze Diagnostic Pack
==============================

Ten pakiet został wygenerowany przez skrypt diagnostyczny.
Zawiera logi i informacje pomocne przy analizie zawieszania się systemu
(GNOME 50, Wayland, Ubuntu 26.04 LTS).

Struktura katalogu:
- system/   → logi systemd (journalctl), dmesg, wycinki z /var/log
- hardware/ → informacje o sprzęcie, GPU, RAM, dyskach
- desktop/ → logi GNOME/GDM, listy rozszerzeń, typ sesji (Wayland/X11)

Jak użyć:
1. W przypadku kolejnego zawieszenia:
   - zapamiętaj przybliżony czas wystąpienia (np. 2026-07-08 09:05).
   - po reboocie uruchom ten skrypt ponownie, aby zebrać świeże logi.
2. Skopiuj cały katalog ubuntu_freeze_diag_YYYYMMDD_HHMMSS lub archiwum .tar.gz
   i prześlij osobie, która analizuje problem (np. na forum / do supportu).
3. NIE usuwaj tych plików, dopóki problem nie zostanie rozwiązany.

UWAGA:
- Nie ma tu żadnych haseł z Twoich aplikacji, ale logi mogą zawierać nazwy hostów,
  użytkowników i ścieżki do plików. Przed publikacją możesz przejrzeć pliki
  i ewentualnie zanonimizować wrażliwe dane.
EOF
  ok "Utworzono plik README_DIAG.txt z instrukcjami dla użytkownika."
}

# ========= ZBIERANIE LOGÓW SYSTEMOWYCH =========
collect_system_logs() {
  info "Zbieranie logów systemd (journalctl)..."
  # Bieżący boot
  journalctl -b --no-pager > "${LOG_SYS}/journal_current_boot.log" 2>&1
  # Poprzedni boot
  journalctl -b -1 --no-pager > "${LOG_SYS}/journal_previous_boot.log" 2>&1 || true
  # Tylko kernel z bieżącego bootu
  journalctl -k -b --no-pager > "${LOG_SYS}/journal_kernel_current.log" 2>&1
  # Tylko błędy i alerty (priorytety err..alert)
  journalctl -p err..alert -b --no-pager > "${LOG_SYS}/journal_errors_current.log" 2>&1

  ok "Zebrano logi systemd (journalctl)."

  info "Zbieranie logów kernela (dmesg)..."
  dmesg > "${LOG_SYS}/dmesg_full.log" 2>&1
  dmesg --level=err,warn > "${LOG_SYS}/dmesg_err_warn.log" 2>&1
  dmesg -T > "${LOG_SYS}/dmesg_human_timestamp.log" 2>&1

  ok "Zebrano logi dmesg."
}

# ========= WYCIĄGI Z /var/log =========
collect_varlog() {
  info "Zbieranie wycinków z /var/log..."

  ls -lh /var/log > "${LOG_SYS}/var_log_listing.txt" 2>&1

  if [[ -f /var/log/syslog ]]; then
    tail -n 500 /var/log/syslog > "${LOG_SYS}/syslog_tail_500.log" 2>&1
  fi

  if [[ -f /var/log/kern.log ]]; then
    tail -n 500 /var/log/kern.log > "${LOG_SYS}/kernlog_tail_500.log" 2>&1
  fi

  if [[ -f /var/log/dmesg ]]; then
    tail -n 500 /var/log/dmesg > "${LOG_SYS}/varlog_dmesg_tail_500.log" 2>&1
  fi

  ok "Zebrano kluczowe wycinki z /var/log."
}

# ========= INFORMACJE O SPRZĘCIE =========
collect_hardware_info() {
  info "Zbieranie informacji o systemie i sprzęcie..."

  {
    echo "==== Podstawowe informacje o systemie ===="
    uname -a
    echo
    echo "==== /etc/os-release ===="
    cat /etc/os-release
    echo
    echo "==== lsb_release -a ===="
    command -v lsb_release >/dev/null 2>&1 && lsb_release -a || echo "lsb_release niedostępne"
  } > "${LOG_HW}/system_info_basic.txt" 2>&1

  {
    echo "==== Informacje o CPU (lscpu) ===="
    command -v lscpu >/dev/null 2>&1 && lscpu || echo "lscpu niedostępne"
    echo
    echo "==== Informacje o pamięci (free -h, lsblk) ===="
    free -h
    echo
    lsblk
  } > "${LOG_HW}/cpu_mem_disk.txt" 2>&1

  {
    echo "==== PCI (w tym GPU) - lspci -nnk ===="
    command -v lspci >/dev/null 2>&1 && lspci -nnk || echo "lspci niedostępne"
    echo
    echo "==== Wybrane linie dla GPU (VGA/3D/Display) ===="
    command -v lspci >/dev/null 2>&1 && lspci -nnk | grep -A3 -E "(VGA|3D|Display)" || echo "Brak danych GPU."
    echo
    echo "==== Moduły kernela powiązane z GPU (lsmod | grep) ===="
    lsmod | grep -E "nvidia|nouveau|i915|amdgpu" || echo "Brak typowych modułów GPU w lsmod."
  } > "${LOG_HW}/gpu_info.txt" 2>&1

  {
    echo "==== Urządzenia USB (lsusb) ===="
    command -v lsusb >/dev/null 2>&1 && lsusb || echo "lsusb niedostępne"
  } > "${LOG_HW}/usb_devices.txt" 2>&1

  {
    echo "==== Inxi - pełny obraz sprzętu (jeśli dostępne) ===="
    if command -v inxi >/dev/null 2>&1; then
      inxi -Faz
    else
      echo "inxi nie jest zainstalowane. Można doinstalować: sudo apt install inxi"
    fi
  } > "${LOG_HW}/inxi_full.txt" 2>&1

  ok "Zebrano informacje o sprzęcie, GPU, RAM i dyskach."
}

# ========= GNOME / WAYLAND / DESKTOP =========
collect_desktop_info() {
  info "Zbieranie informacji o środowisku graficznym (GNOME/Wayland)..."

  {
    echo "==== Typ sesji i desktop ===="
    echo "XDG_SESSION_TYPE=${XDG_SESSION_TYPE}"
    echo "DESKTOP_SESSION=${DESKTOP_SESSION}"
    echo "GNOME_SESSION_XDG_SESSION_TYPE=$(gsettings get org.gnome.desktop.session session-name 2>/dev/null || echo 'brak')"
    echo
    echo "==== loginctl session-status ===="
    loginctl session-status || echo "loginctl session-status nie powiódł się."
  } > "${LOG_DESKTOP}/session_info.txt" 2>&1

  {
    echo "==== GDM / GNOME Shell - wycinki z journalctl ===="
    echo "-- journalctl -b _COMM=gdm-session-worker (ostatnie 200 linii) --"
    journalctl -b _COMM=gdm-session-worker --no-pager | tail -n 200
    echo
    echo "-- journalctl -b SYSLOG_IDENTIFIER=gnome-shell (ostatnie 200 linii) --"
    journalctl -b SYSLOG_IDENTIFIER=gnome-shell --no-pager | tail -n 200
  } > "${LOG_DESKTOP}/gdm_gnome_shell_tail.log" 2>&1

  {
    echo "==== Stan rozszerzeń GNOME ===="
    echo "disable-user-extensions:"
    gsettings get org.gnome.shell disable-user-extensions 2>/dev/null || echo "Nie udało się odczytać ustawienia."
    echo
    echo "Lista rozszerzeń (gnome-extensions list):"
    if command -v gnome-extensions >/dev/null 2>&1; then
      gnome-extensions list
    else
      echo "gnome-extensions nie jest dostępne. Możesz zainstalować: sudo apt install gnome-shell-extensions"
    fi
  } > "${LOG_DESKTOP}/gnome_extensions.txt" 2>&1

  ok "Zebrano informacje o sesji GNOME/GDM i rozszerzeniach."
}

# ========= PODSUMOWANIE SPRZĘTU W TERMINALU =========
quick_hardware_summary() {
  info "Szybkie podsumowanie sprzętu (w oparciu o zebrane dane):"

  echo -e "${COLOR_MAGENTA}${COLOR_BOLD}==== Podstawowe informacje ====${COLOR_RESET}"
  grep -E "PRETTY_NAME|VERSION" "${LOG_HW}/system_info_basic.txt" 2>/dev/null || cat "${LOG_HW}/system_info_basic.txt"

  echo -e "\n${COLOR_MAGENTA}${COLOR_BOLD}==== GPU według lspci ====${COLOR_RESET}"
  grep -E "(VGA|3D|Display)" "${LOG_HW}/gpu_info.txt" 2>/dev/null || cat "${LOG_HW}/gpu_info.txt"

  echo -e "\n${COLOR_MAGENTA}${COLOR_BOLD}==== Moduły GPU (lsmod) ====${COLOR_RESET}"
  grep -E "nvidia|nouveau|i915|amdgpu" "${LOG_HW}/gpu_info.txt" 2>/dev/null || echo "Brak typowych modułów GPU w pliku gpu_info.txt."
}

# ========= TWORZENIE ARCHIWUM =========
create_archive() {
  info "Tworzenie archiwum .tar.gz z zebranymi logami..."
  local archive="${BASE_DIR}.tar.gz"
  tar -czf "${archive}" -C "$(dirname "${BASE_DIR}")" "$(basename "${BASE_DIR}")" || {
    error "Nie udało się utworzyć archiwum ${archive}"
    return 1
  }
  ok "Utworzono archiwum: ${archive}"
  echo -e "${COLOR_DIM}Możesz je wysłać do analizy albo zachować jako backup.${COLOR_RESET}"
}

# ========= MIEJSCE NA AUTOMATYCZNĄ NAPRAWĘ =========
auto_fix_placeholder() {
  warn "Automatyczna naprawa jest na razie w trybie BEZPIECZNYM."
  echo "Ten skrypt na tym etapie:"
  echo " - NIC nie zmienia w Twoim systemie."
  echo " - Tylko zbiera logi i informacje o sprzęcie."
  echo
  echo "Po przeanalizowaniu zebranych logów możemy wspólnie:"
  echo " - przygotować skrypt naprawczy dopasowany do Twojej konfiguracji (GPU, sterowniki),"
  echo " - dodać tu opcję np. '3) Zalecana naprawa', która przed zmianami zrobi backup"
  echo "   konfiguracji GNOME / sterowników i pozwoli wrócić do stanu wyjściowego."
  echo
  echo "Na ten moment wybierz najpierw opcję '1) Zbierz logi', a potem podeślij mi"
  echo "archiwum lub kluczowe pliki z katalogu ${BASE_DIR}."
}

# ========= MENU =========
main_menu() {
  while true; do
    echo
    echo -e "${COLOR_BLUE}${COLOR_BOLD}==== Ubuntu Freeze Diagnostic Menu ==== ${COLOR_RESET}"
    echo "1) Zbierz pełne logi diagnostyczne (REKOMENDOWANE)"
    echo "2) Pokaż szybkie podsumowanie sprzętu/GPU w terminalu"
    echo "3) Utwórz archiwum .tar.gz z logami (do wysłania / backupu)"
    echo "4) Informacja o planowanej automatycznej naprawie"
    echo "0) Wyjście"
    echo
    read -rp "Wybierz opcję [0-4]: " choice

    case "${choice}" in
      1)
        collect_system_logs
        collect_varlog
        collect_hardware_info
        collect_desktop_info
        ok "Pełne logi zostały zebrane w katalogu: ${BASE_DIR}"
        ;;
      2)
        quick_hardware_summary
        ;;
      3)
        create_archive
        ;;
      4)
        auto_fix_placeholder
        ;;
      0)
        ok "Zakończono pracę skryptu. Dziękujemy za skorzystanie :)"
        break
        ;;
      *)
        warn "Nieprawidłowy wybór. Spróbuj ponownie."
        ;;
    esac
  done
}

# ========= GŁÓWNY PRZEPŁYW =========
require_root
init_paths
write_readme
main_menu
