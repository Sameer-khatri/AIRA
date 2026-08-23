from sqlmodel import SQLModel, create_engine
from app.config import DATABASE_URL

# connect_args = {"check_same_thread": False} is required for SQLite.
# It allows multiple threads to access the same database session.
connect_args = {"check_same_thread": False}
engine = create_engine(DATABASE_URL, connect_args=connect_args)

def init_db():
    # Import every model here so SQLModel registers their tables
    from app.models.settings import Settings  # noqa: F401
    from app.models.conversation import Conversation, Message  # noqa: F401
    SQLModel.metadata.create_all(engine)
