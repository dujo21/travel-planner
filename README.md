Planer za putovanje



Web aplikacija za planiranje putovanja

Predmet: Primena veb programiranja u infrastrukturnim sistemima



\## Tehnologije

\- Frontend: React(Vite)

\- Backend: Microsoft Service Fabric, ASP.NET Core, mikroservisna arhitektura

\- Baza: Microsoft SQL Server, EF Core migracije



\## Preduslovi

\- Windows, .NET 8 SDK, Node.js (LTS)

\- Visual Studio 2022 sa Service Fabric alatima

\- SQL Server 2022 Express (instanca SQLEXPRESS), SSMS

\- Service Fabric SDK + Runtime, lokalni klaster



\## Pokretanje

1\. Baza — servisi rade pod nalogom NETWORK SERVICE, pa pokreni docs/setup-database.sql u SSMS-u da dodeliš prava. Baze i tabele se kreiraju automatski kroz EF Core migracije pri prvom pokretanju.



2\. Backend — otvori TravelPlanner.sln u Visual Studio-u kao administrator, startup projekat TravelPlanner.ServiceFabric, pritisni F5. Sačekaj da servisi budu Healthy u Service Fabric Explorer-u (http://localhost:19080/Explorer).



3\. Frontend — u zasebnom terminalu:

cd frontend/travelplanner.client

copy .env.example .env

npm install

npm run dev



Otvori http://localhost:5173. Backend mora biti pokrenut pre frontenda.



\## Portovi

UserService 8944 · TripService 8638 · ExpenseService 8865 · Frontend 5173 · SF Explorer 19080

Swagger: /swagger na svakom servisu.



\## Test nalozi

\- Admin: admin@travelplanner.com / Admin123!

\- Korisnik: korisnik@travelplanner.com / Korisnik123!

