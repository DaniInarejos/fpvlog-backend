import { Types,PipelineStage } from 'mongoose'

export const getFlightsByUserAggregation = (userId: Types.ObjectId):PipelineStage[] => [
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'likes',
          let: { flightId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$targetId', '$$flightId'] },
                    { $eq: ['$targetType', 'flight'] }
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