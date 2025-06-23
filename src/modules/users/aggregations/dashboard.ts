import { PipelineStage } from "mongoose";

export const dashboardAggregation = (username: string):PipelineStage[] => [


    // Match user by username
    { $match: { username } },

    // Remove password from user data
    { $project: { password: 0 } },

    // Get drones count and data
    {
      $lookup: {
        from: 'drones',
        let: { userId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
          {
            $lookup: {
              from: 'dronebrands',
              localField: 'brandId',
              foreignField: '_id',
              as: 'brand'
            }
          },
          {
            $lookup: {
              from: 'dronetypes',
              localField: 'typeId',
              foreignField: '_id',
              as: 'type'
            }
          },
          { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
          { $unwind: { path: '$type', preserveNullAndEmptyArrays: true } }
        ],
        as: 'drones'
      }
    },

    // Get recent flights with drone info
    {
      $lookup: {
        from: 'flights',
        let: { userId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'drones',
              localField: 'droneId',
              foreignField: '_id',
              as: 'drone'
            }
          },
          { $unwind: { path: '$drone', preserveNullAndEmptyArrays: true } }
        ],
        as: 'recentFlights'
      }
    },

    // Get followers count
    {
      $lookup: {
        from: 'followers',
        let: { userId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$following', '$$userId'] } } },
          { $count: 'total' }
        ],
        as: 'followersCount'
      }
    },

    // Get following count
    {
      $lookup: {
        from: 'followers',
        let: { userId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$follower', '$$userId'] } } },
          { $count: 'total' }
        ],
        as: 'followingCount'
      }
    },

    // Format final output
    {
      $project: {
        user: '$$ROOT',
        stats: {
          dronesCount: { $size: '$drones' },
          flightsCount: { $size: '$recentFlights' },
          followersCount: { $arrayElemAt: ['$followersCount.total', 0] },
          followingCount: { $arrayElemAt: ['$followingCount.total', 0] }
        },
        recentFlights: 1,
        drones: 1
      }
    }
  ]