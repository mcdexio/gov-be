import {
	Transfer as TransferEvent,
} from '../generated/MCB/IERC20'

import {
	Account,
	Transfer,
	Balance,
	LatestBalance,
} from '../generated/schema'

import {
	logTransaction,
	createEventID,
	fetchLatest,
	toETH,
} from './utils'

export function handleTransfer(event: TransferEvent): void {
	let from = new Account(event.params.from.toHex())
	from.save()

	let to = new Account(event.params.to.toHex())
	to.save()

	let ev         = new Transfer(createEventID(event))
	ev.transaction = logTransaction(event).id
	ev.timestamp   = event.block.timestamp
	ev.contract    = event.address.toHex()
	ev.from        = from.id
	ev.to          = to.id
	ev.value       = toETH(event.params.value)
	ev.save()

	if (from.id != "0x0000000000000000000000000000000000000000")
	{
		let latestFrom         = fetchLatest(from.id, ev.contract)
		latestFrom.balance     -= ev.value
		latestFrom.transaction = ev.transaction
		latestFrom.block       = event.block.number
		latestFrom.save()

		let balanceFrom = new Balance(latestFrom.id.concat('-').concat(event.block.number.toString()))
		balanceFrom.account     = from.id
		balanceFrom.contract    = ev.contract
		balanceFrom.balance     = latestFrom.balance
		balanceFrom.transaction = ev.transaction
		balanceFrom.block       = event.block.number
		balanceFrom.save()
	}

	if (to.id != "0x0000000000000000000000000000000000000000")
	{

		let latestTo         = fetchLatest(to.id, ev.contract)
		latestTo.balance     += ev.value
		latestTo.transaction = ev.transaction
		latestTo.block       = event.block.number
		latestTo.save()

		let balanceTo   = new Balance(latestTo.id.concat('-').concat(event.block.number.toString()))
		balanceTo.account       = to.id
		balanceTo.contract      = ev.contract
		balanceTo.balance       = latestTo.balance
		balanceTo.transaction   = ev.transaction
		balanceTo.block         = event.block.number
		balanceTo.save()
	}
}
