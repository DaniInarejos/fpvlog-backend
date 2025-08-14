import { openApiConfig } from './config'
import { dronesOpenApiDef } from './modules/drones'
import { authOpenApiDef } from './modules/auth'
import { usersOpenApiDef } from './modules/users'
import { flightsOpenApiDef } from './modules/flights'
import { followersOpenApiDef } from './modules/followers'
import { droneTypesOpenApiDef } from './modules/drone-types'
import { droneBrandsOpenApiDef } from './modules/drone-brands'
import { feedsOpenApiDef } from './modules/feeds'
import { likesRoutes } from './modules/likes'
import { componentsOpenApiDef } from './modules/components'
import { spotsOpenApiDef } from './modules/spots'
import { groupsOpenApiDef } from './modules/groups'

export const openApiDoc = {
  ...openApiConfig,
  paths: {
    ...authOpenApiDef,
    ...usersOpenApiDef,
    ...followersOpenApiDef,
    ...dronesOpenApiDef,
    ...droneTypesOpenApiDef,
    ...droneBrandsOpenApiDef,
    ...flightsOpenApiDef,
    ...feedsOpenApiDef,
    ...likesRoutes,
    ...componentsOpenApiDef,
    ...spotsOpenApiDef,
    ...groupsOpenApiDef
  }
}
