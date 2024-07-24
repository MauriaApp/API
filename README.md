# API 
Code de l'API utilisé au sein de Mauria

## Technologies utilisées

- Client : ViteJS (React) + TypeScript + FlowBite React
- Serveur : ExpressJS + Firebase

## Structure du projet

Le repo est divisé en deux parties : `client` et `server`.

### Client

Le côté client est le nouveau front de l'API Mauria permettant une modification plus simple et rapide des données contenues dans Mauria (via Firebase).

### Server

Même fonction qu'avant, mais avec une meilleure gestion des erreurs et des logs. Le serveur est hébergé sur Fly.io et est accessible à l'adresse suivante : `https://mauriaapi.fly.dev/`


## Documentation

Une documentation Swagger a été mise en place pour décrire les différentes routes de l'API.

Tout est disponible [ici](https://mauriaapi.fly.dev/docs)

## Installation

### Prérequis

- NodeJS `v18+`
- npm *et/ou* yarn
- La clé d'API Firebase (à demander à un admin)

### Installation

1. Cloner le repo
2. Se placer dans le dossier du projet : `cd app`
3. Installer les dépendances : `npm i`
4. Lancer le projet : `npm start`
5. Le projet sera accessible à l'adresse indiqué dans la console. 


## Roadmap

- Mise en place de l'API Aurion x Mauria pour éviter le scrapping et permettre plus de sécurité. (discussion en cours)


## Contribution

Pour contribuer au projet, il faut faire un fork du repo à partir de la branche `master`.
Une fois votre fork créé, vous pouvez travailler sur votre fork
Pour proposer vos changements, vous devez faire une pull request sur la branche `master` du repo principal.

Si votre contribution est acceptée (après tests), elle sera déployée instantanément !

## License
Ce projet est sous licence GNU v3. Pour plus d'informations, voir le fichier `LICENSE` à la racine du projet.
