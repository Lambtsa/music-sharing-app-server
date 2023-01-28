#!/bin/sh

# Test the postgres db
pg_isready -d audiolinx -h localhost -p 5433 -U postgres ||
(
    echo 'The postgresql db is not ready';
    false;
)

# If everything passes...
echo '✅✅✅✅ Postgresql db is ready and connecting'
