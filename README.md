# Wordle

Este repositorio contiene una aplicación de Wordle organizada en dos partes principales:

- **backend**: API/recurso para la lógica del juego.
- **frontend**: Interfaz de usuario (web).

---

## Requisitos previos

Asegúrate de tener instaladas las siguientes herramientas:

- [Node.js](https://nodejs.org) (v14 o superior) — para el frontend.
- [npm](https://www.npmjs.com) o [yarn] — gestor de paquetes para Node.js.
- [Python](https://www.python.org) (v3.7 o superior) o el entorno correspondiente para el backend.

---

## Clonación del repositorio

```bash
git clone https://github.com/LuloSammartino/Wordle.git
cd Wordle
```

---

##  Backend

Entra a la carpeta del backend:

```bash
cd backend
```

### 1. Instalación de dependencias


  ```bash
  python3 -m venv venv
  source venv/bin/activate      # En Windows: `venv\Scripts\activate`
  pip install -r requirements.txt
  ```

### 2. Iniciar el servidor

- **Python (FastAPI)**:
  ```bash
  uvicorn main:app --reload
  ```

Verás algo como: `Backend escuchando en http://localhost:8000` (o el puerto que corresponda).

---

##  Frontend

Abre una nueva terminal, vuelve al directorio principal y luego entra al frontend:

```bash
cd ../frontend
```

### 1. Instalación de dependencias

```bash
npm install
# o
yarn install
```


### 2. Iniciar el servidor de desarrollo

```bash
npm run dev
# o
yarn run dev
```

Esto normalmente iniciará un servidor en `http://localhost:5173`.

---

##  Flujo completo

1. En una terminal: corre el **backend**.
2. En otra terminal: corre el **frontend**.
3. Abre el navegador en `http://localhost:5173` (o el puerto configurado).
4. Interactúa con la aplicación, que se comunica con el backend.

---

##  Estructura de carpetas 

```
Wordle/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── package.json
│   ├── src/
│   │   └── ...
│   └── .env.example
│
└── README.md  ← Este archivo
```

---



