# 📘 Guía Paso a Paso: Integración de Oracle Cloud Database con Wordle

Esta guía te ayudará a configurar Oracle Cloud Database para almacenar usuarios y las letras que completan por día en tu aplicación Wordle.

---

## 📋 Tabla de Contenidos

 [Requisitos Previos](#requisitos-previos)
 [Paso 1: Crear Base de Datos en Oracle Cloud](#paso-1-crear-base-de-datos-en-oracle-cloud)
 [Paso 2: Obtener Credenciales de Conexión](#paso-2-obtener-credenciales-de-conexión)
 [Paso 3: Configurar Variables de Entorno](#paso-3-configurar-variables-de-entorno)
 [Paso 4: Instalar Dependencias](#paso-4-instalar-dependencias)
 [Paso 5: Crear Esquema de Base de Datos](#paso-5-crear-esquema-de-base-de-datos)
 [Paso 6: Verificar la Conexión](#paso-6-verificar-la-conexión)
 [Paso 7: Probar la Integración](#paso-7-probar-la-integración)
 [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
 [Troubleshooting](#troubleshooting)

---

## 🔧 Requisitos Previos

- Cuenta de Oracle Cloud (puedes crear una cuenta gratuita en [oracle.com/cloud](https://www.oracle.com/cloud/))
- Python 3.7 o superior instalado
- Acceso a Oracle Cloud Console

---

## 📝 Paso 1: Crear Base de Datos en Oracle Cloud

### 1.1. Acceder a Oracle Cloud Console

1. Ve a [cloud.oracle.com](https://cloud.oracle.com)
2. Inicia sesión con tu cuenta
3. Selecciona tu región (ej: US East, EU West, etc.)

### 1.2. Crear Autonomous Database

1. En el menú principal, busca **"Oracle Database"** o **"Autonomous Database"**
2. Haz clic en **"Create Autonomous Database"**
3. Completa el formulario:

   - **Compartment**: Selecciona o crea un compartimento
   - **Display Name**: `wordle-db` (o el nombre que prefieras)
   - **Database Name**: `WORDLEDB`
   - **Workload Type**: Selecciona **"Transaction Processing"** o **"Data Warehouse"**
   - **Deployment Type**: **"Shared Infrastructure"** (gratis) o **"Dedicated"** (de pago)
   - **Always Free**: Si está disponible, marca esta opción para usar el tier gratuito
   - **Password**: Crea una contraseña segura para el usuario ADMIN (¡guárdala bien!)
   - **Network Access**: Selecciona **"Secure access from everywhere"** o configura IPs específicas

4. Haz clic en **"Create Autonomous Database"**
5. Espera 5-10 minutos mientras se crea la base de datos

### 1.3. Descargar Wallet de Conexión

1. Una vez creada la base de datos, haz clic en su nombre
2. Ve a la sección **"Connection"** o **"DB Connection"**
3. Haz clic en **"Download Wallet"**
4. Ingresa la contraseña del ADMIN nuevamente
5. Descarga el archivo ZIP del wallet
6. **Guarda este archivo en un lugar seguro** (lo necesitarás para la conexión)

---

## 🔑 Paso 2: Obtener Credenciales de Conexión

### 2.1. Información del Wallet

El archivo ZIP del wallet contiene:

- `tnsnames.ora`: Contiene el DSN (Data Source Name)
- `sqlnet.ora`: Configuración de red
- Certificados SSL

### 2.2. Extraer el DSN

1. Extrae el archivo ZIP del wallet
2. Abre el archivo `tnsnames.ora` con un editor de texto
3. Busca una línea que se vea así:
   ```
   WORDLEDB_high = (description=...)
   ```
4. El nombre antes del `=` (ej: `WORDLEDB_high`) es parte del DSN

### 2.3. Formato del DSN

El DSN completo tiene este formato:

```
hostname:port/service_name
```

Ejemplo:

```
your-instance.adb.us-ashburn-1.oraclecloud.com:1521/your_service_name_high.adb.oraclecloud.com
```

**O puedes usar el nombre del TNS directamente:**

```
WORDLEDB_high
```

Pero necesitarás configurar el wallet. Para simplificar, usa el formato completo con hostname.

### 2.4. Obtener el Hostname y Puerto

1. En Oracle Cloud Console, ve a tu Autonomous Database
2. En la sección **"Connection"**, busca **"Connection Strings"**
3. Selecciona **"TLS"** o **"TLS Authentication"**
4. Copia el **hostname** y el **puerto** (generalmente 1521)
5. El **service name** está en el formato: `your_service_name_high.adb.oraclecloud.com`

---

## 🌍 Paso 3: Configurar Variables de Entorno

### 3.1. Crear archivo `.env`

En la carpeta `WORLDE/backend/`, crea un archivo llamado `.env`:

```bash
# Oracle Cloud Database Configuration
ORACLE_USER=admin
ORACLE_PASSWORD=tu_contraseña_admin
ORACLE_DSN=hostname:port/service_name
```

**Ejemplo real:**

```bash
ORACLE_USER=admin
ORACLE_PASSWORD=MiPassword123!
ORACLE_DSN=wordledb_high.adb.us-ashburn-1.oraclecloud.com:1521/wordledb_high.adb.oraclecloud.com
```

### 3.2. Alternativa: Variables de Sistema (Windows)

```powershell
# En PowerShell
$env:ORACLE_USER="admin"
$env:ORACLE_PASSWORD="tu_contraseña"
$env:ORACLE_DSN="hostname:port/service_name"
```

### 3.3. Para Producción (Render, Heroku, etc.)

Configura las variables de entorno en el panel de tu plataforma de hosting.

---

## 📦 Paso 4: Instalar Dependencias

### 4.1. Instalar Python Dependencies

```bash
cd WORLDE/backend
pip install -r requirements.txt
```

Esto instalará:

- `oracledb==2.3.0` - Driver de Oracle para Python
- `python-jose[cryptography]` - Para JWT tokens
- `passlib[bcrypt]` - Para hash de contraseñas
- `python-multipart` - Para formularios

### 4.2. Verificar Instalación

```bash
python -c "import oracledb; print('Oracle driver instalado correctamente')"
```

---

## 🗄️ Paso 5: Crear Esquema de Base de Datos

### 5.1. Opción A: Usando SQL Developer o SQL\*Plus

1. **Descargar SQL Developer** (opcional pero recomendado):

   - Ve a [Oracle SQL Developer](https://www.oracle.com/database/sqldeveloper/)
   - Descarga e instala

2. **Conectar a la base de datos**:

   - Abre SQL Developer
   - Crea una nueva conexión:
     - **Connection Name**: Wordle DB
     - **Username**: admin
     - **Password**: tu contraseña
     - **Connection Type**: Cloud Wallet
     - **Configuration File**: Selecciona el archivo `tnsnames.ora` del wallet
     - **Service**: Selecciona el servicio (ej: `WORDLEDB_high`)

3. **Ejecutar el script SQL**:
   - Abre el archivo `WORLDE/backend/app/schema.sql`
   - Copia todo el contenido
   - Pégalo en SQL Developer
   - Ejecuta el script (F5 o botón "Run Script")

### 5.2. Opción B: Usando Python Script

Crea un archivo `WORLDE/backend/app/init_db.py`:

```python
import oracledb
import os
from database import DB_USER, DB_PASSWORD, DB_DSN

# Leer el schema SQL
with open('app/schema.sql', 'r', encoding='utf-8') as f:
    schema_sql = f.read()

# Conectar a la base de datos
conn = oracledb.connect(
    user=DB_USER,
    password=DB_PASSWORD,
    dsn=DB_DSN
)

cursor = conn.cursor()

# Ejecutar el schema (dividido por ;)
statements = schema_sql.split(';')
for statement in statements:
    statement = statement.strip()
    if statement and not statement.startswith('--'):
        try:
            cursor.execute(statement)
            print(f"✅ Ejecutado: {statement[:50]}...")
        except Exception as e:
            print(f"⚠️ Error: {e}")

conn.commit()
cursor.close()
conn.close()
print("✅ Esquema creado exitosamente")
```

Ejecuta:

```bash
python init_db.py
```

### 5.3. Verificar Tablas Creadas

Ejecuta en SQL Developer o SQL\*Plus:

```sql
SELECT table_name FROM user_tables;
```

Deberías ver:

- `USUARIOS`
- `PROGRESO_DIARIO`
- `ESTADISTICAS_LETRAS`

---

## ✅ Paso 6: Verificar la Conexión

### 6.1. Script de Prueba

Crea `WORLDE/backend/test_connection.py`:

```python
import os
import oracledb
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

DB_USER = os.getenv("ORACLE_USER")
DB_PASSWORD = os.getenv("ORACLE_PASSWORD")
DB_DSN = os.getenv("ORACLE_DSN")

try:
    conn = oracledb.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        dsn=DB_DSN
    )
    cursor = conn.cursor()
    cursor.execute("SELECT 'Conexión exitosa!' FROM dual")
    result = cursor.fetchone()
    print(f"✅ {result[0]}")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"❌ Error de conexión: {e}")
```

Ejecuta:

```bash
python test_connection.py
```

Si ves "✅ Conexión exitosa!", ¡estás listo!

---

## 🧪 Paso 7: Probar la Integración

### 7.1. Iniciar el Servidor

```bash
cd WORLDE/backend
uvicorn app.main:app --reload
```

### 7.2. Probar Endpoints

#### Registrar un Usuario

```bash
curl -X POST "http://localhost:8000/user/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

#### Login

```bash
curl -X POST "http://localhost:8000/user/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testpass123"
```

Guarda el `access_token` de la respuesta.

#### Actualizar Progreso (con letras)

```bash
curl -X POST "http://localhost:8000/user/progress" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "score": 10,
    "word": "arbol",
    "intentos": 3,
    "letras": {
      "a": 2,
      "r": 2,
      "b": 1,
      "o": 2,
      "l": 2
    }
  }'
```

#### Obtener Progreso

```bash
curl -X GET "http://localhost:8000/user/progress" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

#### Obtener Letras por Fecha

```bash
curl -X GET "http://localhost:8000/user/progress/letters/2024-01-15" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

---

## 📊 Estructura de la Base de Datos

### Tabla: `usuarios`

Almacena información de usuarios registrados.

| Columna         | Tipo          | Descripción                 |
| --------------- | ------------- | --------------------------- |
| `user_id`       | NUMBER        | ID único (auto-incremental) |
| `username`      | VARCHAR2(50)  | Nombre de usuario (único)   |
| `password_hash` | VARCHAR2(255) | Hash de la contraseña       |
| `created_at`    | TIMESTAMP     | Fecha de creación           |
| `updated_at`    | TIMESTAMP     | Última actualización        |

### Tabla: `progreso_diario`

Almacena el progreso diario de cada usuario.

| Columna              | Tipo         | Descripción                 |
| -------------------- | ------------ | --------------------------- |
| `progreso_id`        | NUMBER       | ID único (auto-incremental) |
| `user_id`            | NUMBER       | FK a usuarios               |
| `fecha`              | DATE         | Fecha del progreso          |
| `palabra_completada` | VARCHAR2(50) | Palabra completada          |
| `intentos`           | NUMBER       | Número de intentos          |
| `score`              | NUMBER       | Puntos obtenidos            |
| `letras_completadas` | CLOB         | JSON con letras y estados   |
| `created_at`         | TIMESTAMP    | Fecha de creación           |

**Constraint único**: Un usuario solo puede tener un registro por día (`user_id`, `fecha`).

### Tabla: `estadisticas_letras`

Almacena estadísticas detalladas de cada letra.

| Columna          | Tipo        | Descripción                            |
| ---------------- | ----------- | -------------------------------------- |
| `estadistica_id` | NUMBER      | ID único (auto-incremental)            |
| `user_id`        | NUMBER      | FK a usuarios                          |
| `letra`          | VARCHAR2(1) | Letra (A-Z)                            |
| `estado`         | NUMBER      | 0: incorrecta, 1: parcial, 2: correcta |
| `fecha`          | DATE        | Fecha del uso                          |
| `palabra_id`     | NUMBER      | FK a progreso_diario                   |
| `created_at`     | TIMESTAMP   | Fecha de creación                      |

---

## 🔍 Troubleshooting

### Error: "ORA-12541: TNS:no listener"

**Causa**: El DSN es incorrecto o el servicio no está disponible.

**Solución**:

1. Verifica que el DSN tenga el formato correcto: `hostname:port/service_name`
2. Asegúrate de que la base de datos esté activa en Oracle Cloud Console
3. Verifica que el puerto sea 1521 (o el correcto según tu configuración)

### Error: "ORA-01017: invalid username/password"

**Causa**: Credenciales incorrectas.

**Solución**:

1. Verifica que `ORACLE_USER` sea `admin` (o el usuario correcto)
2. Verifica que `ORACLE_PASSWORD` sea la contraseña correcta
3. Asegúrate de que no haya espacios extra en las variables de entorno

### Error: "ORA-28040: No matching authentication protocol"

**Causa**: Versión del driver incompatible.

**Solución**:

```bash
pip install --upgrade oracledb
```

### Error: "ModuleNotFoundError: No module named 'oracledb'"

**Causa**: El módulo no está instalado.

**Solución**:

```bash
pip install oracledb==2.3.0
```

### Error al crear tablas: "ORA-00955: name is already used"

**Causa**: Las tablas ya existen.

**Solución**:

```sql
DROP TABLE estadisticas_letras;
DROP TABLE progreso_diario;
DROP TABLE usuarios;
```

Luego ejecuta el schema nuevamente.

### La aplicación funciona pero no guarda datos

**Causa**: Variables de entorno no configuradas.

**Solución**:

1. Verifica que el archivo `.env` exista y tenga las variables correctas
2. Si usas `python-dotenv`, instálalo: `pip install python-dotenv`
3. Asegúrate de cargar las variables antes de usar la base de datos

---

## 📝 Notas Adicionales

### Seguridad

- **Nunca** subas el archivo `.env` a Git. Añádelo a `.gitignore`
- En producción, usa variables de entorno del sistema o un servicio de gestión de secretos
- Cambia `SECRET_KEY` en `register.py` por una clave segura generada aleatoriamente

### Optimización

- El pool de conexiones está configurado con mínimo 1 y máximo 10 conexiones
- Los índices en `user_id` y `fecha` mejoran el rendimiento de consultas
- Considera usar particionamiento por fecha si tienes muchos registros

### Escalabilidad

- Oracle Cloud Autonomous Database escala automáticamente
- El tier gratuito tiene límites (2 OCPU, 20GB storage)
- Para producción, considera un plan de pago

---

## ✅ Checklist Final

- [ ] Base de datos creada en Oracle Cloud
- [ ] Wallet descargado y guardado
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Dependencias instaladas (`pip install -r requirements.txt`)
- [ ] Esquema de base de datos creado (`schema.sql` ejecutado)
- [ ] Conexión verificada (script de prueba)
- [ ] Servidor iniciado sin errores
- [ ] Usuario registrado exitosamente
- [ ] Login funciona
- [ ] Progreso se guarda correctamente
- [ ] Letras se almacenan por día

---

## 🎉 ¡Listo!

Tu aplicación Wordle ahora está integrada con Oracle Cloud Database. Los usuarios y sus letras completadas por día se almacenan de forma persistente.

Para más información sobre Oracle Cloud Database, visita la [documentación oficial](https://docs.oracle.com/en/cloud/paas/autonomous-database/).

---

**¿Problemas?** Revisa la sección de Troubleshooting o consulta los logs del servidor para más detalles del error.
