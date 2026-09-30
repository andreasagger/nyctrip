# Sådan lægger du NYC siden på Netlify

## Den nemme måde (alt virker, også den fælles tjekliste)

1. Hent Node.js fra nodejs.org (vælg LTS) og installer det.
2. Pak zip filen ud og åbn mappen `nyc-netlify` i Terminal.
   På Mac: højreklik på mappen og vælg "Ny Terminal ved mappe".
3. Kør de her tre linjer én ad gangen:

```
npm install
npx netlify-cli login
npx netlify-cli deploy --prod
```

4. Første gang spørger den, om du vil oprette en ny side. Vælg "Create & configure a new project" og giv den et navn, fx `nyc-2026`.
5. Til sidst får du et link, fx https://nyc-2026.netlify.app. Det er jeres side.

Laver du ændringer senere, kører du bare den sidste linje igen.

## Den hurtige måde (uden fælles tjekliste)

Gå ind på app.netlify.com/drop og træk mappen `public` ind.
Alt virker, men afkrydsninger gemmes kun på den enkelte telefon,
fordi den fælles tjekliste kræver en lille server funktion, som drag and drop ikke understøtter.

## På telefonerne

Send linket til de andre. Åbn det i Safari (iPhone) eller Chrome (Android),
og vælg Del og så "Føj til hjemmeskærm". Så åbner den som en app.

Åbn siden én gang på hotellets wifi og klik rundt på kortet i de områder I skal til.
Så virker planen og de kort I har set også uden net.

Tryk på "Find mig" på kortet og giv lov til lokalitet, så kan I se hvad der er tæt på.

Bemærk: alle med linket kan krydse af på den fælles tjekliste, så del det kun med jer fire.
