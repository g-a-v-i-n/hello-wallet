import React, { useState, useMemo } from 'react'
import * as Ethers from 'ethers'
import { PaperWallet } from './components/PaperWallet'
import { capitalizeFirstLetter } from './lib/strings'
import { randomChoice } from './lib/random'
import words from './lib/words.json'
import pkg from '../package.json'

const defaults = {
  title: '✏️ Hello Wallet',
  description:
    "✏️ Hello Wallet is a paper wallet you can edit in-browser. Save this wallet in a secure place only you control. Ready to print? Just press ⌘P.",
}

function generateWallet() {
  return Ethers.Wallet.createRandom()
}

function App() {
  const _wallet = useMemo(() => generateWallet(), [])

  const date = new Date().toLocaleDateString('en-US')
  const version = pkg.version
  const source = 'https://github.com/g-a-v-i-n/hello-wallet'

  const [wallet, setWallet] = useState(_wallet)

  return (
    <div className="flex w-full items-center flex-col justify-center relative">
      <div className="h-32 no-print"/>

      <div className="relative page-size">
        {/* Shadow */}
        <div className="absolute shadow-elevation-high bg-white page-size no-print opacity-50" />
        {/* Start printable area */}
        <PaperWallet
          address={wallet.address || ""}
          mnemonic={wallet.mnemonic.phrase || ""}
          title={defaults.title}
          description={defaults.description}
          date={date}
          version={version}
        />
        <button onClick={() => setWallet(generateWallet())} className="absolute right-0 top-0  translate-x-8 -translate-y-8 bg-[#FFF] px-4 py-3  no-print text-[#373737] gap-x-2">
          Regenerate <img width="24" src="/icon-cycle.svg"/>
         </button>

      </div>

      <div className="page-width justify-between flex mt-16 mb-12 no-print">
      
          <div className="flex flex-col gap-y-4 ">
            <h2 className="text-xl font-medium text-[#373737]">About</h2>
            <p className="max-w-lg text-[#373737]/60">Paper wallets are an offline method to secure cryptocurrencies, involving printing private keys and addresses on paper. They offer high security against online threats but must be carefully stored to avoid loss or damage. </p>
            <p className="max-w-lg text-[#373737]/60"> While highly secure for long-term storage, using the funds requires transferring them to a digital wallet, introducing potential online risks. At one point, they were fairly common but were gradually replaced by somewhat better options like hardware wallets.</p>
            <a className="flex gap-x-1 items-center no-underline text-[#373737]/60" href={source} target="_blank" rel="noreferrer">
              Source Code
            </a>
          </div>
      </div>
    </div>

    
  )
}

export default App
