from sqlalchemy import create_engine
from sqlalchemy.sql import text

DATABASE_URL = "postgresql://postgres:123456@localhost/postgres"

engine = create_engine(DATABASE_URL, isolation_level="AUTOCOMMIT")

with engine.connect() as conn:
    conn.execute(text("CREATE DATABASE user_info;"))

print("Database created successfully!")
