
## Mauria API FastAPI (Python)

Il s'agit d'un projet d'exemple utilisant FastAPI en Python.

## Description

Ce projet démontre la configuration de base et l'utilisation de FastAPI, un framework web moderne et rapide (haute performance) pour la création d'API avec Python 3.7+.

Voici comment démarrer avec FastAPI : [tuto](https://dev.to/ericlecodeur/introduction-a-fastapi-python-5mf)

## Installation

1. Clonez le dépôt :

    ```bash
    git clone https://github.com/MauriaApp/API.git
    ```

2. Accédez au répertoire du projet :

    ```bash
    cd api
    ```

3. Créez un environnement virtuel :

    ```bash
    python -m venv venv
    ```

4. Activez l'environnement virtuel :

    - Pour Windows :

        ```bash
        venv\Scripts\activate
        ```

    - Pour Unix ou Linux :

        ```bash
        source venv/bin/activate
        ```

    - Pour désactiver l'environnement virtuel :

        ```bash
        deactivate
        ```

5. Installez les dépendances :

    ```bash
    pip install -r requirements.txt
    ```

## Utilisation

1. Lancez le serveur FastAPI :

    ```bash
    uvicorn main:app --reload
    ```

2. Ouvrez votre navigateur web et accédez à `http://localhost:8000/` pour accéder à l'API.

