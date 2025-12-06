import mysql, { RowDataPacket } from 'mysql2/promise';

// Create connection pool (lazy initialization)
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    // Database configuration - read from environment variables at runtime
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'defaultdb',
      port: parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // SSL configuration for Aiven and other cloud databases
      ssl: process.env.DB_SSL_MODE === 'REQUIRED' ? {
        rejectUnauthorized: false, // For Aiven, we accept their certificate
      } : undefined,
    };
    
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Helper function to execute queries
export async function query<T = unknown>(
  sql: string,
  params?: unknown[]
): Promise<T> {
  const connection = await getPool().getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results as T;
  } finally {
    connection.release();
  }
}

// Helper function for transactions
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Close pool (useful for cleanup)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Initialize database tables
export async function initializeTables(): Promise<void> {
  const connection = await getPool().getConnection();
  
  try {
    // Create order_head table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_head (
        OrderNo INT AUTO_INCREMENT PRIMARY KEY,
        OrderDate VARCHAR(20),
        CustomerName VARCHAR(255),
        CustomerMobileNo VARCHAR(20),
        PartyOrderNo VARCHAR(100),
        PartyOrderDate VARCHAR(20),
        DueDate VARCHAR(20),
        Measurement VARCHAR(10),
        Remarks TEXT,
        TotalOrderPiece INT,
        TotalOrderWeight DECIMAL(10,3),
        JobStatus VARCHAR(50),
        ModuleEntryCode VARCHAR(50),
        CompanyId INT,
        FinancialPeriod VARCHAR(10),
        UserId_UserHead INT,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create order_detail table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_detail (
        AutoIncrement INT AUTO_INCREMENT PRIMARY KEY,
        OrderNo INT,
        Sno INT,
        ProductName VARCHAR(255),
        Width VARCHAR(20),
        Length VARCHAR(20),
        Flop VARCHAR(20),
        Gauge VARCHAR(20),
        NoOfBackColors VARCHAR(50),
        NoOfFrontColors VARCHAR(50),
        Remarks TEXT,
        OrderPiece VARCHAR(20),
        OrderWeight VARCHAR(20),
        RequiredWeight DECIMAL(10,3),
        RateFor VARCHAR(20),
        Rate VARCHAR(20),
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (OrderNo) REFERENCES order_head(OrderNo) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create products table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        ProductId INT AUTO_INCREMENT PRIMARY KEY,
        ProductName VARCHAR(255) UNIQUE,
        Description TEXT,
        IsActive BOOLEAN DEFAULT TRUE,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create customers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        CustomerId INT AUTO_INCREMENT PRIMARY KEY,
        CustomerName VARCHAR(255),
        MobileNo VARCHAR(20),
        Address TEXT,
        IsActive BOOLEAN DEFAULT TRUE,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create measurements table (for dropdown options)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS measurements (
        MeasurementId INT AUTO_INCREMENT PRIMARY KEY,
        MeasurementName VARCHAR(50) UNIQUE,
        IsActive BOOLEAN DEFAULT TRUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Insert default measurements if table is empty
    const [measurements] = await connection.execute(
      'SELECT COUNT(*) as count FROM measurements'
    );
    
    if ((measurements as RowDataPacket[])[0].count === 0) {
      await connection.execute(`
        INSERT INTO measurements (MeasurementName) VALUES 
        ('INCH'), ('CM'), ('MM'), ('METER')
      `);
    }

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Drop all tables (use with caution!)
export async function dropAllTables(): Promise<void> {
  const connection = await getPool().getConnection();
  
  try {
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    await connection.execute('DROP TABLE IF EXISTS order_detail');
    await connection.execute('DROP TABLE IF EXISTS order_head');
    await connection.execute('DROP TABLE IF EXISTS products');
    await connection.execute('DROP TABLE IF EXISTS customers');
    await connection.execute('DROP TABLE IF EXISTS measurements');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('All tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  } finally {
    connection.release();
  }
}
