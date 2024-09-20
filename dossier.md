# David De Ridder (202293151)

- [x] Front-end Web Development

  - https://github.com/Web-IV/2324-frontendweb-DavidDeRidder7
  - https://two324-frontendweb-davidderidder7.onrender.com

- [x] Web Services: GITHUB URL
  - https://github.com/Web-IV/2324-webservices-DavidDeRidder7
  - https://two324-webservices-davidderidder7.onrender.com

**Logingegevens**
</br>
Admin:

- e-mailadres: david.deridder@student.hogent.be
- Wachtwoord: 12345678

Gewone gebruiker:

- e-mailadres: john@gmail.com
- Wachtwoord: 12345678

## Projectbeschrijving

Ik heb een webshop gemaakt voor studenten om hun spullen door te verkopen aan nieuwe kotstudenten wanneer ze hun kot verlaten. Admins kunnen ook spullen verkopen, en de initiële producten zijn ook door een admin geplaatst. Elke gebruiker heeft een wishlist, en je kan je eigen producten natuurlijk niet kopen of op je wishlist zetten. Elk product heeft ook een categorie, en enkel admins kunnen nieuwe categorieën aanmaken.

**EERD**
[User]

- \*id
- firstName
- lastName
- email
- password_hash
- roles

[Product]

- \*id
- title
- picture
- description
- price
- bought
- +postedBy
- +categoryId

[WishlistedProduct]

- \*userId
- \*productId

[Category]

- \*id
- name

[Relations]

- User 1--\* Product
- User 1--\* WishlistedProduct
- Product 1--\* WishlistedProduct
- Category 1--\* Product

![ERD](./screenshots/erd.png)

## Screenshots

Op de hoofdpagina kunnen gebruikers alle producten zien. Je kan een product kopen, toevoegen en verwijderen uit de wishlist (als je het niet hebt gepost natuurlijk), verwijderen en wijzigen (enkel als je het hebt gepost). In de wishlist zie je al jouw gewishliste producten.

![Hoofdpagina](./screenshots/hoofdpagina.png)

In de navbar kan men alle categorieën zien, en als je op één van die categorieën klikt krijg je alle producten die tot die categorie behoren te zien.

![Categoriepagina](./screenshots/categorieProduct.png)

Je kan een product toevoegen. Het edit form heeft dezelfde fields, maar deze zijn al ingevuld.
![ProductForm](./screenshots/productform.png)
![EditProduct](./screenshots/editProduct.png)

Bij "Categories" in de navbar zie je opnieuw alle categorieën, en kan een admin ook nieuwe categorieën maken.
![categories](./screenshots/categories.png)
![addCategory](./screenshots/addCategory.png)
![resultAddCategory](./screenshots/resultAddCategory.png)

## API calls

### Gebruikers

- `GET /api/users`: alle gebruikers ophalen
- `GET /api/users/:id`: gebruiker met een bepaald id ophalen
- `DELETE /api/users/:id`: gebruiker met een bepaald id verwijderen
- `GET /api/users/me/products`: alle producten in de wishlist van de aangemelde gebruiker ophalen
- `POST /api/users/me/:productId`: product met een bepaald id in de wishlist van de aangemelde gebruiker zetten
- `DELETE /api/users/me/:productId`: product met een bepaald id verwijderen uit de wishlist van de aangemelde gebruiker
- `POST /api/users/login`: gebruiker inloggen
- `POST /api/users/register`: een nieuwe gebruiker registreren

### Producten

- `GET /api/products`: alle producten ophalen
- `GET /api/products/:id`: product met een bepaald id ophalen
- `POST /api/products`: nieuw product aanmaken
- `PUT /api/products/:id`: product met een bepaald id wijzigen
- `DELETE /api/products/:id`: product met een bepaald id verwijderen
- `PUT /api/products/buy/:id`: product met een bepaald id kopen

### Categorieën

- `GET /api/categories`: alle categorieën ophalen
- `GET /api/categories/:id`: categorie met een bepaald id ophalen
- `POST /api/categories`: nieuwe categorie aanmaken
- `GET /api/categories/:id/products`: alle producten die als categorie, de categorie met het gegeven id hebben, ophalen

## Behaalde minimumvereisten

### Front-end Web Development

- **componenten**

  - [x] heeft meerdere componenten - dom & slim (naast login/register)
  - [x] applicatie is voldoende complex
  - [x] definieert constanten (variabelen, functies en componenten) buiten de component
  - [x] minstens één form met meerdere velden met validatie (naast login/register)
  - [x] login systeem
        <br />

- **routing**

  - [x] heeft minstens 2 pagina's (naast login/register)
  - [x] routes worden afgeschermd met authenticatie en autorisatie
        <br />

- **state-management**

  - [x] meerdere API calls (naast login/register)
  - [x] degelijke foutmeldingen indien API-call faalt
  - [x] gebruikt useState enkel voor lokale state
  - [x] gebruikt gepast state management voor globale state - indien van toepassing
        <br />

- **hooks**

  - [x] gebruikt de hooks op de juiste manier
        <br />

- **varia**

  - [x] een aantal niet-triviale e2e testen
  - [x] minstens één extra technologie
  - [x] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
  - [x] duidelijke en volledige README.md
  - [x] volledig en tijdig ingediend dossier en voldoende commits

### Web Services

- **datalaag**

  - [x] voldoende complex (meer dan één tabel, 2 een-op-veel of veel-op-veel relaties)
  - [x] één module beheert de connectie + connectie wordt gesloten bij sluiten server
  - [x] heeft migraties - indien van toepassing
  - [x] heeft seeds
        <br />

- **repositorylaag**

  - #### Ik gebruik een ORM als extra dus ik had geen repository nodig

  - [ ] definieert één repository per entiteit (niet voor tussentabellen) - indien van toepassing
  - [ ] mapt OO-rijke data naar relationele tabellen en vice versa - indien van toepassing
        <br />

- **servicelaag met een zekere complexiteit**

  - [x] bevat alle domeinlogica
  - [] bevat geen SQL-queries of databank-gerelateerde code
    <br />
  - #### Ik gebruik prisma (een ORM) als extra, en heb mijn prisma queries dan ook in de servicelaag

- **REST-laag**

  - [x] meerdere routes met invoervalidatie
  - [x] degelijke foutboodschappen
  - [x] volgt de conventies van een RESTful API
  - [x] bevat geen domeinlogica
  - [x] geen API calls voor entiteiten die geen zin hebben zonder hun ouder (bvb tussentabellen)
  - [x] degelijke authorisatie/authenticatie op alle routes
        <br />

- **algemeen**

  - [x] er is een minimum aan logging voorzien
  - [x] een aantal niet-triviale integratietesten (min. 1 controller >=80% coverage)
  - [x] minstens één extra technologie
  - [x] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
  - [x] duidelijke en volledige README.md
  - [x] volledig en tijdig ingediend dossier en voldoende commits

## Projectstructuur

### Front-end Web Development

Ik heb een api map, met daarin een index.js bestand, die api calls vanuit de backend bevat. De pages voeren die api calls dan uit (ik vul hier dus de correcte url in), en geven de opgehaalde data door aan componenten, die de data weergeven, of die bepaalde calls linken aan buttons enz.
Mijn globale context (voor authenticatie) staat ook apart.

### Web Services

Ik heb de applicatie ingedeeld in een rest, service en core map. Een repository was niet nodig aangezien ik prisma, een ORM gebruik. In mijn prisma map staat mijn databank schema, die gebruikt wordt bij migrations, mijn migration history, en mijn seeding bestand.

## Extra technologie

### Front-end Web Development

Chakra UI: Een component library voor react. Dit vervangt bootstrap in mijn project. Voor heel simpele zaken gebruikte ik wel nog bootstrap (melding bij logout bv).
</br>
https://www.npmjs.com/package/@chakra-ui/react

### Web Services

Prisma: Een ORM die in mijn project Knex vervangt. Met commando's in de terminal kan je migrations en seeding uitvoeren. Om migrations uit te voeren kijkt prisma automatisch naar je schema.prisma bestand.
</br>
https://www.npmjs.com/package/prisma

## Testresultaten

### Front-end Web Development

#### addProduct

- it("should add a product"): Test of een product kan worden aangemaakt
- it("should remove a product"): Test of een product verwijdert wordt
- it("should show the error message for an invalid description"): Test of de gebruiker een error krijgt wanneer zijn input voor het description field niet lang genoeg is.
- it("should show the error message for an invalid price"): Test of de gebruiker een error krijgt wanneer zijn input voor het price field 0 of kleiner is.

#### Products

- it("should show the products"): Test of alle producten getoond worden op de hoofdpagina
- it("should show an error if the API call fails"): Test of je vanuit de backend een error krijgt als de getAll call faalt
- it("should show a loading indicator for a very slow response"): Test of je een loading indicator krijgt ipv een wit scherm wanneer de response traag is.

#### Register

- it("should throw error when user exists"): Test of je een error krijgt als je probeert te registreren met een email die al in gebruik is.

### Web Services

#### describe('GET /api/products')

- it('should 200 and return all products'): Test of alle producten opgehaald worden.
- it('should 400 when given an argument'): Test of er een error is als je een argument (id bv) probeert mee te geven aan de request.

#### describe("GET /api/products/:id")

- it("should return 200 and return the product"): test of het product met het meegegeven id opgehaald wordt.
- it('should 404 when requesting not existing product'): test of er een error is wanneer iemand een id meegeeft dat niet tot een product behoort.
- it('should 400 with invalid product id'): test of er een error is wanneer iemand ipv een id een ander argument geeft.

#### describe("POST /api/products")

- it("should 201 and return the created product"): test of het product is aangemaakt en of het response body dat product bevat.
- it("should 404 when category does not exist"): test of er een error geworpen wordt wanneer iemand een product probeert aan te maken met een categorie id dat niet bestaat.
- it("should 400 when missing title"): test of er een error geworpen wordt wanneer iemand geen titel meegeeft.
- it("should 400 when missing picture"): test of er een error geworpen wordt wanneer iemand geen afbeelding meegeeft.
- it("should 400 when missing description"): test of er een error geworpen wordt wanneer iemand geen beschrijving meegeeft.
- it("should 400 when missing price"): test of er een error geworpen wordt wanneer iemand geen prijs meegeeft.
- it("should 400 when missing categoryId"): test of er een error geworpen wordt wanneer iemand geen categorie meegeeft

#### describe("PUT /api/products/:id")

- it("should 200 and return the updated product"): Test of het product gewijzigd wordt en of het gewijzigde product in het response body staat.
- it('should 404 when updating not existing product'): Test of er een error geworpen wordt wanneer iemand als argument een id meegeeft dat niet bestaat.
- it('should 404 when category does not exist'): Test of er een error geworpen wordt wanneer iemand de categorie van een product wijzigt door een categorie die niet bestaat in te geven.

#### describe("DELETE /api/products/:id")

- it("should 204 and return nothing"): Test of het product verwijdert is en of de response body niets bevat
- it('should 404 with not existing product'): Test of er een error geworpen wordt wanneer iemand als argument een id meegeeft dat niet bestaat.
- it('should 400 with invalid product id'): test of er een error geworpen wordt wanneer iemand ipv een id een ander argument geeft.

#### describe("PUT /api/products/buy/:id")

- it("should 200 and return the bought product"): Test of het "bought" field van een product op true is gezet.
- it('should 404 with not existing product'): Test of er een error geworpen wordt wanneer iemand als argument een id meegeeft dat niet bestaat.
- it("should 404 when product already bought"): Test of er een error geworpen wordt als iemand een product probeert te kopen dat al gekocht is.
- it("should remove bought product from all user's wishlists"): Test of een product verwijdert wordt uit alle wishlists wanneer het gekocht wordt.

scripts:
![scripts](./screenshots/scripts.png)

Test databank opzetten:
![test db opzetten](./screenshots/testDBOpzettenTerminal.png)

Testen uitvoeren (ik seed de databank telkens voor de testen uitgevoerd worden):
![testen uitvoeren](./screenshots/testUitvoeren.png)

![Coverage](./screenshots/testCoverage.png)

## Gekende bugs

### Front-end Web Development

- Het inloggen duurt bij testen soms te lang, waardoor bepaalde calls falen.

### Web Services

- De eerste keer dat testen op een nieuwe test databank worden uitgevoerd falen er soms 3. Als de testen opnieuw uitgevoerd worden slagen ze wel allemaal
