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
                {
                  $eq: ["$targetId", "$$userId"]
                },
                {
                  $eq: ["$targetType", "user"]
                }
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
      let: {
        userId: "$_id"
      },
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
            let: {
              droneId: "$_id"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          "$targetId",
                          "$$droneId"
                        ]
                      },
                      {
                        $eq: [
                          "$targetType",
                          "drone"
                        ]
                      }
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
      let: {
        userId: "$_id"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$userId", "$$userId"]
            }
          }
        },
        {
          $sort: {
            createdAt: -1
          }
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
            let: {
              flightId: "$_id"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          "$targetId",
                          "$$flightId"
                        ]
                      },
                      {
                        $eq: [
                          "$targetType",
                          "flight"
                        ]
                      }
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
      as: "recentFlights"
    }
  },
  // Get followers count
  {
    $lookup: {
      from: "followers",
      let: {
        userId: "$_id"
      },
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
  // Get following count
  {
    $lookup: {
      from: "followers",
      let: {
        userId: "$_id"
      },
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
  // Format final output
  {
    $project: {
      user: {
        _id:"$_id",
        name: "$name",
        lastName: "$lastName",
        username: "$username",
        profilePicture:"$profilePicture",
        likes: "$likes"
      },
      stats: {
        dronesCount: {
          $size: "$drones"
        },
        flightsCount: {
          $size: "$recentFlights"
        },
        followersCount: {
          $arrayElemAt: [
            "$followersCount.total",
            0
          ]
        },
        followingCount: {
          $arrayElemAt: [
            "$followingCount.total",
            0
          ]
        }
      },
      recentFlights: 1,
      drones: 1
    }
  }
]