import { PipelineStage } from 'mongoose'

const lookupLikes = (localField: string, targetType: string) => ({
  $lookup: {
    from: 'likes',
    let: { targetId: `$${localField}` },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ['$targetId', '$$targetId'] },
              { $eq: ['$targetType', targetType] }
            ]
          }
        }
      }
    ],
    as: 'likes'
  }
})

const projectUser = {
  $project: {
    password: 0,
    email: 0,
    __v: 0
  }
}

const lookupDrones = {
  $lookup: {
    from: 'drones',
    let: { userId: '$_id' },
    pipeline: [
      { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
      { $lookup: { from: 'dronebrands', localField: 'brandId', foreignField: '_id', as: 'brand' } },
      { $lookup: { from: 'dronetypes', localField: 'typeId', foreignField: '_id', as: 'type' } },
      lookupLikes('_id', 'drone'),
      { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$type', preserveNullAndEmptyArrays: true } }
    ],
    as: 'drones'
  }
}

const lookupFlights = {
  $lookup: {
    from: 'flights',
    let: { userId: '$_id' },
    pipeline: [
      { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'drones', localField: 'droneId', foreignField: '_id', as: 'drone' } },
      lookupLikes('_id', 'flight'),
      { $unwind: { path: '$drone', preserveNullAndEmptyArrays: true } }
    ],
    as: 'flights'
  }
}

const lookupSpots = {
  $lookup: {
    from: 'spots',
    let: { userId: '$_id' },
    pipeline: [
      { $match: { $expr: { $eq: ['$submittedBy', '$$userId'] } } },
      lookupLikes('_id', 'spot')
    ],
    as: 'spots'
  }
}

const lookupFollowers = (field: 'following' | 'follower') => ({
  $lookup: {
    from: 'followers',
    let: { userId: '$_id' },
    pipeline: [
      { $match: { $expr: { $eq: [`$${field}`, '$$userId'] } } },
      { $count: 'total' }
    ],
    as: `${field}Count`
  }
})

const projectDashboard = {
  $project: {
    user: {
      _id: '$_id',
      name: '$name',
      lastName: '$lastName',
      username: '$username',
      profilePicture: '$profilePicture',
      likes: '$likes',
      socialMedia: '$socialMedia'
    },
    stats: {
      dronesCount: { $size: '$drones' },
      flightsCount: { $size: '$flights' },
      spotsCount: { $size: '$spots' },
      followersCount: { $ifNull: [{ $arrayElemAt: ['$followersCount.total', 0] }, 0] },
      followingCount: { $ifNull: [{ $arrayElemAt: ['$followingCount.total', 0] }, 0] }
    },
    flights: 1,
    drones: 1,
    spots: 1
  }
}

export const dashboardAggregation = (username: string): PipelineStage[] => [
  { $match: { username } },
  projectUser,
  lookupLikes('_id', 'user'),
  lookupDrones,
  lookupFlights,
  lookupSpots,
  lookupFollowers('following'),
  lookupFollowers('follower'),
  projectDashboard
]
