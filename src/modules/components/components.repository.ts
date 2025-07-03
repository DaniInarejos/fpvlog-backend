import { Types } from 'mongoose'
import Component from './components.models'
import type { ComponentType, IComponent } from './components.models'

type CreateComponentData = Omit<IComponent, '_id' | 'createdAt'>
type UpdateComponentData = Partial<CreateComponentData>

export const findAllComponentsRepository = async () => {
  return await Component.find().sort({ createdAt: -1 })
}

export const findComponentByIdRepository = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null
  return await Component.findById(id)
}

export const findComponentsByTypeRepository = async (type: string) => {
  return await Component.find({ type }).sort({ createdAt: -1 })
}

export const findComponentsByUserRepository = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) return []
  return await Component.find({ createdBy: userId }).sort({ createdAt: -1 })
}

export const findComponentsByUserGroupedRepository = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    return initializeEmptyComponentTypes()
  }
  
  const components = await Component.find({ createdBy: userId })
  const result = initializeEmptyComponentTypes()
  
  components.forEach(component => {
    result[component.type].push(component)
  })
  
  return result
}

const initializeEmptyComponentTypes = () => {
  return {
    FRAME: [],
    MOTOR: [],
    ESC: [],
    FC: [],
    CAMERA: [],
    VTX: [],
    ANTENNA: [],
    RECEIVER: [],
    BATTERY: [],
    PROPS: [],
    MOUNT: [],
    OTHER: []
  } as Record<ComponentType, IComponent[]>
}

export const createComponentRepository = async (data: CreateComponentData) => {
  const component = new Component(data)
  return await component.save()
}

export const updateComponentRepository = async (id: string, data: UpdateComponentData) => {
  if (!Types.ObjectId.isValid(id)) return null
  return await Component.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  )
}

export const deleteComponentRepository = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null
  return await Component.findByIdAndDelete(id)
}

export const searchComponentsRepository = async (query: string) => {
  return await Component.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { brand: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  }).sort({ createdAt: -1 })
}