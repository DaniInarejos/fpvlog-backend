import { PipelineStage } from 'mongoose'

export const getFeedItemsAggregation = (query: any, page: number, limit: number, lastTimestamp?: string):PipelineStage[]=> {
  const skip = (page - 1) * limit
  
  let timeQuery = {}
  if (lastTimestamp) {
    timeQuery = { createdAt: { $lt: new Date(lastTimestamp) } }
  }

  return [
    { $match: query.users },
    {
      $facet: {
        users: [
          {
            $project: {
              type: { $literal: 'user' },
              data: {
                username: '$username',
                profilePicture: '$profilePicture',
                createdAt: '$createdAt'
              },
              createdAt: '$createdAt'
            }
          },
          {
            $lookup: {
              from: 'likes',
              let: { targetId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$targetId', '$$targetId'] },
                        { $eq: ['$targetType', 'user'] }
                      ]
                    }
                  }
                },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                  }
                },
                { $unwind: '$user' },
                {
                  $project: {
                    _id: 0,
                    userId: '$user._id'
                  }
                }
              ],
              as: 'likes'
            }
          },
          {
            $addFields: {
              'data.likes': '$likes'
            }
          }
        ],
        flights: [
          {
            $lookup: {
              from: 'flights',
              let: { 
                userId: '$_id',
                username: '$username',
                profilePicture: '$profilePicture'
              },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$userId', '$$userId'] },
                    ...query.flights,
                    ...timeQuery
                  }
                },
                {
                  $lookup: {
                    from: 'drones',
                    localField: 'droneId',
                    foreignField: '_id',
                    as: 'drone'
                  }
                },
                { $unwind: { path: '$drone', preserveNullAndEmptyArrays: true } },
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
                              { $eq: ['$targetType', 'FLIGHT'] }
                            ]
                          }
                        }
                      },
                      {
                        $lookup: {
                          from: 'users',
                          localField: 'userId',
                          foreignField: '_id',
                          as: 'user'
                        }
                      },
                      { $unwind: '$user' },
                      {
                        $project: {
                          _id: 0,
                          userId: '$user._id'
                        }
                      }
                    ],
                    as: 'likes'
                  }
                },
                {
                  $project: {
                    type: { $literal: 'flight' },
                    data: {
                      title: '$title',
                      date: '$date',
                      location: '$location',
                      duration: '$duration',
                      batteryUsed: '$batteryUsed',
                      urlVideo:'$urlVideo',
                      weather: '$weather',
                      notes: '$notes',
                      image: '$image',
                      visibility: '$visibility',
                      user: {
                        username: '$$username',
                        profilePicture: '$$profilePicture'
                      },
                      drone: {
                        name: '$drone.name',
                        model: '$drone.model'
                      },
                      likes: '$likes',
                      createdAt: '$createdAt'
                    },
                    createdAt: '$createdAt'
                  }
                }
              ],
              as: 'flights'
            }
          },
          { $unwind: '$flights' },
          { $replaceRoot: { newRoot: '$flights' } }
        ],
        spots: [
          {
            $lookup: {
              from: 'spots',
              let: { 
                userId: '$_id',
                username: '$username',
                profilePicture: '$profilePicture'
              },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$submittedBy', '$$userId'] },
                    ...query.spots,
                    ...timeQuery
                  }
                },
                {
                  $lookup: {
                    from: 'likes',
                    let: { spotId: '$_id' },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [
                              { $eq: ['$targetId', '$$spotId'] },
                              { $eq: ['$targetType', 'spot'] }
                            ]
                          }
                        }
                      },
                      {
                        $lookup: {
                          from: 'users',
                          localField: 'userId',
                          foreignField: '_id',
                          as: 'user'
                        }
                      },
                      { $unwind: '$user' },
                      {
                        $project: {
                          _id: 0,
                          userId: '$user._id'
                        }
                      }
                    ],
                    as: 'likes'
                  }
                },
                {
                  $project: {
                    type: { $literal: 'spot' },
                    data: {
                      name: '$name',
                      location: '$location',
                      description: '$description',
                      visibility: '$visibility',
                      user: {
                        username: '$$username',
                        profilePicture: '$$profilePicture'
                      },
                      likes: '$likes',
                      createdAt: '$createdAt'
                    },
                    createdAt: '$createdAt'
                  }
                }
              ],
              as: 'spots'
            }
          },
          { $unwind: '$spots' },
          { $replaceRoot: { newRoot: '$spots' } }
        ]
      }
    },
    {
      $project: {
        items: {
          $concatArrays: ['$users', '$flights', '$spots']
        }
      }
    },
    { $unwind: '$items' },
    { $replaceRoot: { newRoot: '$items' } },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit }
  ]
}

export const getTotalFlightsAggregation = (query: any) => [
  { $match: query.users },
  {
    $lookup: {
      from: 'flights',
      let: { userId: '$_id' },
      pipeline: [{ $match: { $expr: { $eq: ['$userId', '$$userId'] }, ...query.flights } }],
      as: 'flights'
    }
  },
  { $project: { count: { $size: '$flights' } } },
  { $group: { _id: null, total: { $sum: '$count' } } }
]

export const getTotalSpotsAggregation = (query: any): PipelineStage[] => [
  { $match: query.users },
  {
    $lookup: {
      from: 'spots',
      let: { userId: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$submittedBy', '$$userId'] },
            ...query.spots
          }
        }
      ],
      as: 'spots'
    }
  },
  {
    $group: {
      _id: null,
      total: { $sum: { $size: '$spots' } }
    }
  }
]