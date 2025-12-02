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
        $lookup: {
          from: 'spots',
          localField: 'spotId',
          foreignField: '_id',
          as: 'spot'
        }
      },
      {
        $lookup: {
          from: 'equipmentitems',
          localField: 'equipmentItems',
          foreignField: '_id',
          as: 'equipment'
        }
      },
      {
        $addFields: {
          likesCount: { $size: '$likes' },
          spot: { $arrayElemAt: ['$spot', 0] },
          equipment: '$equipment'
        }
      },
      {
        $project: {
          likes: 0
        }
      },
      { $sort: { recordedAt: -1, createdAt: -1 } }
    ]