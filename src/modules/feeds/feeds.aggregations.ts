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
        drones: [
          {
            $lookup: {
              from: 'drones',
              let: { 
                userId: '$_id',
                username: '$username',
                profilePicture: '$profilePicture'
              },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$userId', '$$userId'] },
                    ...query.drones,
                    ...timeQuery
                  }
                },
                {
                  $lookup: {
                    from: 'dronetypes',
                    localField: 'typeId',
                    foreignField: '_id',
                    as: 'droneType'
                  }
                },
                { $unwind: { path: '$droneType', preserveNullAndEmptyArrays: true } },
                {
                  $lookup: {
                    from: 'dronebrands',
                    localField: 'brandId',
                    foreignField: '_id',
                    as: 'droneBrand'
                  }
                },
                { $unwind: { path: '$droneBrand', preserveNullAndEmptyArrays: true } },
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
                          _id:0,
                          userId: '$user._id',
                        }
                      }
                    ],
                    as: 'likes'
                  }
                },
                {
                  $project: {
                    type: { $literal: 'drone' },
                    data: {
                      name: '$name',
                      model: '$model',
                      serialNumber: '$serialNumber',
                      weight: '$weight',
                      frameSize: '$frameSize',
                      notes: '$notes',
                      description: '$description',
                      image: '$image',
                      visibility: '$visibility',
                      droneType: {
                        name: '$droneType.name',
                        category: '$droneType.category'
                      },
                      droneBrand: {
                        name: '$droneBrand.name',
                        country: '$droneBrand.country'
                      },
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
              as: 'drones'
            }
          },
          { $unwind: '$drones' },
          { $replaceRoot: { newRoot: '$drones' } }
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
        ]
      }
    },
    {
      $project: {
        items: {
          $concatArrays: ['$users', '$drones', '$flights']
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

export const getTotalDronesAggregation = (query: any) => [
  { $match: query.users },
  {
    $lookup: {
      from: 'drones',
      let: { userId: '$_id' },
      pipeline: [{ $match: { $expr: { $eq: ['$userId', '$$userId'] }, ...query.drones } }],
      as: 'drones'
    }
  },
  { $project: { count: { $size: '$drones' } } },
  { $group: { _id: null, total: { $sum: '$count' } } }
]

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