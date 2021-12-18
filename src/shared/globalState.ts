/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { NAME as app } from './modules/app/appDuck'
import { NAME as commands } from './modules/commands/commandsDuck'
import {
  ConnectionReduxState,
  NAME as connections
} from './modules/connections/connectionsDuck'
import {
  initialState as userInitialState,
  NAME as user
} from './modules/currentUser/currentUserDuck'
import {
  initialState as metaInitialState,
  NAME as meta
} from './modules/dbMeta/dbMetaDuck'
import {
  initialState as experimentalFeaturesInitialState,
  NAME as experimentalFeatures
} from './modules/experimentalFeatures/experimentalFeaturesDuck'
import { Favorite, NAME as documents } from './modules/favorites/favoritesDuck'
import { Folder, NAME as folders } from './modules/favorites/foldersDuck'
import {
  initialState as featuresInitialState,
  NAME as features
} from './modules/features/featuresDuck'
import { FramesState, NAME as frames } from './modules/frames/framesDuck'
import { NAME as grass } from './modules/grass/grassDuck'
import { GuideState, NAME as guides } from './modules/guides/guidesDuck'
import { NAME as history } from './modules/history/historyDuck'
import { NAME as params } from './modules/params/paramsDuck'
import { NAME as requests, RequestState } from './modules/requests/requestsDuck'
import {
  initialState as settingsInitialState,
  NAME as settings
} from './modules/settings/settingsDuck'
import { NAME as sidebar, SidebarState } from './modules/sidebar/sidebarDuck'
import {
  initialConsentState,
  initialMetadataState,
  initialState as syncInitialState,
  NAME as sync,
  NAME_CONSENT as syncConsent,
  NAME_META as syncMetadata
} from './modules/sync/syncDuck'
import { NAME as udc, UdcState } from './modules/udc/udcDuck'

export interface GlobalState {
  [settings]: typeof settingsInitialState
  [connections]: ConnectionReduxState
  [history]: string[]
  [requests]: RequestState
  [sidebar]: SidebarState
  [frames]: FramesState
  [features]: typeof featuresInitialState
  [user]: typeof userInitialState
  [meta]: typeof metaInitialState
  [documents]: Favorite[]
  [params]: Record<string, unknown>
  [grass]: unknown
  [sync]: typeof syncInitialState
  [syncMetadata]: typeof initialMetadataState
  [syncConsent]: typeof initialConsentState
  [folders]: Folder[]
  [commands]: unknown
  [udc]: UdcState
  [app]: Record<string, unknown>
  [experimentalFeatures]: typeof experimentalFeaturesInitialState
  [guides]: GuideState
}
