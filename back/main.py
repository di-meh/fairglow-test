from typing import Annotated, Union
from sqlmodel import Field, Session, SQLModel, create_engine, select
from fastapi import FastAPI, Depends, HTTPException
import os
import uuid

app = FastAPI()

class Todo(SQLModel , table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str
    done: bool = False

engine = create_engine(os.getenv("DATABASE_URL"))

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/todos/")
def create_todo(todo: Todo, session: SessionDep) -> Todo:
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo

@app.get("/todos/")
def read_todos(session: SessionDep):
    todos = session.exec(select(Todo)).all()
    return todos

@app.get("/todos/{todo_id}")
def read_todo(todo_id: uuid.UUID, session: SessionDep):
    todo = session.get(Todo, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: uuid.UUID, session: SessionDep):
    todo = session.get(Todo, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    session.delete(todo)
    session.commit()
    return {"ok": True}

@app.put("/todos/{todo_id}")
def update_todo(todo_id: uuid.UUID, updated_todo: Todo, session: SessionDep):
    todo = session.get(Todo, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    if updated_todo.title is not None:
        todo.title = updated_todo.title
    if updated_todo.done is not None:
        todo.done = updated_todo.done
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo