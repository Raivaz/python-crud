# import sys;
# sys.path.append('e:\PYTHON\PROJECTS\CRUD\BACK_END\.venv\lib\fastapi')
# print(sys.path)


from typing import Union
from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from dotenv import load_dotenv #type: ignore
import os
import mysql.connector

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


async def read_root():

    data = [
        {
            'name': 'Raí vaz',
            'email': 'email@email.com',
            'password': 12345678
        },
        {
            'name': 'João vaz',
            'email': 'email@email.com',
            'password': 8888888
        }
    ]
    
    
@app.get('/')
async def fetch_registers():
    cursor.execute('SELECT * FROM users')
    data = cursor.fetchall()
    return {'response': data}



def add_register():
    name = 'Adão vaz de oliveira'
    email = 'Adão@email.com'
    password = 123456789
 
    cursor.execute(f'INSERT INTO users (name, email, password) VALUES ("{name}", "{email}", {password})')
    connection.commit()


   

fetch_registers()


# cursor.close()
# connection.close()
