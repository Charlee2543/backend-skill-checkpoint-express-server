// Create PostgreSQL Connection Pool here !
import * as pg from 'pg';
const { Pool } = pg.default;

const connectionPool = new Pool({
   connectionString:
      'postgresql://postgres:56789@localhost:5432/checkPointBackend',
});

export default connectionPool;
