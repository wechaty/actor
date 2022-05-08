#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
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
import { test }                         from 'tstest'
import { firstValueFrom, from }         from 'rxjs'
import { filter, take }                 from 'rxjs/operators'
import { WechatyBuilder }               from 'wechaty'
import { createMachine, interpret }     from 'xstate'
import * as Mailbox                     from 'mailbox'
import * as CQRS                        from 'wechaty-cqrs'
import * as ACTOR from '../src/mod.js'

test('integration testing', async t => {
  const wechaty = WechatyBuilder.build({ puppet: 'wechaty-puppet-mock' })
  await wechaty.init()

  const actor = ACTOR.from(wechaty)
  const eventList: any[] = []
  from(actor).subscribe(e => eventList.push(e))

  const TEST_ID = 'TestMachine'
  const testMachine = createMachine({
    id: TEST_ID,
    on: {
      '*': {
        actions: Mailbox.actions.proxy(TEST_ID)(actor),
      },
    },
  })

  const interpreter = interpret(testMachine).start()

  const DING_DATA = 'ding-data'
  const startCommand = CQRS.commands.StartCommand(wechaty.puppet.id)
  const dingCommand  = CQRS.commands.DingCommand(wechaty.puppet.id, DING_DATA)
  interpreter.send(startCommand)
  await new Promise(resolve => setTimeout(resolve, 0))
  interpreter.send(dingCommand)

  await firstValueFrom(from(actor).pipe(
    // filter(CQRS.is(CQRS.events.DongReceivedEvent)),
    filter(CQRS.is(CQRS.responses.DingCommandResponse)),
    take(1),
  ))

  // console.info(eventList)
  t.same(eventList, [
    startCommand,
    CQRS.responses.StartCommandResponse(startCommand.meta),
    dingCommand,
    CQRS.responses.DingCommandResponse(dingCommand.meta),
    // CQRS.events.DongReceivedEvent(command.meta.puppetId, { data: DING_DATA }),
  ], 'should get dingCommand & dingedMessage & dingReceivedEvent')
})
