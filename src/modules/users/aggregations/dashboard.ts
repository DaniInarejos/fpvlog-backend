import { PipelineStage } from "mongoose";

export const dashboardAggregation = (username: string):PipelineStage[] => [
  {
    $match: {
      username
    }
  },
  {
    $project: {
      password: 0,
      email:0,
      __v: 0
    }
  },
  {
    $lookup: {
      from: "likes",
      let: {
        userId: "$_id"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$targetId", "$$userId"] },
                { $eq: ["$targetType", "user"] }
              ]
            }
          }
        }
      ],
      as: "likes"
    }
  },
  {
    $lookup: {
      from: "drones",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$userId", "$$userId"]
            }
          }
        },
        {
          $lookup: {
            from: "dronebrands",
            localField: "brandId",
            foreignField: "_id",
            as: "brand"
          }
        },
        {
          $lookup: {
            from: "dronetypes",
            localField: "typeId",
            foreignField: "_id",
            as: "type"
          }
        },
        {
          $lookup: {
            from: "likes",
            let: { droneId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$targetId", "$$droneId"] },
                      { $eq: ["$targetType", "drone"] }
                    ]
                  }
                }
              }
            ],
            as: "likes"
          }
        },
        {
          $unwind: {
            path: "$brand",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $unwind: {
            path: "$type",
            preserveNullAndEmptyArrays: true
          }
        }
      ],
      as: "drones"
    }
  },
  {
    $lookup: {
      from: "flights",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$userId", "$$userId"]
            }
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $limit: 5
        },
        {
          $lookup: {
            from: "drones",
            localField: "droneId",
            foreignField: "_id",
            as: "drone"
          }
        },
        {
          $lookup: {
            from: "likes",
            let: { flightId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$targetId", "$$flightId"] },
                      { $eq: ["$targetType", "flight"] }
                    ]
                  }
                }
              }
            ],
            as: "likes"
          }
        },
        {
          $unwind: {
            path: "$drone",
            preserveNullAndEmptyArrays: true
          }
        }
      ],
      as: "flights"
    }
  },
  {
    $lookup: {
      from: "spots",
      localField: "_id",
      foreignField: "submittedBy",
      as: "spots"
    }
  },
  {
    $lookup: {
      from: "likes",
      let: { spotIds: "$spots._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $in: ["$targetId", "$$spotIds"] },
                { $eq: ["$targetType", "spot"] }
              ]
            }
          }
        }
      ],
      as: "spotLikes"
    }
  },
  {
    $addFields: {
      spots: {
        $map: {
          input: "$spots",
          as: "spot",
          in: {
            $mergeObjects: [
              "$$spot",
              {
                likes: {
                  $filter: {
                    input: "$spotLikes",
                    as: "like",
                    cond: {
                      $eq: ["$$like.targetId", "$$spot._id"]
                    }
                  }
                }
              }
            ]
          }
        }
      }
    }
  },
  {
    $lookup: {
      from: "followers",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$following", "$$userId"]
            }
          }
        },
        {
          $count: "total"
        }
      ],
      as: "followersCount"
    }
  },
  {
    $lookup: {
      from: "followers",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$follower", "$$userId"]
            }
          }
        },
        {
          $count: "total"
        }
      ],
      as: "followingCount"
    }
  },
  {
    $project: {
      user: {
        _id: "$_id",
        name: "$name",
        lastName: "$lastName",
        username: "$username",
        profilePicture: "$profilePicture",
        likes: "$likes"
      },
      stats: {
        dronesCount: { $size: "$drones" },
        flightsCount: { $size: "$flights" },
        spotsCount: { $size: "$spots" },
        followersCount: {
          $ifNull: [{ $arrayElemAt: ["$followersCount.total", 0] }, 0]
        },
        followingCount: {
          $ifNull: [{ $arrayElemAt: ["$followingCount.total", 0] }, 0]
        }
      },
      flights: 1,
      drones: 1,
      spots: 1
    }
  }
]
