import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { useSpring, config, SpringConfig, animated, SpringValue, SpringRef } from '@react-spring/web'
import { useGesture } from '@use-gesture/react'
import { useResizeObserver, DOMRectProps } from '../utils/useResizeObserver'

interface contextProps {
    y: SpringValue<number>,
    scrollTo: (page: number | string) => void,
    wrapper: DOMRectProps,
    content: DOMRectProps,
    height: number,
    spring: SpringRef<{
        y: number;
    }>
}

interface ScrollWrapperProps extends React.HTMLProps<HTMLDivElement> {
    springConfig?: SpringConfig
}

const ScrollContext = React.createContext({} as contextProps)

const ScrollWrapper = ({
    springConfig = config.molasses,
    children,
    style,
    ...props
}: ScrollWrapperProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const wrapper = useResizeObserver(wrapperRef)
    const content = useResizeObserver(ref)
    const height = useMemo(() => content.height - wrapper.height, [wrapper, content])

    const [{y}, spring] = useSpring(() => ({
        y: 0,
        config: springConfig
    }))

    //update Y value according to deltaY in pixel value
    const updateY = (deltaY: number) => {
        let target = y.animation.to as number + deltaY
        if (target > 1) {
            target = 0
        }
        else if (target < -height) {
            target = -height
        }
        spring.start({y: target})
    }

    const bind = useGesture({
        onWheel: state => state.active && updateY(-state.movement[1]/2),
        onDrag: state => updateY(state.delta[1] * 2)
    })

    //update Y to any pixel value or to any direct children given its index
    const scrollTo = (page: number | string) => {
        if (ref.current) {
            if (typeof page === 'string') {
                spring.start({y: -parseInt(page)})
            }
            else {
                const el = ref.current.children.item(page) as HTMLElement
                el && spring.start({y: -el.offsetTop})
            }
        }
    }

    useEffect(() => {
        updateY(0)
    }, [height])

    return (
        <div
        ref={wrapperRef}
        style={{
            touchAction: 'none',
            overflow: 'hidden',
            maxHeight: '100vh',
            ...style
        }}
        {...bind()}
        {...props}
        >
            <animated.div 
            ref={ref} 
            style={{
                transform: y.to(y => `translate3d(0, ${y}px, 0)`)
            }}
            >
                <ScrollContext.Provider value={{
                    y,
                    scrollTo,
                    wrapper,
                    content,
                    height,
                    spring
                }}>
                    {children}
                </ScrollContext.Provider>
            </animated.div>
        </div>
    )
}

const useScrollContext = () => useContext(ScrollContext)

export {
    ScrollWrapper,
    useScrollContext,
    ScrollWrapperProps
}