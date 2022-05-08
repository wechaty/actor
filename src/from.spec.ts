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
import { test }       from 'tstest'
import * as WECHATY   from 'wechaty'
import * as CQRS      from 'wechaty-cqrs'
import * as Mailbox   from 'mailbox'

import from   from './from.js'

test('from() a Wechaty instance', async t => {
  const wechaty = WECHATY.WechatyBuilder.build({ puppet: 'wechaty-puppet-mock' })
  await wechaty.init()
  const mailbox = from(wechaty)
  t.ok(Mailbox.isMailbox(mailbox), 'should get a mailbox from wechaty instance')
})

test('from() a Wechaty CQRS Bus', async t => {
  const wechaty = WECHATY.WechatyBuilder.build({ puppet: 'wechaty-puppet-mock' })
  await wechaty.init()
  const bus$ = CQRS.from(wechaty)
  const mailbox = from(bus$)
  t.ok(Mailbox.isMailbox(mailbox), 'should get a mailbox from CQRS Bus')
})
