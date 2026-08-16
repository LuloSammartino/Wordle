"""Manual Oracle connectivity check; it does not run during test discovery."""

from .database import get_db_connection


def main():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 'Conexión exitosa' FROM dual")
            print(cursor.fetchone()[0])
    finally:
        connection.close()


if __name__ == "__main__":
    main()
