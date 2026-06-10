// Datafil som exporterar en strukturerad resume för Robin Jörgensen.
// Innehåller fälten `profile`, `skills` och `experience` (alla som strängar),
// så att testet i Micro‑Step 2.1/2.2 kan validera innehållet.

const myResume = {
	profile: `Robin Jörgensen - Fullstack JavaScript-utvecklare. Kontakt: Timgatan 16, 415 31 Göteborg | 070-424 00 72 | robjor88@gmail.com. Jag har praktisk erfarenhet från storskaliga projekt på Volvo Group, med fokus på modern frontend-arkitektur och skalbara webblösningar samt god vana att arbeta i agila team.`,

	skills: `JavaScript (ES6+), TypeScript, React, Module Federation (Micro Frontends), HTML5, CSS3, Tailwind CSS, Node.js, Express, REST API, SQL, NoSQL, Git, GitHub, Gerrit, Jira, AWS, Adobe Analytics, Jest, Supertest, CI/CD`,

	experience: `Fullstackutvecklare (LIA) | Volvo Group (Göteborg, Jan 2026 – Pågående): utvecklat och underhållit enterprise frontend-applikationer i React, arbetat med Module Federation och implementerat interna designsystemet Kingbolt. Tidigare Teamledare & Skadedjurstekniker | Nomor AB (2015–2024) samt roller inom plåtslageri och lokalvård.`,

	// `raw` innehåller dokumentets exakta text (utdragen från CV_Robin_Jorgensen.docx)
	raw: `Robin Jörgensen
Timgatan 16, 415 31 Göteborg  |  070-424 00 72  |  robjor88@gmail.com
Mål & Profil
Fullstack JavaScript-utvecklare med praktisk erfarenhet från storskaliga projekt på Volvo Group. Kombinationen av teknisk problemlösning och en stark förmåga att arbeta metodiskt i agila team utgör min grund. Mitt fokus ligger på modern frontend-arkitektur och att bygga skalbara webblösningar med hög kodkvalitet.
Tekniska Färdigheter
Programmeringsspråk: JavaScript (ES6+), TypeScript
Frontend & Web: HTML5, CSS3, React, Module Federation (Micro Frontends)
Designsystem: Kingbolt Component Library (Volvos interna designsystem)
Backend & Databaser: Node.js, Express, REST API:er, SQL och NoSQL-databaser
Verktyg & Versionshantering: Git, GitHub, Gerrit, Jira, Trello
Molntjänster & Analys: AWS, Adobe Analytics
Metodiker: Agila metoder, Scrum
Arbetslivserfarenhet
Fullstackutvecklare (LIA)  |  Volvo Group
Göteborg  |  Januari 2026 – Pågående
Enterprise Frontend: Utvecklat och underhållit komplexa webbapplikationer i en storskalig Enterprise-miljö med primärt fokus på React.
Micro Frontends: Navigerat och utvecklat i en modern arkitektur baserad på Module Federation distribuerat över flera sammanlänkade repositories.
Designsystem & UI: Implementerat tillgängliga och enhetliga gränssnitt med hjälp av Volvos interna designsystem Kingbolt.
Kodkvalitet & CI/CD: Ansvarat för avancerad versionshantering, löst komplexa branch-konflikter och utfört grundliga kodgranskningar (Code Reviews) i Gerrit.
Analys-integration: Implementerat och kvalitetssäkrat dataspårning genom integration med Adobe Analytics för att mäta användarbeteende.
Agilt Teamarbete: Deltagit aktivt i Scrum-processer, bidragit till Jira-story breakdowns och samarbetat tätt med Daily Process Managers (DPM) och internationella teammedlemmar.
Teamledare & Skadedjurstekniker  |  Nomor AB
2015 – 2024
Erfarenhet av ledarskap, kundhantering, resursplanering och koordinering av team. Övergick till rollen som skadedjurstekniker från och med 2018 efter att ha initierat min anställning inom kundtjänst och support 2015.
Övriga anställningar
Plåtslagare (LW Plåt), Lokalvårdare (Anderssons Städ), Telefonförsäljare (Vendator).
Utbildning
JavaScript-utvecklare  |  Folkuniversitetet
Göteborg  |  2024 – 2026-06-12
Slutfört en gedigen tvåårig högre yrkesutbildning (YH) med fokus på modern fullstack-utveckling. Erhållit högsta betyg (Väl Godkänt - VG) i samtliga kärnkurser:
• HTML & CSS (G)  • JavaScript (VG)  • TypeScript (VG)  • Agila metoder (VG)  • Frontend-ramverk (React) (VG)  • Backend-grunder (VG)  • Databaser (VG)  • Backend-fördjupning (VG)  • CI/CD och Deployment (VG)
Övriga utbildningar
• Snickare  |  Star Byggutbildning, Borlänge (2010 – 2011)
• Elprogrammet  |  Lugnet Gymnasiet, Falun (2005 – 2008)
Språk & Övrigt
Svenska: Modersmål.
Engelska: Flytande i tal och skrift (professionell arbetsnivå efter LIA i en internationell miljö).
Körkort: Innehar B-körkort.
`
};

export default myResume;
