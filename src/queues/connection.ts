import { createLogger } from '@minhbuiit/jobber-shared'
import config from '@review/config'
import amqplib, { Channel, ChannelModel } from 'amqplib'

const log = createLogger('debug', 'review-message-queue', config.ELASTICSEARCH_URL)

async function createConnection(): Promise<Channel | undefined> {
  let isConnected = false
  while (!isConnected) {
    try {
      const conn = await amqplib.connect(config.AMQP_URL)
      const channel = await conn.createChannel()
      log.info('AMQP connection has been established successfully')
      isConnected = true
      closeConnection(channel, conn)
      return channel
    } catch (error) {
      log.error('Error connecting at createConnection method in review-message-queue', error)
      log.error('AMQP client failed to connect. Retrying...')
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
  }
}

async function closeConnection(channel: Channel, conn: ChannelModel): Promise<void> {
  process.once('SIGINT', async () => {
    try {
      await channel.close()
      await conn.close()
      log.info('AMQP connection has been closed successfully')
    } catch (error) {
      log.error('Error closing connection at closeConnection method in review-message-queue', error)
    }
  })
}

export { createConnection }
