CREATE TABLE users (
id serial PRIMARY KEY,
first_name VARCHAR (50) NOT NULL,
last_name VARCHAR (50) NOT NULL,
email VARCHAR (255) UNIQUE NOT NULL,
password VARCHAR (255) NOT NULL,
password_create_date DATE NOT NULL DEFAULT CURRENT_DATE,
country VARCHAR (50) NOT NULL,
date_of_birth DATE NOT NULL,
account_status VARCHAR (50) NOT NULL,
account_create_date DATE NOT NULL DEFAULT CURRENT_DATE,
email_validation VARCHAR(50) NOT NULL,
gender VARCHAR (50) NOT NULL
);