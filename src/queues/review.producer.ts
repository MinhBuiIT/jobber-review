import { createLogger } from '@minhbuiit/jobber-shared'
import config from '@review/config'
import { Channel } from 'amqplib'
import { createConnection } from './connection'

const logger = createLogger('info', 'review-service-producer', config.ELASTICSEARCH_URL as string)
const publishFanoutReview = async (
  channel: Channel | undefined,
  exchangeName: string,
  message: string,
  logMessage: string
) => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel
    }
    await channel.assertExchange(exchangeName, 'fanout', { durable: true })
    channel.publish(exchangeName, '', Buffer.from(message), { persistent: true })
    logger.info(logMessage)
  } catch (error) {
    logger.log('error', 'Error publishing message to RabbitMQ', error)
  }
}

export default publishFanoutReview
