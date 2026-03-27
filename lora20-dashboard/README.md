# lora20 dashboard

Statyczny dashboard operatorski i onboardingowy do:

- `Heltec V4`
- `deploy`, `mint`, `transfer`, `config`
- konfiguracji `LoRaWAN`
- rejestracji w publicznym indexerze
- biblioteki profili mintu i kolejki `round-robin`
- listy wdrożonych tokenów, balansu i ostatnich zdarzeń
- przełączania `PL / EN`
- motywów `dark / medium / light`
- stałego dolnego panelu logów

## Co jest najważniejsze w tej wersji

- Pierwszy ekran pokazuje od razu:
  - ile tokenów jest wdrożonych
  - ile pozycji ma portfolio urządzenia
  - ile ostatnich zdarzeń indexer widzi
  - ile aktywnych profili jest w pętli
- Panel pilnuje typowych błędów logicznych:
  - `mint > limitPerMint`
  - `mint > remaining maxSupply`
  - `deploy` istniejącego tickera
  - `transfer > indexed balance`
- Panel pokazuje też ryzyka transportowe:
  - radio po resecie
  - brak `JoinEUI` / `AppKey`
  - brak licencji `Heltec`
  - uplink już czeka w kolejce

## Dlaczego wcześniej mint mógł się wyłożyć

Najważniejszy przypadek z logów był taki:

- `hardwareReady=false`
- `initialized=false`
- `joined=false`

czyli urządzenie miało zapisane dane LoRaWAN, ale po restarcie nie było jeszcze faktycznie gotowe do nadania. W nowym panelu to jest pokazane dużo wyraźniej i przed wysyłką panel:

1. odświeża stan
2. wykrywa świeży reboot
3. pilnuje join
4. czeka na enqueue uplinku zamiast udawać, że wszystko poszło

## Jak to działa

- Dashboard łączy się z Helteciem lokalnie przez `Web Serial`.
- Przygotowanie payloadu i podpis `Ed25519` dzieją się na urządzeniu.
- `lorawan_send` dzieje się na urządzeniu.
- Panel przed wysyłką weryfikuje stan radia i w razie potrzeby wykonuje `join_lorawan`.
- Profile mintu są zapisywane lokalnie w `localStorage`.
- Aktywne profile są synchronizowane do firmware jako kolejka `round-robin`.
- `Sync queue + broadcast` dodatkowo nadaje inscription `CONFIG`.
- `Deploy` pozostaje jednorazową operacją per token.
- Indexer dostarcza:
  - listę tokenów
  - balans urządzenia
  - ostatnie transakcje

## Hosting

To jest czysty statyczny frontend, więc możesz go wystawić bez builda na:

- `GitHub Pages`
- dowolnym hostingu statycznym
- lokalnym serwerze `HTTPS`

## Wymagania przeglądarki

- `Chrome` albo `Edge`
- `HTTPS` lub `localhost`

Firefox nie obsługuje `Web Serial`.

## Onboarding nowych osób

Przydatne przewodniki firmware:

- [Install PlatformIO In VS Code](https://github.com/hattimon/lora20-firmware/blob/main/docs/install-platformio-vscode.md)
- [First flash from Windows](https://github.com/hattimon/lora20-firmware/blob/main/docs/flashing-windows.md)
- [Serial API](https://github.com/hattimon/lora20-firmware/blob/main/docs/serial-api.md)

Przed połączeniem urządzenia zamknij wszystko, co może blokować port COM:

- `VS Code Serial Monitor`
- `PlatformIO Monitor`
- `MobaXterm`
- `PuTTY`
- inne terminale szeregowe

## Indexer CORS

Jeśli dashboard działa z innego originu niż indexer, ustaw w indexerze:

```env
CORS_ALLOWED_ORIGINS=https://twoj-dashboard.example.com
```

Możesz podać kilka originów po przecinku.

## Typowy flow operatora

1. Otwórz dashboard po `HTTPS`.
2. Kliknij `Connect device`.
3. Jeśli pojawi się reboot lub `ESP-ROM`, chwilę poczekaj i dopiero wtedy kliknij `Refresh`.
4. Ustaw `LoRaWAN`, jeśli trzeba.
5. Upewnij się, że panel pokazuje gotowość radia albo przynajmniej sensowny stan `join`.
6. Wybierz wdrożony token z biblioteki albo wykonaj jednorazowy `Deploy`.
7. Użyj `Mint`, `Transfer` albo `Config`.
8. Zapisz profile mintu, ustaw kolejność i zsynchronizuj je do urządzenia.

## DC i rozmiary wiadomości

Panel pokazuje prostą estymację:

- `DC ~= ceil(payloadBytes / 24)`

Przykładowo:

- `24 B` to około `1 DC`
- `51 B` to około `3 DC`
- `81 B` to około `4 DC`

To jest estymacja operacyjna do planowania kosztu uplinku, a nie rozliczenie księgowe 1:1.
