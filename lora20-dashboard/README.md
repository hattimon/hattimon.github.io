# lora20 dashboard

Statyczny dashboard do:

- `deploy`
- `mint`
- `transfer`
- `config`
- zarzadzania kluczem i backupem urzadzenia
- konfiguracji `LoRaWAN`
- lokalnych profili auto-mint typu `LORA mint 100 co 30 min`
- podgladu publicznego indexera

## Jak to dziala

- Dashboard laczy sie z Helteciem lokalnie przez `Web Serial`.
- Przygotowanie payloadu i podpis `Ed25519` dzieja sie na urzadzeniu.
- Wysylka `LoRaWAN` dzieje sie z urzadzenia.
- Profile auto-mint sa zapisywane lokalnie w `localStorage`.
- Po kliknieciu `Apply` dashboard wgrywa profil do lokalnej konfiguracji firmware.
- Po kliknieciu `Apply + broadcast` dashboard dodatkowo nadaje inscription `CONFIG`.

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
6. Zapisz profil auto-mint i kliknij `Apply` lub `Apply + broadcast`.
