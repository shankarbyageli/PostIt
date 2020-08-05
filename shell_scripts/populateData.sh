#! /bin/bash

sqlite3 $1 << END_SQL

.read sqlScripts/createTables.sql
.mode csv
.separator '|'
.import "./data/usersData.csv" users
.import "./data/followersData.csv" followers

END_SQL
