#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2022 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import * as ACTOR   from 'wechaty-actor'

import { WechatyBuilder }   from 'wechaty'
import * as CQRS            from 'wechaty-cqrs'
import { from }             from 'rxjs'
import assert               from 'assert'

async function main () {
  const wechaty = WechatyBuilder.build({ puppet: 'wechaty-puppet-mock' })
  await wechaty.init()

  const actor = ACTOR.from(wechaty)
  const eventList: any[] = []
  from(actor).subscribe(e => eventList.push(e))

  assert.notEqual(ACTOR.VERSION, '0.0.0', 'version should be set before publishing')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
