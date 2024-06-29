# API   (OUT-DATED)
Code de l'API utilisé au sein de Mauria

**EDIT : Ceci est le code de "l'ancienne API"
les requêtes sont les mêmes encore aujourd'hui, mais ce n'est pas la version la plus récente.
Nous nous sommes séparés de Strapi en faisant notre propre Headless CMS à l'aide de Firebase.
De ce fait, un admin panel est né et la version actuelle de l'API n'est donc plus celle là.
En revanche, encore une fois, les requêtes vers Aurion sont les mêmes.
Nous metterons à jour ce repo prochainement.**

---

## Technologies utilisées

- Express `v4.18.2`

## Structure du projet

Le repo ne contenant qu'uniquement le serveur Express, tous les fichiers sont directement visibles:
- `index.js` : contient le script de lancement du serveur
- `msg.js` et `assos.js` : contiennent le code pour appeler le serveur Strapi
- Les autres fichiers ont un nom plutôt explicite.

## Documentation

Une documentation Swagger a été mise en place pour décrire les différentes routes de l'API.

Tout est disponible [ici](https://mauriaapi.fly.dev/)

## Installation

### Prérequis

- NodeJS `v18+`
- npm *et/ou* yarn

### Installation

1. Cloner le repo
2. Se placer dans le dossier du projet : `cd app`
3. Installer les dépendances : `npm i`
4. Lancer le projet : `npm start`
5. Le projet est accessible à l'adresse suivante : `http://localhost:3000`


## Roadmap
- Mettre à jour la documentation Swagger avec des exemples de réponses
- Commenter le code (utilement et proprement)
- Passage sous TypeScript


## Contribution

Pour contribuer au projet, il faut faire un fork du repo à partir de la branche `master`.
Une fois votre fork créé, vous pouvez travailler sur votre fork
Pour proposer vos changements, vous devez faire une pull request sur la branche `master` du repo principal.

Si votre contribution est acceptée (après tests), elle sera déployée instantanément !

## License
Ce projet est sous licence GNU v3. Pour plus d'informations, voir le fichier `LICENSE` à la racine du projet.
