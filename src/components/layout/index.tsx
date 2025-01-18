import React, { useState, useMemo } from 'react'
import * as Ethers from 'ethers'
import { PaperWallet } from '../paper-wallet'
import pkg from '../../../package.json'
import styles from './styles.module.scss'
import { Callout, CalloutButton } from '../callout'
import { english, generateMnemonic, mnemonicToAccount } from 'viem/accounts'

const defaults = {
  title: '✏️ Hello Wallet',
  description:
    '✏️ Hello Wallet is a paper wallet you can edit in-browser. Save this wallet in a secure place only you control. Ready to print? Just press ⌘P.',
}

function generateWallet() {
  const mnemonic = generateMnemonic(english)
  const wallet = mnemonicToAccount(mnemonic)

  console.log(wallet, mnemonic)

  return {
    mnemonic,
    address: wallet.address,
  }
}

export function Layout() {
  const _wallet = useMemo(() => generateWallet(), [])

  const date = new Date().toLocaleDateString('en-US')
  const version = pkg.version
  const source = 'https://github.com/g-a-v-i-n/hello-wallet'

  const [wallet, setWallet] = useState(_wallet)

  return (
    <div className={styles.container}>
      <div className={styles.spacer} />
      <div className={styles.pageContainer}>
        {/* Shadow */}
        <div className={styles.pageShadow} />
        {/* Start printable area */}
        <PaperWallet
          address={wallet.address || ''}
          mnemonic={wallet.mnemonic || ''}
          title={defaults.title}
          description={defaults.description}
          date={date}
          version={version}
        />
        <Callout side="top">
          <CalloutButton onClick={() => setWallet(generateWallet())}>
            Regenerate <img width="24" src="/icon-cycle.svg" />
          </CalloutButton>
        </Callout>
      </div>

      <div className={styles.aboutSection}>
        <div className={styles.aboutContent}>
          <h2 className={styles.aboutTitle}>About</h2>
          <p className={styles.aboutText}>
            Paper wallets are an offline method of storing cryptocurrencies,
            involving printing private keys, mnemonics and addresses on a piece
            of paper. They offer high security against online threats but must
            be carefully stored to avoid loss or damage.
          </p>
          <p className={styles.aboutText}>
            While highly secure for long-term storage, using the funds requires
            transferring the private key to a digital wallet, introducing
            potential risks. At one point, they were fairly common but were
            gradually replaced by better custody options like hardware wallets.
          </p>
          <a
            className={styles.sourceLink}
            href={source}
            target="_blank"
            rel="noreferrer"
          >
            Source Code
          </a>
        </div>
      </div>
    </div>
  )
}
