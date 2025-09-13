import { IReviewDocument, IReviewMessageDetails } from '@minhbuiit/jobber-shared'
import database from '@review/database'
import publishFanoutReview from '@review/queues/review.producer'
import { channelGlobal } from '@review/server'

export const createReview = async (review: IReviewDocument): Promise<IReviewDocument> => {
  const pool = database.getPool()
  const {
    gigId,
    reviewerId,
    orderId,
    sellerId,
    rating,
    review: reviewText,
    reviewerUsername,
    reviewerImage,
    country,
    reviewType
  } = review

  const createdAt = new Date()
  const query = `INSERT INTO reviews (gigId, reviewerId, orderId, sellerId, rating, review, reviewerUsername, reviewerImage, country, reviewType,createdAt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`
  const values = [
    gigId,
    reviewerId,
    orderId,
    sellerId,
    rating,
    reviewText,
    reviewerUsername,
    reviewerImage,
    country,
    reviewType,
    createdAt
  ]
  const result = await pool.query(query, values)

  const reviewMessage: IReviewMessageDetails = {
    gigId: result.rows[0].gigId,
    reviewerId: result.rows[0].reviewerId,
    orderId: result.rows[0].orderId,
    sellerId: result.rows[0].sellerId,
    rating: result.rows[0].rating,
    review: result.rows[0].review,
    type: result.rows[0].reviewType,
    createdAt: result.rows[0].createdAt
  }

  await publishFanoutReview(
    channelGlobal,
    'jobber-review',
    JSON.stringify(reviewMessage),
    'Publish review message to order and user services'
  )
  return result.rows[0]
}

export const getReviewsByGigId = async (gigId: string): Promise<IReviewDocument[]> => {
  const pool = database.getPool()
  const { rows } = await pool.query('SELECT * FROM reviews WHERE gigId = $1', [gigId])
  return rows
}

export const getReviewsBySellerId = async (sellerId: string): Promise<IReviewDocument[]> => {
  const pool = database.getPool()
  const { rows } = await pool.query('SELECT * FROM reviews WHERE sellerId = $1 AND reviewType = $2', [
    sellerId,
    'seller-review'
  ])
  return rows
}
