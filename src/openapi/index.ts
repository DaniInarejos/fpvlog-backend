import { openApiConfig } from './config'
import { authOpenApiDef } from './modules/auth'
import { usersOpenApiDef } from './modules/users'
import { flightsOpenApiDef } from './modules/flights'
import { followersOpenApiDef } from './modules/followers'

import { feedsOpenApiDef } from './modules/feeds'
import { likesRoutes } from './modules/likes'
import { spotsOpenApiDef } from './modules/spots'
import { groupsOpenApiDef } from './modules/groups'
import { equipmentItemsOpenApiDef } from './modules/equipmentItems'

export const openApiDoc = {
  ...openApiConfig,
  paths: {
    ...authOpenApiDef,
    ...usersOpenApiDef,
    ...followersOpenApiDef,

    ...flightsOpenApiDef,
    ...feedsOpenApiDef,
    ...likesRoutes,
    ...spotsOpenApiDef,
    ...groupsOpenApiDef,
    ...equipmentItemsOpenApiDef
  }
}
