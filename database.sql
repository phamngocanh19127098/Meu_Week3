CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE DATABASE meuweek2_database;


--c\ meuweek2_database

CREATE TABLE user_tables(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    verified TEXT DEFAULT 0.
   
);



CREATE TABLE user_roles(
    id uuid PRIMARY KEY,
    role TEXT NOT NULL,
   
    CONSTRAINT fk_user_userrole
      FOREIGN KEY(id) 
	  REFERENCES user_tables(id)
    
);
-- DROP TABLE user_roles;
-- DROP TABLE user_tables;
