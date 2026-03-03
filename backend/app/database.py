"""
Configuración y conexión a Oracle Cloud Database
"""
import oracledb
import os
from typing import Optional

# Intentar cargar variables de entorno desde .env si existe
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv no está instalado, usar variables de sistema

# Configuración de la base de datos desde variables de entorno
DB_USER = os.getenv("ORACLE_USER", "admin")
DB_PASSWORD = os.getenv("ORACLE_PASSWORD", "")
DB_DSN = os.getenv("ORACLE_DSN", "")  # Formato: hostname:port/service_name
# Ejemplo: "your-instance.adb.us-ashburn-1.oraclecloud.com:1521/your_service_name"

# Pool de conexiones
connection_pool: Optional[oracledb.ConnectionPool] = None

def init_db_pool():
    """Inicializa el pool de conexiones a Oracle"""
    global connection_pool
    try:
        connection_pool = oracledb.create_pool(
            user=DB_USER,
            password=DB_PASSWORD,
            dsn=DB_DSN,
            min=1,
            max=10,
            increment=1
        )
        print("✅ Pool de conexiones a Oracle creado exitosamente")
    except Exception as e:
        print(f"❌ Error al crear pool de conexiones: {e}")
        raise

def get_db_connection():
    """Obtiene una conexión del pool"""
    if connection_pool is None:
        init_db_pool()
    return connection_pool.acquire()

def close_db_pool():
    """Cierra el pool de conexiones"""
    global connection_pool
    if connection_pool:
        connection_pool.close()
        print("✅ Pool de conexiones cerrado")

