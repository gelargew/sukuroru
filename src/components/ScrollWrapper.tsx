import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { useSpring, config, SpringConfig, animated, SpringValue, SpringRef, to as interpolate } from '@react-spring/web'
import { useGesture } from '@use-gesture/react'
import { useResizeObserver, DOMRectProps } from '../utils/useResizeObserver'

interface contextProps {
    offset: {
        x: SpringValue<number>;
        y: SpringValue<number>;
    },
    scrollTo: (page: number | string) => void,
    wrapper: DOMRectProps,
    content: DOMRectProps,
    height: number,
    spring: SpringRef<{
        y: number,
        x: number
    }>
}

interface ScrollWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    springConfig?: SpringConfig,
    scrollSpeed?: number,
    innerProps: React.HTMLAttributes<HTMLDivElement>,
    horizontal?: boolean
}

const ScrollContext = React.createContext({} as contextProps)

const transf = (x: number, y: number) => `translate3d(${x}, ${y}px, 0)`

const ScrollWrapper = ({
    springConfig = config.molasses,
    scrollSpeed = 1,
    children,
    style,
    innerProps,
    horizontal = false,
    ...props
}: ScrollWrapperProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const wrapper = useResizeObserver(wrapperRef)
    const content = useResizeObserver(ref)
    const [height, width] = useMemo(() => {
        return [content.height - wrapper.height, content.width - wrapper.width]
    }, [wrapper, content])

    const [offset, spring] = useSpring(() => ({
        y: 0,
        x: 0,
        config: springConfig
    }))

    //update Y value according to deltaY in pixel value
    const updateY = (deltaY: number) => {
        let target = offset.y.animation.to as number + (deltaY * scrollSpeed)
        if (target > 1) target = 0
        else if (target < -height) target = -height  
        spring.start({x: offset.x, y: target})
    }

    const updateX = (deltaX: number) => {
        let target = offset.x.animation.to as number + (deltaX * scrollSpeed)
        if (target > 1) target = 0
        else if (target < -width) target = -width
        spring.start({x: target, y: offset.y})
    }

    const bind = useGesture({
        onWheel: state => {
            if (horizontal) {
                state.active && updateX(-state.movement[0]/2)
            }
            else {
                state.active && updateY(-state.movement[1]/2)
            }
        },
        onDrag: state => {
            if (horizontal) {
                updateX(state.delta[0] * 2.5 * state.velocity[0])
            }
            else {
                updateY(state.delta[1] * 2.5 * state.velocity[1])
            }
        }
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
        updateX(0)
    }, [height, width])

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
                transform: interpolate([offset.x, offset.y], transf)
            }}
            {...innerProps}
            >
                <ScrollContext.Provider value={{
                    offset,
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