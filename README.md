# NodeJS Typescript Usługa pobierania obrazków

## Uruchamianie

1. Pobranie wszystkich wymaganych modułów

> npm install

2. Przetworzenie kodu źródłowego TypeScript

> npm run build

3. Uruchomienie serwera

> npm start

## Endpointy

- [GET] /  -> zwraca szablon strony do testowania usługi
- [GET] /images/ -> zwraca listę pobranych obrazków w postaci JSON
- [GET] /images/?imageId -> zwraca konkretny obrazek, bądź informację o jego stanie
- [POST] /images/ BODY:{url:string} -> dodawanie nowego obrazka do kolejki, zwraca url do pobranego obrazka

## Informacje

Kolejka pobierania obrazków jest zapisywana do pliku queue.json z częstotliwością 1 na 60s