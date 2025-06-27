import { openApiConfig } from './config'
import { dronesOpenApiDef } from './modules/drones'
import { authOpenApiDef } from './modules/auth'
import { usersOpenApiDef } from './modules/users'
import { flightsOpenApiDef } from './modules/flights'
import { followersOpenApiDef } from './modules/followers'
import { droneTypesOpenApiDef } from './modules/drone-types'
import { droneBrandsOpenApiDef } from './modules/drone-brands'

export const openApiDoc = {
  ...openApiConfig,
  paths: {
    ...authOpenApiDef,
    ...usersOpenApiDef,
    ...followersOpenApiDef,
    ...dronesOpenApiDef,
    ...droneTypesOpenApiDef,
    ...droneBrandsOpenApiDef,
    ...flightsOpenApiDef
  }
}