import {useState, useRef, useEffect, useMemo} from 'react'
import QRCodeStyling from 'qr-code-styling'
import { Wallet } from 'ethers'
import FileSaver from 'file-saver'

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
const WIDTH = 612
const HEIGHT = 792
const fonts = {
  h1: {
    fontWeight: 900, 
    fontSize: 24, 
    lineHeight: 32,
  },
  h2: {
    fontWeight: 800, 
    fontSize: 10, 
    lineHeight: 24, 
  },
  h3: {
    fontWeight: 800, 
    fontSize: 10, 
    lineHeight: 24, 
  },
  p: {
    fontWeight: 500, 
    fontSize: 9, 
    lineHeight: 12, 
  },
  pre: {
    fontWeight: 500, 
    fontSize: 12, 
    lineHeight: 16,
    fontFamily: 'SF Mono',
  }
}

const defaults = {
  strokeStyle: '#000000',
  lineWidth: 1,
  fillStyle: '#000000'
}

const dataURItoBlob = (dataURI) => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs
  const byteString = atob(dataURI.split(',')[1])
  // separate out the mime component
  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]
  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length)
  // create a view into the buffer
  let ia = new Uint8Array(ab)
  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], { type: mimeString })
  return blob
}



// let f = new FontFace('test', 'url(x)');

// f.load().then(function() {
//   // Ready to use the font in a canvas context
// });
const yOffset = (lineHeight, fontSize) => {
  const offset = lineHeight - fontSize * 0.15
  return offset
}

const underHeight = (lineHeight, fontSize) => fontSize * 0.15

const getLines = (ctx, text, maxWidth) => {
  var words = text.split(" ");
  var lines = [];
  var currentLine = words[0];

  for (var i = 1; i < words.length; i++) {
      var word = words[i];
      var width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
          currentLine += " " + word;
      } else {
          lines.push(currentLine);
          currentLine = word;
      }
  }
  lines.push(currentLine);
  return lines;
}

const calculateCapYRelativeToBaselineY = (y, lineHeight, fontSize, lineNum=1) => {
  return y + (lineHeight * lineNum) - ((lineHeight - fontSize) * 0.15)
}

const draw = {
  text: ({ctx, text, x=0, y=0, fontWeight=400, fontSize=12, lineHeight, fontFamily='SF Pro Rounded', color='#000', maxWidth=0, hug=false}) => {

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    ctx.fillStyle = color

    if (maxWidth <= 0) {
      ctx.fillText(text, x, calculateCapYRelativeToBaselineY(y, lineHeight, fontSize))

      // debug.hrule({ctx, y:calculateCapYRelativeToBaselineY(y, lineHeight, fontSize), color:'red'})
      // debug.hrule({ctx, y:y, color:'blue'})
      // debug.hrule({ctx, y:y+lineHeight, color:'green'})


      return y + lineHeight
    } else {

      const lines = getLines(ctx, text, maxWidth)

      if (hug === true) y = y - (lineHeight - fontSize)

      lines.forEach((line, index) => {
        ctx.fillText(line, x, calculateCapYRelativeToBaselineY(y, lineHeight, fontSize, index + 1))
        // debug.hrule({ctx, y:y + lineHeight * index+1 , color:'green'})
        // debug.hrule({ctx, y:calculateCapYRelativeToBaselineY(y, lineHeight, fontSize, index + 1), color:'red'})

      })

      // debug.hrule({ctx, y:y, color:'blue'})
      // debug.hrule({ctx, y:y + lineHeight * lines.length , color:'green'})
      
      return y + lineHeight * lines.length 
    }
  },
  rect: ({ctx, x=0, y=0, w=100, h=100, backgroundColor="transparent", borderWidth=0, borderColor="transparent", r=0, dashes=[]}) => {

    ctx.setLineDash(dashes)

    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderWidth
    
    // Draws rect
    if (r === 0) {
      ctx.rect(x, y, w, h);
    // Draws roundrect
    } else {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(
        x + w,
        y + h,
        x + w - r,
        y + h
      )
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
    }

    ctx.stroke()
    ctx.fillStyle = backgroundColor
    ctx.fill()
    
    ctx.fillStyle = defaults.fillStyle
    ctx.strokeStyle = defaults.strokeStyle
    ctx.lineWidth = defaults.lineWidth

    return y + h
  },
  line: ({ctx, x=0, y=0, w=100, h=100, borderColor="#000", borderWidth=1, dashes=[]}) => {

    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderWidth

    ctx.setLineDash(dashes)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + w, y + h)
    ctx.stroke()

    ctx.strokeStyle = defaults.strokeStyle
    ctx.lineWidth = defaults.lineWidth
    return y
  },
  qr: ({ctx, x, y, w, h, data}) => {
    // const QR_CONFIG = new QRCodeStyling({
//   width: 300,
//   height: 300,
//   type: "svg",
//   data: w.mnemonic.phrase,
//   qrOptions: {
//     errorCorrectionLevel: "H",
//   },
//   cornersSquareOptions: {
//     type: 'dot'
//   },
//   cornersDotOptions: {
//     type: 'dot'
//   },
//   imageOptions: {
//       crossOrigin: "anonymous",
//       margin: 20
//   }
// });
  },
  corner: ({ ctx, x, y, rotation=0, w=16, h=16, cornerProportion=0.50 }) => {

    const r = w * cornerProportion
    
    // Transform around center
    const tx = x + 0.5 * w
    const ty = y + 0.5 * h
    ctx.save()
    ctx.translate(tx, ty);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-tx, -ty);

    ctx.strokeStyle = 'black'
    ctx.lineWidth = 0.5

    // Draw lines and curve in transformed ctx
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h)
    ctx.stroke()
    ctx.restore()
  },
  rectWithCorners: ({ctx, x, y, w, h, cw, ch}) => {
    // Top left
    draw.corner({ ctx, x, y, w: cw, h:ch, rotation:270 })
    // Top right
    draw.corner({ ctx, x: x+w, y, w: cw, h:ch, rotation:0 })
    // Bottom left
    draw.corner({ ctx, x, y: y+h, w: cw, h:ch, rotation:180 })
    // Bottom right
    draw.corner({ ctx, x: x+w, y: y+h, w: cw, h:ch, rotation:90 })
  }
}

const debug = {
  coord: ({ctx, x, y, color="magenta"}) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 1

    const size = 4

    ctx.beginPath()
    ctx.moveTo(x - size, y - size)
    ctx.lineTo(x + size, y + size)
    ctx.stroke()

    ctx.moveTo(x - size, y + size)
    ctx.lineTo(x + size, y - size)
    ctx.stroke()
    ctx.strokeStyle = defaults.strokeStyle
    ctx.lineWidth = defaults.lineWidth
  },
  hrule: ({ctx, y, color="magenta"}) => {
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = 0.125

    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(WIDTH, y)
    ctx.stroke()

    ctx.restore()
  },
  vrule: ({ctx, x, color="magenta"}) => {
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = 0.25

    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, HEIGHT)
    ctx.stroke()

    ctx.restore()
  }
}

// const test = (ctx) => {
//   ctx.clearRect(0, 0, WIDTH, HEIGHT);

//   debug.vrule({ctx, x: 32})
//   debug.vrule({ctx, x: 258 + 32})
//   debug.vrule({ctx, x: 258 + 32 + 32})

//   debug.hrule({ctx, y: 32})
//   debug.hrule({ctx, y: 32 + 24})

//   const y1 = draw.text({
//     ctx,
//     text: lorem, 
//     x: 258+32+32, 
//     y: 32,
//     ...fonts.h2
//   })

//   const y2 = draw.text({
//     ctx,
//     text: lorem, 
//     x: 32, 
//     y: 32,
//     maxWidth: 258,
//     ...fonts.h2
//   })

//   // debug.coord({ctx, x:32, y: y1, color:"blue"})
//   // debug.coord({ctx, x:32, y: y2, color:"blue"})
// }

const update = (ctx, state) => {

  // Stylesheet
  const mx = 16
  const px = 16
  const my = 16
  const py = 16
  const gy_sm = 8
  const gy_md = 16
  const gy_lg = 24
  const gy_xl = 32
  const colx = 258
  const cr = 12
  const str_sm = 0.5
  const str_md = 1.5
  const black = '#000000'
  const white = '#FFFFFF'

  // Clear canvas since this function is called multiple times
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Give the canvas a white background
  ctx.rect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = white
  ctx.fill()

  // vertical offset value which will be accumulated throughout generating the layout
  var y = 0

  // Wallet title
  y = draw.text({
    ctx,
    text: state.title, 
    x: px + mx, 
    y: py + my, 
    ...fonts.h1
  })

  // Wallet description/notes heading
  draw.text({
    ctx, 
    text: 'Notes', 
    x: px + mx, 
    y: y + gy_md,
    ...fonts.h2
  })
  
  // Wallet metadata heading
  y = draw.text({
    ctx,
    text: 'Metadata',
    x: colx + mx+px + mx+px, 
    y: y + gy_md,
    ...fonts.h2
  })

  // Description
  y = draw.text({
    ctx, 
    text: state.description, 
    x: px + mx, 
    y: y + gy_sm, 
    maxWidth: colx,
    ...fonts.p
  })

  // Horizontal rule
  y = draw.line({
    ctx, 
    x: px + mx, 
    y: y + gy_lg, 
    w: WIDTH - px - mx - px - mx, 
    h: 0, 
    borderWidth: str_sm,
    borderColor: 'black'
  })
  
  // Store where the vertical rule should startf
  var vruleStart = y
  
  // Address heading
  draw.text({
    ctx,
    text: 'Address',
    x: mx+px,
    y, 
    ...fonts.h2
  })

  // Mnemonic phrase heading
  y =  draw.text({
    ctx, 
    text: 'Mnemonic Phrase', 
    x: colx + mx+px + mx+px, 
    y, 
    ...fonts.h2
  })

  var addressY = y + gy_sm

  // Address half line 1
  y = draw.text({
    ctx, 
    text: state.address.slice(0, 21), 
    x: mx+px+cr, 
    y: addressY + cr + 8,
    ...fonts.pre,
    lineHeight: 12,
  })

  // Address half line 2
  y = draw.text({
    ctx, 
    text: state.address.slice(21, 42), 
    x: mx+px+cr,
    y: y + gy_sm/2, // Adds some line height in between address to mirror the 'hug' prop of draw.text
    ...fonts.pre,
    lineHeight: 12,
  })

  // Outline rectangle for address
  draw.rectWithCorners({
    ctx,
    x: 32,
    y: addressY + gy_sm,
    w: 168,
    h: y - addressY - cr/2, // not sure why this works
    ch: cr,
    cw: cr,
  })

  // Mnemonic phrase
  y = draw.text({
    ctx, 
    text: state.mnemonic.phrase, 
    x: colx + mx+px + mx+px + cr, 
    y: addressY + cr, 
    ...fonts.pre,
    hug: true,
    maxWidth: colx - cr - cr - px
  })

  // Outline rectangle for mnemonic
  draw.rectWithCorners({
    ctx,
    x: colx + mx+px + mx+px,
    y: addressY,
    w: colx - cr - cr,
    h: y - addressY,
    ch: cr,
    cw: cr,
  })

  // Vertical rule
  draw.line({
    ctx,
    x: 306,
    y: vruleStart + gy_md,
    w: 0,
    h: y - vruleStart + gy_md, 
    borderWidth: str_sm,
    borderColor: black, 
  })

  // Outer roundrect
  draw.rect({
    ctx,
    x: 16, 
    y: 16, 
    w: WIDTH - my - my,
    h: y + py + my,
    borderWidth: str_md, 
    borderColor: black, 
    r: 24
  })
}

const exportPNG = (canvas, fileName) => {
  const imgURI = canvas.toDataURL('image/png')
  const blob = dataURItoBlob(imgURI)
  FileSaver.saveAs(blob, fileName)
}

// Broken
const printPNG = (canvas) => {
  const imgURI = canvas.toDataURL('image/png')
  const blob = dataURItoBlob(imgURI)

  // var fileElem = document.getElementById("fileElem").files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
      var html  = "<html><head>" +
          "</head>" +
          "<body  style ='-webkit-print-color-adjust:exact;'>"+
          "<img src='" + event.target.result + "' onload='javascript:window.print();/>'" +
          "</body>";
      var win = window.open("about:blank","_blank");
      win.document.write(html);

  };

  reader.readAsDataURL(blob); 
}

const setDPI = (canvas, dpi) => {
  // Set up CSS size.
  canvas.style.width = canvas.style.width || canvas.width + 'px';
  canvas.style.height = canvas.style.height || canvas.height + 'px';

  // Get size information.
  var scaleFactor = dpi / 96;
  console.log(scaleFactor)
  var width = parseFloat(canvas.style.width);
  var height = parseFloat(canvas.style.height);

  // Backup the canvas contents.
  var oldScale = canvas.width / width;
  var backupScale = scaleFactor / oldScale;
  var backup = canvas.cloneNode(false);
  backup.getContext('2d').drawImage(canvas, 0, 0);

  // Resize the canvas.
  var ctx = canvas.getContext('2d');
  canvas.width = Math.ceil(width * scaleFactor);
  canvas.height = Math.ceil(height * scaleFactor);

  // Redraw the canvas image and scale future draws.
  ctx.setTransform(backupScale, 0, 0, backupScale, 0, 0);
  ctx.drawImage(backup, 0, 0);
  ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
}

const HighlightInput = ({ style={}, className="", value, onChange }) => {
  return (
    <input
      style={style}
      className={"highlight-input" + " " + className}
      onChange={e => onChange(e.target.value)}
      type='text'
      value={value}
      // placeholder={placeholder}
    />
  )
}


function App() {
  // Ref for canvas node, which will be used to generate the PNGs
  const canvasRef = useRef(null);

  const _wallet = useMemo(() => Wallet.createRandom(), [])

  // const start = Date.now();

  // var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var today = new Date().toLocaleDateString("en-US")
  
  const [title, setTitle] = useState(defaults.title)
  const [description, setDescription] = useState(defaults.description)
  const [date, setDate] = useState(today)
  const [version, setVersion] = useState('1.0.0')
  const [wallet, setWallet] = useState(_wallet)
  const [debug, setDebug] = useState('')
  const [dpi, setDpi] = useState(600)

  // const state = useMemo(() => {
  //   return {
  //     title,
  //     description,
  //     date,
  //     version,
  //     address: wallet.address,
  //     mnemonic: wallet.mnemonic,
  //   }
  // }, [title, description, date, version, wallet.address, wallet.mnemonic]);

  const state = {
    title,
    description,
    date,
    version,
    address: wallet.address,
    mnemonic: wallet.mnemonic,
  }

  console.log(state)

  // Initialize the canvas by setting a width, height and resolution
  // useEffect(() => {
  //   const canvas = canvasRef.current
  //   setDPI(canvas, dpi)
  //   update(canvas.getContext('2d'), state)
  // }, [dpi, state])

  // // On render, update the canvas with new state
  // if (canvasRef.current !== null) {
  //   update(canvasRef.current.getContext('2d'), state)
  // }

  return (
    <div className="flex w-full items-center justify-center relative py-32">
      <div className="fixed top-0 left-0 flex justify-center w-full p-6 z-10">
        <nav className="w-80 bg-white p-2 rounded-full smooth-shadow-md border border-gray-200">
          <button 
            className="button-round mr-2" 
            onClick={() => setWallet(Wallet.createRandom())}>
              ↺
          </button>
          <button 
            className="mr-2" 
            onClick={() => exportPNG(canvasRef.current)}>
              Download
          </button>
          <button 
            onClick={() => printPNG(canvasRef.current)}>
              Print
          </button>
        </nav>
      </div>

      <div
        style={{width: WIDTH, height: HEIGHT}}
        className="smooth-shadow-sm origin-center bg-white mr-8 p-4"
      >
        <div className="border-lg border-black w-full rounded-2xl p-4">
          <HighlightInput className="h1" value={title} onChange={setTitle} />
          {/* <h1 className="my-2">{title}</h1> */}
          <div className="flex">
            <div className="w-full pr-4">
              <h2 className="my-2">Notes</h2>
              <HighlightInput className="p mb-4" value={title} onChange={setDescription} />
            </div>
            <div className="w-full pl-4">
              <h2 className="my-2">Metdata</h2>
            </div>
          </div>
          <hr className="border-black" />
          <div className="flex items-stretch">
            <div className="w-full pr-4">
              <h2 className="my-2">Address</h2>
              <div className="table">
                <div className="scannable">
                  <pre>{wallet.address.slice(0, 21) || ''}</pre>
                  <pre>{wallet.address.slice(21, 42) || ''}</pre>
                </div>
              </div>
            </div>
            <div className="vr mt-4 border-sm" />
            <div className="w-full pl-4">
              <h2 className="my-2">Mnemonic</h2>
              <div className="scannable">
                <pre>{wallet.mnemonic.phrase || ''}</pre>
              </div>
            </div>
          </div>
        </div>


      </div>

          {/* <canvas
            style={{width: WIDTH, height: HEIGHT}}
            className="smooth-shadow-sm origin-center bg-white"
            ref={canvasRef}
          /> */}
    </div>
  );
}

export default App;
