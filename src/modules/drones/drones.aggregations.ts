import { Types,PipelineStage } from 'mongoose'

export const getDronesByUserAggregation = (userId: Types.ObjectId):PipelineStage[] => [
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'likes',
          let: { droneId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$targetId', '$$droneId'] },
                    { $eq: ['$targetType', 'drone'] }
                  ]
                }
              }
            }
          ],
          as: 'likes'
        }
      },
      {
        $addFields: {
          likesCount: { $size: '$likes' }
        }
      },
      {
        $project: {
          likes: 0
        }
      },
      { $sort: { createdAt: -1 } }
    ]