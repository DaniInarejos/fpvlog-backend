import { Context } from 'hono'
import * as topicService from './group-topics.services'
import { getErrorMessage } from '../../../utils/error'

export const createTopicController = async (context: Context): Promise<Response> => {
  try {
    const groupId = context.req.param('id')
    const user = context.get('user')
    const data = await context.req.json()
    
    const topic = await topicService.createTopicService(groupId, user._id.toString(), data)
    return context.json(topic, 201)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const getTopicController = async (context: Context): Promise<Response> => {
  try {
    const topicId = context.req.param('topicId')

    const user = context.get('user')
    
    const topic = await topicService.getTopicService(topicId, user?._id.toString())
    return context.json(topic)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 404)
  }
}

export const getGroupTopicsController = async (context: Context): Promise<Response> => {
  try {
    const groupId = context.req.param('id')
    const user = context.get('user')
    const page = parseInt(context.req.query('page') || '1')
    const limit = parseInt(context.req.query('limit') || '20')
    
    const result = await topicService.getGroupTopicsService(groupId, user?._id.toString(), page, limit)
    return context.json(result)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const updateTopicController = async (context: Context): Promise<Response> => {
  try {
    const topicId = context.req.param('topicId')
    const user = context.get('user')
    const data = await context.req.json()
    
    const topic = await topicService.updateTopicService(topicId, user._id.toString(), data)
    return context.json(topic)
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}

export const deleteTopicController = async (context: Context): Promise<Response> => {
  try {
    const topicId = context.req.param('topicId')
    const user = context.get('user')
    
    await topicService.deleteTopicService(topicId, user._id.toString())
    return context.json({ message: 'Tema eliminado exitosamente' })
  } catch (error) {
    return context.json({ error: getErrorMessage(error) }, 400)
  }
}