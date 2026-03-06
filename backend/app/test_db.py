import os
import oracledb
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("ORACLE_USER")
DB_PASSWORD = os.getenv("ORACLE_PASSWORD")
DB_DSN = os.getenv("ORACLE_DSN")
wallet_path = os.getenv("WALLET_PATH")
wallet_password = os.getenv("WALLET_PWD")

try:

    connection = oracledb.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        dsn=DB_DSN,
        config_dir=wallet_path,
        wallet_location=wallet_path,
        wallet_password=wallet_password
    )

    print("✅ Conexión exitosa con Wallet!")

    with connection.cursor() as cursor:
        cursor.execute("SELECT 'Hola desde la nube' FROM dual")
        print(cursor.fetchone()[0])

except Exception as e:
    print(f"❌ Error al conectar: {e}")