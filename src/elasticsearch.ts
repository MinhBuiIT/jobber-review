import { Client } from '@elastic/elasticsearch'
import { createLogger } from '@minhbuiit/jobber-shared'
import config from '@review/config'

const logger = createLogger('info', 'review-service-elasticsearch', config.ELASTICSEARCH_URL as string)

class Elasticsearch {
  public client: Client
  constructor() {
    this.client = new Client({
      node: config.ELASTICSEARCH_URL
    })
  }

  public async checkConnection(): Promise<void> {
    let isConnected = false
    while (!isConnected) {
      try {
        const healthy = await this.client.cluster.health()
        logger.info(`Elasticsearch connection is healthy with status ${healthy.status}`)
        isConnected = true
      } catch (error) {
        logger.log('error', 'Elasticsearch connection error from review-service elasticsearch', error)
        logger.log('info', 'Retrying to connect to Elasticsearch...')
        await new Promise((resolve) => setTimeout(resolve, 5000)) // Retry after 5 seconds
      }
    }
  }
}

const elasticsearch = new Elasticsearch()
export default elasticsearch
