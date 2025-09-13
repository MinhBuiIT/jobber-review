import { createLogger } from '@minhbuiit/jobber-shared'
import { Pool } from 'pg'
import config from './config'

const logger = createLogger('info', 'review-service-postgres', config.ELASTICSEARCH_URL as string)

const createTableText = `
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL UNIQUE PRIMARY KEY,
  gigId text NOT NULL,
  reviewerId text NOT NULL,
  orderId text NOT NULL,
  sellerId text NOT NULL,
  rating integer default 0 NOT NULL,
  review text NOT NULL,
  reviewerUsername text NOT NULL,
  reviewerImage text NOT NULL,
  country text NOT NULL,
  reviewType text NOT NULL,
  createdAt timestamp default CURRENT_DATE NOT NULL
);
CREATE INDEX IF NOT EXISTS gigId_index ON reviews(gigId);
CREATE INDEX IF NOT EXISTS seller_index ON reviews(sellerId);
`

class Database {
  private pool: Pool | null = null

  constructor() {
    this.init()
  }

  public async connect(): Promise<void> {
    let isConnected = false
    let retryCount = 0
    const maxRetries = 5

    while (!isConnected && retryCount < maxRetries) {
      try {
        await this.pool?.connect()

        logger.info('Postgres connection has been established successfully')

        await this.pool?.query(createTableText)
        this.pool?.on('error', (err) => {
          logger.error('Unexpected error on idle client', err)
          process.exit(-1)
        })
        isConnected = true
      } catch (error) {
        logger.log('error', 'Postgres connection error from review-service', error)
        logger.log('info', 'Retrying to connect to Postgres...')

        await new Promise((resolve) => setTimeout(resolve, 5000)) // Retry after 5 seconds
      } finally {
        retryCount++
      }
    }
  }

  public getPool(): Pool {
    return this.pool as Pool
  }

  public init() {
    if (this.pool) {
      return this.pool
    } else {
      this.pool = new Pool({
        host: config.DB_HOST,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_NAME,
        port: 5432,
        max: 11 // max number of clients in the pool
      })
    }
  }
}

const database = new Database()
export default database
