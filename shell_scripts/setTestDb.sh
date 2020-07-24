#! /bin/bash

sqlite3 $1 << END_SQL

.read sqlScripts/createTables.sql
.read sqlScripts/insertData.sql

END_SQL