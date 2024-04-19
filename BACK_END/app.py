from typing import Union
from fastapi import FastAPI, HTTPException, UploadFile, File # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from dotenv import load_dotenv #type: ignore
import os
import mysql.connector # type: ignore
import json
import pandas as pd # type: ignore
from sqlalchemy import create_engine

load_dotenv()


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_methods=['*'],
    allow_headers=['*'],
    allow_credentials=True,
    allow_origins=[os.environ['FRONT_END_URL']]
)

connection = mysql.connector.connect(
    host = os.environ['URL_DATABASE'],
    user = os.environ['USER_DATABASE'],
    password = os.environ['PASSWORD_DATABASE'],
    database = os.environ['DATABASE']
)

cursor = connection.cursor()

#carregar 
@app.get('/')
async def fetch_registers():
    cursor.execute('SELECT * FROM users')
    data = cursor.fetchall()
    return {'response': data}



#castrar
@app.post('/')
async def add_register(data: dict = {}):
    
    cursor.execute(f'SELECT * FROM users WHERE email="{data['email']}"')
    already_exist = cursor.fetchall()
   
    if not already_exist:
        cursor.execute(f'INSERT INTO users (name, email, password) VALUES ("{data['name']}", "{data['email']}", "{data['password']}")')
        connection.commit()
        cursor.execute(f'SELECT * FROM users WHERE email="{data['email']}"')
        return {'response': cursor.fetchall()}
    else:
       raise HTTPException(status_code=405, detail="Email já cadastrado")
        

#deletar
@app.post('/delete/{id}')  
async def delete_register(id: int):
    cursor.execute(f'DELETE FROM users WHERE id={id}')
    connection.commit()
   
   
#editar
@app.post('/id/{id}')
async def edit_register(id: int, data: dict):
    cursor.execute(f'UPDATE users SET name="{data['name']}", email="{data['email']}", password="{data['password']}"  WHERE id={id}')
    connection.commit()
    
#import
@app.post('/import')
def import_register(data: UploadFile = File(...)):
    engine = create_engine(f'mysql://{os.environ['USER_DATABASE']}:{os.environ['PASSWORD_DATABASE']}@{os.environ['URL_DATABASE']}/{os.environ['DATABASE']}')
    tabela = pd.read_excel(data.file)
    tabela.to_sql('users', con=engine, if_exists='append', index=False)
    

    # for i in tabela.itertuples(index=False):
    #     cursor.execute(f'INSERT INTO users (name, email, password) VALUES ("{i.name}", "{i.mail}", "{i.password}")')
    #     connection.commit()
  




