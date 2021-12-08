import React, { useEffect, useState } from 'react'

interface DOMRectProps {
    x: number,
    y: number,
    height: number,
    width: number
}

const useResizeObserver = (ref:React.RefObject<HTMLElement>) => {
    const [properties, setSize] = useState({
        x: 0,
        y: 0,
        height: 0,
        width: 0
    })
    const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            const {x, y, height, width} = entry.contentRect
            setSize({
                x,
                y,
                height,
                width
            })
        })
    })

    useEffect(() => {
        const element = ref.current!
        resizeObserver.observe(element)
        
        return () => resizeObserver.unobserve(element)
    }, [ref])

    return properties
}


export {useResizeObserver, DOMRectProps}