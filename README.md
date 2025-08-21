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
- [Virtualenv] u otro entorno virtual.

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

Dependiendo del lenguaje/framework:

- **Si es Python**:
  ```bash
  python3 -m venv venv
  source venv/bin/activate      # En Windows: `venv\Scripts\activate`
  pip install -r requirements.txt
  ```

- **Si es Node.js (por ejemplo, Express, NestJS, etc.)**:
  ```bash
  npm install
  # o alternativamente
  yarn install
  ```

### 2. Configuración (opcional)

Si el backend requiere variables de entorno (por ejemplo, un archivo `.env`), crea una copia del `.env.example` y edítala:
```bash
cp .env.example .env
# Luego edita .env según las necesidades
```

### 3. Iniciar el servidor

- **Python (Flask, Django, FastAPI)**:
  ```bash
  python app.py
  # o
  flask run
  # o
  uvicorn main:app --reload
  ```

- **Node.js**:
  ```bash
  npm start
  # o
  yarn start
  ```

Verás algo como: `Backend escuchando en http://localhost:5000` (o el puerto que corresponda).

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

### 2. Configuración (opcional)

Si hay un archivo `.env` o configuraciones, realiza los ajustes necesarios para apuntar al backend (por ejemplo, `REACT_APP_API_URL=http://localhost:5000`).

### 3. Iniciar el servidor de desarrollo

```bash
npm start
# o
yarn start
```

Esto normalmente iniciará un servidor en `http://localhost:3000`.

---

##  Flujo completo

1. En una terminal: corre el **backend**.
2. En otra terminal: corre el **frontend**.
3. Abre el navegador en `http://localhost:3000` (o el puerto configurado).
4. Interactúa con la aplicación, que se comunica con el backend.

---

##  Estructura de carpetas (ejemplo)

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

##  Solución de problemas comunes

| Problema                      | Solución sugerida |
|-------------------------------|-------------------|
| Error de dependencias         | Verifica versiones de Node/Python y reinstala paquetes |
| No arranca el backend         | Revisa variables de entorno, revisa errores de inicio |
| El frontend no conecta        | Asegura que la URL/API del backend esté correctamente configurada en `.env` |
| Puerto ocupado                | Cambia el puerto en configuración o libera el puerto actual |

---

## Próximos pasos

- Agregar scripts en `package.json` o `Makefile` para automatizar comandos.
- Documentación de API/backend (ej. endpoints disponibles).
- Pruebas unitarias o de integración (si existen).

