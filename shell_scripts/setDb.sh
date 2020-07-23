#! /bin/bash

mkdir -p test;

sqlite3 test/testDb.db << 'END_SQL'

.read sqlScripts/createTables.sql

END_SQL
