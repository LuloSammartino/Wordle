"""
Script de prueba para verificar la conexión a Oracle Cloud Database
"""
import os
import sys

# Intentar cargar variables de entorno desde .env
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("✅ Archivo .env cargado")
except ImportError:
    print("⚠️ python-dotenv no instalado, usando variables de sistema")
except Exception as e:
    print(f"⚠️ No se pudo cargar .env: {e}")

try:
    import oracledb
    print("✅ Módulo oracledb importado correctamente")
except ImportError:
    print("❌ Error: oracledb no está instalado")
    print("   Ejecuta: pip install oracledb==2.3.0")
    sys.exit(1)

# Obtener variables de entorno
DB_USER = os.getenv("ORACLE_USER", "admin")
DB_PASSWORD = os.getenv("ORACLE_PASSWORD", "")
DB_DSN = os.getenv("ORACLE_DSN", "")

print("\n📋 Configuración:")
print(f"   Usuario: {DB_USER}")
print(f"   DSN: {DB_DSN[:50]}..." if len(DB_DSN) > 50 else f"   DSN: {DB_DSN}")
print(f"   Contraseña: {'*' * len(DB_PASSWORD) if DB_PASSWORD else 'NO CONFIGURADA'}")

if not DB_PASSWORD or not DB_DSN:
    print("\n❌ Error: Variables de entorno no configuradas")
    print("   Asegúrate de tener configuradas:")
    print("   - ORACLE_USER")
    print("   - ORACLE_PASSWORD")
    print("   - ORACLE_DSN")
    sys.exit(1)

print("\n🔌 Intentando conectar...")

try:
    conn = oracledb.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        dsn=DB_DSN
    )
    print("✅ Conexión exitosa!")
    
    cursor = conn.cursor()
    
    # Probar consulta simple
    cursor.execute("SELECT 'Conexión a Oracle Cloud Database exitosa!' as mensaje FROM dual")
    result = cursor.fetchone()
    print(f"✅ {result[0]}")
    
    # Verificar versión de Oracle
    cursor.execute("SELECT banner FROM v$version WHERE banner LIKE 'Oracle%'")
    version = cursor.fetchone()
    if version:
        print(f"✅ Versión: {version[0]}")
    
    # Verificar tablas
    cursor.execute("""
        SELECT table_name 
        FROM user_tables 
        WHERE table_name IN ('USUARIOS', 'PROGRESO_DIARIO', 'ESTADISTICAS_LETRAS')
        ORDER BY table_name
    """)
    tables = cursor.fetchall()
    
    if tables:
        print("\n✅ Tablas encontradas:")
        for table in tables:
            print(f"   - {table[0]}")
    else:
        print("\n⚠️ Advertencia: No se encontraron las tablas del esquema")
        print("   Ejecuta el script schema.sql para crear las tablas")
    
    cursor.close()
    conn.close()
    print("\n✅ Prueba completada exitosamente!")
    
except oracledb.Error as e:
    error, = e.args
    print(f"\n❌ Error de Oracle: {error.message}")
    print(f"   Código: {error.code}")
    sys.exit(1)
except Exception as e:
    print(f"\n❌ Error inesperado: {e}")
    sys.exit(1)


