registerPaint('smooth-corners', class {
    static get inputProperties() {
        return [
            '--border-radius',
            '--stroke-width',
            '--stroke-color'
        ]
    }

    paint(ctx, size, styleMap) {

        const lw = parseInt(
            styleMap.get('--stroke-width').toString()
        )

        ctx.lineWidth = lw

        ctx.strokeStyle = styleMap.get('--stroke-color').toString()

        const r = parseInt(
            styleMap.get('--border-radius').toString()
        )
    
        const w = size.width - lw
        const h = size.height - lw

        const x = 0 + lw / 2
        const y = 0 + lw / 2
    
        ctx.beginPath();
  
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.quadraticCurveTo(
            x + w, 
            y, 
            x + w,
            y + r
        )
        ctx.lineTo(
            x + w, 
            y + h - r
        )
        ctx.quadraticCurveTo(
            x + w,
            y + h,
            x + w - r,
            y + h
        )
        ctx.lineTo(x + r, y + h)
        ctx.quadraticCurveTo(
            x, 
            y + h,
             x, 
            y + h - r
        )
        ctx.lineTo(x, y + r)
        ctx.quadraticCurveTo(x, y, x + r, y)
        ctx.closePath()
  
        ctx.stroke()
    }
})