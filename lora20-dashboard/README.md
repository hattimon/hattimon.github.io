# lora20 dashboard

Statyczny dashboard do:

- `deploy`
- `mint`
- `transfer`
- `config`
- zarzadzania kluczem i backupem urzadzenia
- konfiguracji `LoRaWAN`
- lokalnej biblioteki profili mintu
- kolejek `round-robin` typu `LORA 100 -> TEST 25 -> ABCD 5` co `30 min`
- podgladu publicznego indexera

## Jak to dziala

- Dashboard laczy sie z Helteciem lokalnie przez `Web Serial`.
- Przygotowanie payloadu i podpis `Ed25519` dzieja sie na urzadzeniu.
- Wysylka `LoRaWAN` dzieje sie z urzadzenia.
- Profile mintu sa zapisywane lokalnie w `localStorage`.
- Zaznaczone profile sa synchronizowane do firmware jako kolejka `round-robin`.
- `Sync queue + broadcast` dodatkowo nadaje inscription `CONFIG` z flaga loop i interwalem.
- `Deploy` pozostaje osobna, jednorazowa operacja per token.

## Hosting

To jest czysty statyczny frontend, wiec mozesz go wrzucic bez builda na:

- `GitHub Pages`
- dowolny prosty hosting statyczny
- lokalny serwer plikow HTTPS

## Wymagania przegladarki

- `Chrome` albo `Edge`
- `HTTPS` lub `localhost`

Firefox nie obsluguje `Web Serial`.

## Indexer CORS

Jesli dashboard ma odpytac publiczny indexer z innego originu, ustaw w indexerze:

```env
CORS_ALLOWED_ORIGINS=https://twoj-dashboard.example.com
```

Mozesz podac kilka originow po przecinku.

## Typowy flow

1. Otworz dashboard po `HTTPS`.
2. Kliknij `Connect device`.
3. Zrob `Refresh`.
4. Ustaw `LoRaWAN`, jesli trzeba.
5. Uzyj `Deploy`, `Mint`, `Transfer` albo `Config`.
6. Zapisz profile mintu, ustaw kolejnosc i kliknij `Sync queue to device` albo `Sync queue + broadcast`.
