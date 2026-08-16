# WORLDE

Juego tipo Wordle multilingüe con frontend React/Vite y API FastAPI. Cada partida
tiene un identificador independiente; la respuesta permanece en el servidor hasta
que el jugador gana o agota sus cinco intentos.

## Requisitos

- Node.js 20 o superior.
- Python 3.10 o superior.
- Oracle solamente si se usarán cuentas y progreso.

## Desarrollo

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

El juego anónimo funciona aunque Oracle no esté configurado. Para cuentas, copia
`../.env.example` como `backend/.env`, completa las variables Oracle y ejecuta
`backend/app/schema.sql` en la base.

### Frontend

```powershell
cd frontend/client
npm ci
npm run dev
```

Vite usa `http://localhost:8000` desde `.env.development`. El build productivo usa
la URL de Render definida en `.env.production`.

## Verificación

```powershell
cd backend
.\.venv\Scripts\python -m unittest discover -s tests -v
.\.venv\Scripts\python -m compileall -q app tests

cd ../frontend/client
npm run lint
npm run build
npm audit
```

## Producción

El blueprint raíz `render.yaml` define ambos servicios. Configura en Render:

- `ORACLE_USER`, `ORACLE_PASSWORD` y `ORACLE_DSN` si se habilitan cuentas.
- `JWT_SECRET_KEY` se genera automáticamente por el blueprint.

Nunca confirmes `.env` en Git. Si una credencial fue versionada, debe rotarse;
eliminar el archivo de un commit posterior no invalida el secreto anterior.
