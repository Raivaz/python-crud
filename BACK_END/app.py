# import sys;
# sys.path.append('e:\PYTHON\PROJECTS\CRUD\BACK_END\.venv\lib\fastapi')
# print(sys.path)


from typing import Union
from fastapi import FastAPI, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from dotenv import load_dotenv #type: ignore
import os
import mysql.connector # type: ignore
import json

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


@app.get('/')
async def fetch_registers():
    cursor.execute('SELECT * FROM users')
    data = cursor.fetchall()
    return {'response': data}


@app.post('/')
async def add_register(data: dict):

    cursor.execute(f'SELECT * FROM users WHERE email="{data['email']}"')
    already_exist = cursor.fetchall()
   
    if not already_exist:
        cursor.execute(f'INSERT INTO users (name, email, password) VALUES ("{data['name']}", "{data['email']}", "{data['password']}")')
        connection.commit()
    else:
       raise HTTPException(status_code=405, detail="Email já cadastrado")
        


@app.post('/delete/{email}')  
async def delete_register(email: str):
    cursor.execute(f'DELETE FROM users WHERE email="{email}"')
    connection.commit()
    return {'email': email}
   





# cursor.close()
# connection.close()
