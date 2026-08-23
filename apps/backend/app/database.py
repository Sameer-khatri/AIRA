from sqlmodel import SQLModel, create_engine
from app.config import DATABASE_URL

# connect_args = {"check_same_thread": False} is required for SQLite.
# It allows multiple threads to access the same database session.
connect_args = {"check_same_thread": False}
engine = create_engine(DATABASE_URL, connect_args=connect_args)

def init_db():
    # This imports all models so they are registered with SQLModel metadata
    from app.models.settings import Settings
    SQLModel.metadata.create_all(engine)
