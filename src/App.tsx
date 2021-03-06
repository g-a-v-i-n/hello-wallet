import { useState, useMemo } from 'react'
// import qrcode from 'qrcode'
import * as Ethers from 'ethers'
import { PaperWallet } from './components/PaperWallet'
import { capitalizeFirstLetter } from './lib/strings'
import { randomChoice } from './lib/random'
import words from './lib/words.json'

const defaults = {
  title: '✏️ Give Me a Title',
  description:
    "✏️ Hello Wallet is an editable paper wallet generator. It's an inexpensive and flexible way to generate a secure cold wallet for your ETH, provided you store the printed page in a safe, dry place. Most of the time, there are better options to store your ETH.",
}

function generateWallet() {
  return Ethers.Wallet.createRandom()
}

const donationAddr = '0x9f948E0aEAD7C0ac1496Cd316059F0b546917312'

const emojis = "😀 😊 😆 😂 🤣 😜 😬 😍 😘 🥰 😎 🤩 👍 ✌ 🤟 👊 ♥ 💕 ★ ✨ ⚽ 🏀 🏈 ⚾ 👾 🦄 👻 🤖 🐻 🐱 👽 💀 🐯 🐉 🐵 🐶 💩 🐴 🐏 🐇 🐍 🐔 🐖 🐭 🐮".split(' ')

function randomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)]
}

function randomTitle() {
  const predicate = capitalizeFirstLetter(randomChoice(words.predicates))
  const object = capitalizeFirstLetter(randomChoice(words.objects))

  return `${predicate} ${object} Wallet`
}

function App() {
  const _wallet = useMemo(() => generateWallet(), [])

  const date = new Date().toLocaleDateString('en-US')
  const version = process.env.REACT_APP_VERSION
  const source = 'https://github.com/g-a-v-i-n/hello-wallet'

  const [emoji, setEmoji] = useState('🤖')
  const [title, setTitle] = useState(defaults.title)

  const [wallet, setWallet] = useState(_wallet)

  return (
    <div className="flex w-full items-center flex-col justify-center relative">
      <div className="page-width justify-center flex my-12 no-print">
        <nav className="flex gap-x-8 bg-white px-4 py-2 rounded-[1.5rem]">
        <button
          className="text-black flex items-center justify-center flex-col w-16 h-16 leading-none"
          onClick={() => {
            setWallet(generateWallet())
            setEmoji(randomEmoji())
            setTitle(randomTitle())
            }
          }
        >
          <div className="text-2xl mb-1">􀣘</div>
          New
        </button>
        <button className="text-black flex items-center justify-center flex-col w-16 h-16 leading-none" onClick={() => window.print()}>
        <div className="text-2xl mb-1">􀎛</div>
          Print
        </button>
        {/* <button className="text-black flex items-center justify-center flex-col w-16 h-16 leading-none" onClick={() => {}}>
          <Symbol name="ellipsis.circle.fill" className="h-6 mb-2" />
          About
        </button> */}
        </nav>
      </div>

      <div className="relative page-size">
        {/* Shadow */}
        <div className="absolute shadow-elevation-medium bg-white page-size no-print" />
        {/* Start printable area */}
        <PaperWallet
          address={wallet.address}
          mnemonic={wallet.mnemonic.phrase}
          emoji={emoji}
          setEmoji={() => setEmoji(emojis[Math.floor(Math.random() * emojis.length)])}
          title={title}
          description={defaults.description}
          date={date}
          version={version}
        />
      </div>

      <div className="page-width justify-between flex mt-16 mb-12 no-print">
          <div className="flex items-center justify-center">Find this useful? Consider donating:
            <button
              onClick={() => {
                navigator.clipboard.writeText(donationAddr);
              }}
              className="rounded-full border-1 border-gray-200 px-2 py-1 text-sm font-bold">0x9f94...7312 􀉂</button>
            <div></div>
          </div>
          <div className="flex gap-x-2 items-center">


            <a className="flex gap-x-1 items-center no-underline font-bold" href={source} target="_blank" rel="noreferrer">
              Source
              <div className="text-md">􀄕</div>
</a>
          </div>
      </div>
    </div>

    
  )
}

export default App
