import dotenv from 'dotenv'

dotenv.config()
class Config {
  public JWT_SECRET: string
  public GATEWAT_JWT_SECRET: string
  public NODE_ENV: string
  public CLIENT_URL: string
  public AMQP_URL: string
  public ELASTICSEARCH_URL: string
  public GATEWAY_URL: string
  public RABBITMQ_URL: string
  public DB_HOST: string
  public DB_USER: string
  public DB_PASSWORD: string
  public DB_NAME: string
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || ''
    this.GATEWAT_JWT_SECRET = process.env.GATEWAT_JWT_SECRET || ''
    this.NODE_ENV = process.env.NODE_ENV || 'development'
    this.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
    this.AMQP_URL = process.env.AMQP_URL || 'amqp://localhost:5672'
    this.ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
    this.GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:8080'
    this.RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672'
    this.DB_HOST = process.env.DB_HOST || 'localhost'
    this.DB_USER = process.env.DB_USER || 'your-db-user'
    this.DB_PASSWORD = process.env.DB_PASSWORD || 'your-db-password'
    this.DB_NAME = process.env.DB_NAME || 'your-db-name'
  }
}

const config = new Config()
export default config
