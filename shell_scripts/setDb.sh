#! /bin/bash

sqlite3 $1 << END_SQL

.read sqlScripts/createTables.sql

END_SQL
