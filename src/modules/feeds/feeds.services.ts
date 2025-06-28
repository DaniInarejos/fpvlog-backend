import { getGlobalFeedRepository, getFollowingFeedRepository } from './feeds.repository'

export const getGlobalFeedService = async (page: number, limit: number, lastTimestamp?: string) => getGlobalFeedRepository(page, limit, lastTimestamp)


export const getFollowingFeedService = async (userId: string, page: number, limit: number, lastTimestamp?: string) =>  getFollowingFeedRepository(userId, page, limit, lastTimestamp)