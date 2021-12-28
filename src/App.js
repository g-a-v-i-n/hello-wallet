import {useState, useMemo} from 'react'
// import QRCodeStyling from 'qr-code-styling'
import { Wallet } from 'ethers'



const defaults = {
  title: "Hello Wallet",
  description: "Hi! Hello Wallet is a paper wallet you can edit in browser. Physical wallets were long considered one of the safest ways to store crypto. If properly constructed, and provided that certain precautions are taken, it will be nearly impossible for a hostile user to access your crypto holdings. A paper wallet is considered an extremely secure way to keep crypto safe from cyber-attacks, malware, etc."
}

// const dataURItoBlob = (dataURI) => {
//   // convert base64 to raw binary data held in a string
//   // doesn't handle URLEncoded DataURIs
//   const byteString = atob(dataURI.split(',')[1])
//   // separate out the mime component
//   const mimeString = dataURI
//     .split(',')[0]
//     .split(':')[1]
//     .split(';')[0]
//   // write the bytes of the string to an ArrayBuffer
//   const ab = new ArrayBuffer(byteString.length)
//   // create a view into the buffer
//   let ia = new Uint8Array(ab)
//   // set the bytes of the buffer to the correct values
//   for (var i = 0; i < byteString.length; i++) {
//     ia[i] = byteString.charCodeAt(i)
//   }
//   // write the ArrayBuffer to a blob, and you're done
//   const blob = new Blob([ab], { type: mimeString })
//   return blob
// }

const HighlightInput = ({ as, style={}, className="", value, onChange }) => {
  const Component = as;

  const props = {
    contentEditable: "true",
    style: style,
    className: "highlight",
    onChange: e => onChange(e.target.value),
    type: 'text',
  }

  return (
    <Component {...props}>
      { value }
    </Component>
  );

}

function App() {

  const _wallet = useMemo(() => Wallet.createRandom(), [])

  const date = new Date().toLocaleDateString("en-US")
  const version = process.env.REACT_APP_VERSION
  const source = process.env.REACT_APP_REPO_URL

  console.log(source)
  
  const [title, setTitle] = useState(defaults.title)
  const [description, setDescription] = useState(defaults.description)
  const [wallet, setWallet] = useState(_wallet)

  console.log(setWallet)

  return (
    <div className="flex w-full items-center justify-center relative">

    <div className="fixed top-0 left-0 flex justify-center w-full p-8 z-20 no-print">
      <nav className=" p-2 rounded-full bg-[yellow]">
        <p><b>Warning:</b> This is a UX experiment. Use at your own risk.</p>
      </nav>
    </div>

      {/* <div className="fixed top-0 left-0 flex justify-center w-full p-6 z-20 no-print">
        <nav className="w-80 bg-white p-3 rounded-full smooth-shadow-md border border-gray-300">
          <button 
            className="mr-3" 
            onClick={() => {}}>
              :)
          </button>
          <button 
            className="button-round mr-3" 
            onClick={() => setWallet(Wallet.createRandom())}>
              ↺
          </button>
          <button 
            className="mr-3" 
            onClick={() => window.print()}>
              Print
          </button>
          <button 
            className="mr-3" 
            onClick={() => {}}>
              How To
          </button>
        </nav>
      </div> */}

      <div className="relative page-size my-pg animate-up-and-in">
        <div className="absolute smooth-shadow-sm bg-white page-size" />
        {/* Start Page */}
        <div className="absolute bg-white page-size">
        <div className="p-6">
          <div className="border-lg border-black w-full rounded-4xl p-6">
            <HighlightInput as={'h1'} value={title} onChange={setTitle} />
            <div className="flex mb-6">
              <div className="w-full pr-6">
                <h2 className="my-3">Notes</h2>
                <HighlightInput as={'p'} value={description} onChange={setDescription} />
              </div>
              <div className="w-full flex pl-6">
                <div className="mr-2 w-full">
                  <h2 className="my-3">Metdata</h2>
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
                    <div className="scannable">
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
                  <div className="scannable relative">
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
