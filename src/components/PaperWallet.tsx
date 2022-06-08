import { ContentEditable } from './ContentEditable'
import { chunk } from '../lib/strings'

export type PaperWalletProps = {
  address: string
  mnemonic: string
  emoji: string
  setEmoji: () => void
  title: string
  description: string
  date: string
  version?: string
}

const sf_numbers = '􀃋 􀃍 􀃏 􀃑 􀃓 􀃕 􀃗 􀃙 􀃛 􀕒 􀕓 􀕔 􀕕 􀕖 􀕗 􀕘 􀕙 􀕚 􀕛 􀕜 􀕝 􀕞 􀕟 􀕠 􀕡'.split(' ')

export function PaperWallet(props: PaperWalletProps) {
  return (
    <div className="absolute bg-white page-size flex justify-center">
      <div className="w-full flex flex-col items-center mt-32">
        <div className="flex flex-col items-center justify-center gap-y-1">
          <h1
            onClick={() => props.setEmoji()}
            style={{ fontFamily: 'SFEmoji' }}
            className="table w-12 h-12 text-5xl text-center select-none"
          >
            {props.emoji}
          </h1>
          <ContentEditable
            as="h2"
            className="table min-h-16 min-w-8 text-4xl font-extrabold max-w-lg pt-3 text-center"
            initialValue={props.title}
          />
          <ContentEditable
            as="p"
            className="table min-h-16 min-w-8 max-w-lg pt-3 text-center"
            initialValue={props.description}
          />
        </div>

        <div className="flex flex-col items-center justify-center mt-16 gap-y-3">
          <span className="flex gap-1 items-center">
            <div className="text-lg mr-1">􀈠</div>
            <h3 className="text-xl font-extrabold leading-none">Address</h3>
          </span>

          <p className="text-center">
            Send and receive using this sharable public address.
          </p>
          <div className="superellipse py-2 px-4">
            <div className="flex gap-2">
              <p className="font-semibold">0x</p>
              {/* @ts-ignore */}
              {chunk(props.address.slice(2), 4).map((chunk, i) => {
                return (
                  <p className="font-semibold" key={`address-chunk-${i}`}>
                    {chunk}
                  </p>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mt-16 gap-y-3">
          <span className="flex gap-1 items-center">
          <div className="text-lg mr-1">􀟖</div>
            <h3 className="text-xl font-extrabold leading-none">Mnemonic</h3>
          </span>
          <p className="text-center">
            Never share this secret key with anyone.
          </p>
          <div className="superellipse-lg p-2 max-w-lg">
            <div className="flex gap-3 items-center justify-center flex-wrap">
              {props.mnemonic.split(' ').map((word, i) => {
                return (
                  <span className="flex items-center gap-0.5">
                    <div className="text-lg font-bold">{sf_numbers[i]}</div>
                    <p className="font-semibold" key={`mnemonic-word-${i}`}>
                      {word}
                    </p>
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-center justify-center mt-16 absolute bottom-8">
          <div className="flex items-center">
            {/* <Symbol
              className="h-5 mr-1"
              weight="heavy"
              name="suit.diamond.fill"
            /> */}
            <p className="text-sm">Ethereum</p>
          </div>
          <div className="flex gap-x-1 items-center">
            <p className="text-sm">Hello Wallet Version</p>{' '}
            <div className="px-2 py-1 superellipse-sm text-xs">
              {props.version}
            </div>
          </div>
          <p className="text-sm">Generated on {props.date}</p>
        </div>
      </div>
    </div>
  )
}

PaperWallet.defaultProps = {
  address: '',
  mnemonic: '',
  emoji: '',
  title: '',
  description: '',
  date: '',
  version: '',
}
