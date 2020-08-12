#! /bin/bash

sqlite3 $1 << END_SQL

.read sqlScripts/insertData.sql

END_SQL