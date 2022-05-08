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
import * as WECHATY   from 'wechaty'
import * as CQRS      from 'wechaty-cqrs'
import * as Mailbox   from 'mailbox'

import machine from './machine.js'

/**
 * Convert a Wechaty Instance or CQRS Bus$ to the Wechaty Mailbox Actor
 *
 * @param wechatyBus { WECHATY.Wechaty | CQRS.Bus }
 * @param puppetId { string } optional, if set, the Actor will has the default Puppet ID set
 * @returns Mailbox Interface of the Wechaty Actor
 */
const from = (
  wechatyBus : CQRS.Bus | WECHATY.Wechaty,
  puppetId?  : string,
) => {
  const isWechatyInstance = WECHATY.impls.WechatyImpl.valid(wechatyBus)

  const bus$ : CQRS.Bus = isWechatyInstance
    ? CQRS.from(wechatyBus)
    : wechatyBus

  if (isWechatyInstance) {
    if (puppetId) {
      throw new Error('puppetId can not be set when wechaty instance is passed')
    }
    puppetId = wechatyBus.puppet.id
  }

  const mailbox = Mailbox.from(
    machine.withContext({
      bus$,
      puppetId,
    }),
  )
  mailbox.open()
  return mailbox
}

export default from
