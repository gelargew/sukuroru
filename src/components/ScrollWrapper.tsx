import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { useSpring, config, SpringConfig, animated, SpringValue, SpringRef, to as interpolate } from 'react-spring'
import { useGesture } from '@use-gesture/react'
import { useResizeObserver, DOMRectProps } from '../utils/useResizeObserver'

interface contextProps {
    offset: {
        x: SpringValue<number>,
        y: SpringValue<number>
    },
    scrollTo: (page: number | string) => void,
    wrapper: DOMRectProps,
    content: DOMRectProps,
    spring: SpringRef<{
        y: number,
        x: number
    }>,
    active: boolean
}

interface ScrollWrapperProps extends React.HTMLProps<HTMLDivElement> {
    springConfig?: SpringConfig,
    scrollSpeed?: number,
    innerProps?: React.HTMLAttributes<HTMLDivElement>,
    horizontal?: boolean,
    active?: boolean
}

const ScrollContext = React.createContext({} as contextProps)

const transf = (x: number, y: number) => `translate3d(${x}px, ${y}px, 0)`

const ScrollWrapper = ({
    springConfig = config.molasses,
    scrollSpeed = 1,
    children,
    style,
    innerProps,
    horizontal = false,
    active = true,
    ...props
}: ScrollWrapperProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const wrapper = useResizeObserver(wrapperRef)
    const content = useResizeObserver(ref)
    const [height, width] = useMemo(() => {
        return [content.height - wrapper.height, content.width - wrapper.width]
    }, [wrapper, content])
    const contentStyles = useMemo(() => {
        return horizontal ?
        {
            display: 'flex',
            flexDirection: 'row',
            height: 'inherit',
            width: 'fit-content',
            ...innerProps?.style
        }:
        {
            width: 'inherit',
            height: 'fit-content',
            ...innerProps?.style
        }
    }, [horizontal])
    const isActive = useMemo(() => {
        if (!active) return false
        if (horizontal) return content.width > wrapper.width
        else return content.height > wrapper.height
    }, [active, horizontal, height, width])


    const [{y,x}, spring] = useSpring(() => ({
        y: 0,
        x: 0,
        config: springConfig
    }))

    //update Y value according to deltaY in pixel value
    const updateY = (deltaY: number) => {
        let target = y.animation.to as number + (deltaY * scrollSpeed)
        if (!isActive) target = 0
        else if (target > 0) target = 0        
        else if (target < -height) target = -height  
        spring.start({y: target})
    }

    const updateX = (deltaX: number) => {      
        let target = x.animation.to as number + (deltaX * scrollSpeed)
        if (!isActive) target = 0
        else if (target > 0) target = 0
        else if (target < -width) target = -width
        spring.start({x: target})
    }

    const bind = useGesture({
        onWheel: state => {            
            if (horizontal) {
                state.active && updateX(-state.movement[1]/2)
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

    //update offset to any pixel value or to any direct children given its index
    const scrollTo = (page: number | string) => {
        if (ref.current) {
            if (typeof page === 'string') {
                if (horizontal) spring.start({x: -parseInt(page)})
                else spring.start({y: -parseInt(page)})
            }
            else {
                const el = ref.current.children.item(page) as HTMLElement
                if (horizontal) spring.start({x: -el.offsetLeft})
                else spring.start({y: -el.offsetTop})
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
                transform: interpolate([x, y], transf),
                ...contentStyles as object
            }}
            {...innerProps}
            >
                <ScrollContext.Provider value={{
                    offset: {x, y},
                    scrollTo,
                    wrapper,
                    content,
                    spring,
                    active
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