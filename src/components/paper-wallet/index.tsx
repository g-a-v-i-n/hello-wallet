import React, { useState } from 'react'
import { Spoiler } from 'spoiled'
import { ContentEditable } from '../content-editable'
import { Callout, CalloutButton, CalloutRule } from '../callout'
import { chunk } from '../../lib/strings'
import styles from './styles.module.scss'

export type PaperWalletProps = {
  address: string
  mnemonic: string
  title: string
  description: string
  date: string
  version?: string
}

function randomFloat(mn: number, mx: number) {
  return Math.random() * (mx - mn) + mn
}

export function PaperWallet(props: PaperWalletProps) {
  const [hidden, setHidden] = useState(true)

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <ContentEditable
            as="h2"
            className={styles.title}
            initialValue={props.title}
          />
          <ContentEditable
            as="p"
            className={styles.description}
            initialValue={props.description}
          />
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Address</h3>
          <p className={styles.sectionDescription}>
            Send and receive using this sharable public address.
          </p>
          <div className={styles.addressContainer}>
            <Callout>
              <CalloutButton
                onClick={() => {
                  navigator.clipboard.writeText(props.address)
                }}
              >
                Copy
              </CalloutButton>
            </Callout>
            <div className={styles.addressText}>
              <p className={styles.monoText}>0x</p>
              {chunk(props.address.slice(2), 4).map((chunk, i) => (
                <p className={styles.monoText} key={`address-chunk-${i}`}>
                  {chunk}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Seed Phrase</h3>
          <p className={styles.sectionDescription}>
            Never share these secret words with anyone.
          </p>
          <div className={styles.seedPhraseContainer}>
            <Callout>
              <CalloutButton
                onClick={() => {
                  navigator.clipboard.writeText(props.mnemonic)
                }}
              >
                Copy
              </CalloutButton>
              <CalloutRule />
              <CalloutButton onClick={() => setHidden((s) => !s)}>
                Reveal
              </CalloutButton>
            </Callout>
            <div className={styles.wordColumn}>
              {props.mnemonic
                .split(' ')
                .slice(0, 6)
                .map((word, i) => (
                  <span className={styles.wordRow} key={`word-row-${i}`}>
                    <div className={styles.wordNumber}>{i + 1}</div>
                    <div className={styles.word} key={`mnemonic-word-${i}`}>
                      <Spoiler
                        density={randomFloat(0.05, 0.25)}
                        theme="light"
                        hidden={hidden}
                        tagName="div"
                      >
                        {word}
                      </Spoiler>
                    </div>
                  </span>
                ))}
            </div>
            <div className={styles.wordColumn}>
              {props.mnemonic
                .split(' ')
                .slice(6, 12)
                .map((word, i) => (
                  <span className={styles.wordRow} key={`word-row-${i + 6}`}>
                    <div className={styles.wordNumber}>{i + 7}</div>
                    <div className={styles.word} key={`mnemonic-word-${i + 7}`}>
                      <Spoiler
                        mimicWords={false}
                        density={randomFloat(0.05, 0.25)}
                        theme="light"
                        hidden={hidden}
                        tagName="div"
                      >
                        {word}
                      </Spoiler>
                    </div>
                  </span>
                ))}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <span className={styles.wordRow}>
            <h3 className={styles.sectionTitle}>Notes</h3>
          </span>
          <p className={styles.sectionDescription}>
            A place for notes after this wallet is printed.
          </p>
          <div className={styles.notesContainer}>
            <div className={styles.notesColumn}>
              <div className={styles.noteLine} />
              <div className={styles.noteLine} />
              <div className={styles.noteLine} />
              <div className={styles.noteLine} />
            </div>
            <div className={styles.notesColumn}>
              <div className={styles.noteLine} />
              <div className={styles.noteLine} />
              <div className={styles.noteLine} />
              <div className={styles.noteLine} />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerItem}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 84 84"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-heliotrope"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M84 42C84 65.196 65.196 84 42 84C18.804 84 0 65.196 0 42C0 18.804 18.804 0 42 0C65.196 0 84 18.804 84 42ZM57.5948 35.9218L47.5148 18.8048C45.7003 15.7235 44.793 14.1829 43.6143 13.663C42.5859 13.2093 41.4141 13.2093 40.3857 13.663C39.207 14.1829 38.2997 15.7235 36.4852 18.8048L26.4052 35.9218C24.9982 38.3109 24.2948 39.5055 24.2182 40.6947C24.1509 41.7409 24.4142 42.7819 24.9708 43.6703C25.6034 44.6802 26.7902 45.3967 29.1637 46.8298L29.1637 46.8298L38.692 52.5827C39.8944 53.3087 40.4955 53.6716 41.1377 53.8134C41.7057 53.9388 42.2943 53.9388 42.8623 53.8134C43.5045 53.6716 44.1056 53.3087 45.3079 52.5828L45.308 52.5827L54.8363 46.8298C57.2098 45.3967 58.3966 44.6802 59.0292 43.6703C59.5858 42.7819 59.8491 41.7409 59.7818 40.6947C59.7052 39.5055 59.0018 38.3109 57.5948 35.9218ZM24.9111 48.8559C24.8356 48.9028 24.8025 48.9577 24.7363 49.0675C24.6097 49.2777 24.5168 49.5108 24.4649 49.7592C24.2605 50.7375 26.0942 53.2 29.7615 58.1249L38.2015 69.4589C39.489 71.188 40.1328 72.0525 40.9233 72.3612C41.6156 72.6315 42.3843 72.6315 43.0767 72.3612C43.8672 72.0525 44.511 71.188 45.7985 69.4589L54.2384 58.1249L54.2384 58.1249C57.9058 53.2 59.7394 50.7375 59.5351 49.7593C59.4832 49.5108 59.3903 49.2778 59.2636 49.0675C59.1975 48.9578 59.1644 48.9029 59.0889 48.8559C59.0316 48.8203 58.9338 48.7961 58.8666 48.801C58.7779 48.8074 58.7074 48.8501 58.5666 48.9353L47.5177 55.6228L47.5177 55.6228C45.5125 56.8365 44.5099 57.4433 43.4385 57.6803C42.491 57.89 41.509 57.89 40.5615 57.6803C39.4901 57.4433 38.4875 56.8365 36.4823 55.6228L25.4334 48.9353C25.2925 48.85 25.2221 48.8074 25.1334 48.801C25.0662 48.7961 24.9683 48.8203 24.9111 48.8559Z"
                fill="black"
              />
            </svg>
            <p className="text-sm ml-1">Ethereum</p>
          </div>
          <div className={styles.footerItem}>
            <p className="text-sm">Hello Wallet Version</p>{' '}
            <div className={styles.versionTag}>{props.version}</div>
          </div>
          <p className="text-sm">Generated on {props.date}</p>
        </div>
      </div>
    </div>
  )
}
