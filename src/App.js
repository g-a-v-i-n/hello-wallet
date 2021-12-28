import {useState, useMemo} from 'react'
// import * as Dialog from '@radix-ui/react-dialog';

// import QRCodeStyling from 'qr-code-styling'
import { Wallet } from 'ethers'
import words from './lib/words.json'
import { randomChoice } from './lib/random'
import { capitalizeFirstLetter } from './lib/strings'


const defaults = {
  title: "Hello Wallet",
  description: "Hi! Hello Wallet is a paper wallet you can edit in browser. Physical wallets were long considered one of the safest ways to store crypto. If properly constructed, and provided that certain precautions are taken, it will be nearly impossible for a hostile user to access your crypto holdings. A paper wallet is considered an extremely secure way to keep crypto safe from cyber-attacks, malware, etc."
}

const ContentEditable = ({ as, style={}, className="", iconClassName="", initialValue }) => {

  const Component = as;

  const props = {
    contentEditable: "true",
    autoComplete: "off",
    autoCorrect: "off",
    autoCapitalize: "off",
    style,
    className,
    suppressContentEditableWarning: true,
    onPaste: (e) => {
      // Cancel paste
      e.preventDefault();
      // Get text representation of clipboard
      const text = e.clipboardData.getData('text/plain');
      // Insert text manually.
      document.execCommand("insertHTML", false, text);
    }
  }

  return (
      <div className="relative">
        <div className={`absolute icon-edit-text no-print -left-11 z-10 h-10 w-10 ${iconClassName}`} />
        <Component {...props}>
          { initialValue }
        </Component>
      </div>

  );
}

function App() {

  const _wallet = useMemo(() => Wallet.createRandom(), [])

  const predicate = capitalizeFirstLetter(randomChoice(words.predicates))
  const object = capitalizeFirstLetter(randomChoice(words.objects))

  const randomTitle = `${predicate} ${object} Wallet`

  const date = new Date().toLocaleDateString("en-US")
  const version = process.env.REACT_APP_VERSION
  const source = process.env.REACT_APP_REPO_URL
  
  const [wallet, setWallet] = useState(_wallet)

  return (
    <div className="flex w-full items-center justify-center relative">

    <div className="fixed bottom-0 left-0 flex justify-center w-full p-8 z-20 no-print">
      <nav className=" p-2 rounded-full bg-gray-300">
        <p><b>Warning:</b> This is a UX experiment. Use at your own risk. View <a href={source}>Source</a>.</p>
      </nav>
    </div>

      <div className="fixed top-0 left-0 flex justify-center w-full p-6 z-20 no-print">
        <nav className="flex bg-white py-5 px-6 rounded-full smooth-shadow-md border border-gray-300">
          <button
            className="mr-7" 
            onClick={() => setWallet(Wallet.createRandom())}>
              <div className="icon-cycle w-6 h-6 mr-1"/>
              New
          </button>
          <button 
            className=""
            onClick={() => window.print()}>
              <div className="icon-print w-6 h-6 mr-1"/>
              Print
          </button>
          {/* <Dialog.Root>
            <Dialog.Trigger 
              className="" 
              onClick={() => {}}>
                <div className="icon-help w-6 h-6 mr-1"/>
                Help
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay />
              <Dialog.Content>
                Help
                <Dialog.Title>
                  Help
                </Dialog.Title>
                <Dialog.Description />
                <Dialog.Close />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root> */}
        </nav>
      </div>

      <div className="relative page-size my-pg flex flex-col">
        <div className="absolute smooth-shadow-sm bg-white page-size" />
        {/* Start printable area */}
        <div className="absolute bg-white page-size">
        <div className="p-6">
          <div className="border-lg border-black w-full rounded-4xl p-6">
            <ContentEditable
              as='h1'
              initialValue={randomTitle}
              iconClassName="top-3"
              />
            <div className="flex mb-6">
              <div className="w-full pr-6">
                <h2 className="my-3">Notes</h2>
                <ContentEditable
                  as='p'
                  initialValue={defaults.description}
                  iconClassName="-top-1"
                />
              </div>
              <div className="w-full flex pl-6">
                <div className="mr-2 w-full">
                  <h2 className="my-3">Metadata</h2>
                  <h3>Type</h3>
                  <p>Ethereum</p>
                  <h3 className="mt-3">Date Created</h3>
                  <p>{date}</p>
                </div>
                <div className="ml-2 w-full">
                  <h2 className="my-3 text-white"> _</h2>
                  <h3>Hello Wallet Version</h3>
                  <p>{version}</p>
                </div>
              </div>
            </div>
              <hr className="border-black" />
              <div className="flex">
                <div className="w-full pr-6">
                  <div className="flex my-3 items-baseline">
                    <h2 className="">Address</h2>
                    <label className="border border-black ml-2">PUBLIC</label>
                  </div>
                  <div className="table">
                    <div className="viewfinder">
                      <pre>{wallet.address.slice(0, 21) || ''}</pre>
                      <pre>{wallet.address.slice(21, 42) || ''}</pre>
                    </div>
                  </div>
                </div>
                <div className="vr mt-6 border-sm" />
                <div className="w-full pl-6">
                <div className="flex my-3 items-baseline">
                    <h2 className="">Mnemonic</h2>
                    <label className="border border-black text-white bg-black ml-2">SECRET</label>
                  </div>
                  <div className="viewfinder relative">
                    <pre>{wallet.mnemonic.phrase || ''}</pre>
                  </div>
                </div>
              </div>
          </div>
        </div>
        </div>
      </div>
      </div>
  );
}

export default App;
