# Web Application: Clarify

This is a Personal Finance Management Web-Based Application aims to help user to better manage their daily expenses.

## Features

Login and Register
Add specific transaction
Search related transactions records
Delete certain transactions record
Update specific transactions record
Get the expense summary of specific category (in certain month) 
Set or update the monthly budget for every category
Get the status of budgets(monthly limit, category, spent, remaining)

## Tech Stack
Python, FastAPI, PostgreSQL, pytest, bcrypt, pyJWT

## Project Structure
app/routers/budgets.py --The API of set budget and get budget status
app/routers/summary.py -- The API of get the expenses summary
app/routers/transactions.py -- The API of Create, Read, Update and Delete transactions records
app/routers/users.py -- The API of user login and register

app/main.py -- The file to run this application
app/auth.py -- The API of create access token and validate the token, return access user id.
app/config.py -- All the global variables.
app/database.py --The function of connect Database and the function of initiating the database tables.
app/model.py --All the Pydantic models to collect the user, transactions, budget data.
app/validators.py --The functions of validating the user input (month)

app/tests/ --All the automated tests files to test all the features of this application.
app/tests/conftest.py -- The file needed when run pytest.
.env --Set the environment variables.

## Getting Started
1. Prerequisite: 
- Python Version 3.12+
- PostgreSQL 17+
- Git

2. Clone the repository and install dependencies

git clone https://github.com/YuxiLuoGood/clarify-python.git
cd Clarify-Python
python -m venv venv

Activate the virtual environment:

- Windows (PowerShell): venv\Scripts\Activate.ps1
- macOS / Linux: source venv/bin/activate









