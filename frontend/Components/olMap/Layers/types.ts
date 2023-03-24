import type { Vector as VectorSource } from 'ol/source'
import type { Options } from 'ol/layer/BaseVector'
import type { Options as GroupOptions } from 'ol/layer/Group'

interface ExtendOptions extends Options<VectorSource> {
  title: string
  canSearch: boolean
  canToggle: boolean
  type: string
}

interface GroupExtendOptions extends GroupOptions {
  title: string
}

export type { ExtendOptions, GroupExtendOptions }
