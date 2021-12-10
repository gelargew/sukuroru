<h1 align="center">
  SUKURORU
</h1>
<small align="center">スクロール / scroll</small>

[![Version](https://img.shields.io/npm/v/sukuroru?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/sukuroru)



a simple wrapper to create a smooth scrolling div for your react application. it uses [gesture](https://github.com/pmndrs/use-gesture) handlers 
and [react-spring](https://github.com/pmndrs/react-spring) physics to animate the element



```bash
$ npm install react-spring @use-gesture/react sukuroru
```

Hello World:

```jsx
import { ScrollWrapper } from 'sukuroru'

const MyComponent = () => {
    return (
        <ScrollWrapper>
            <div style={{heigth: '100vh', background: 'red', width: '100vw'}}></div>
            <div style={{heigth: '100vh', background: 'blue', width: '100vw'}}></div>
        </ScrollWrapper>
    )
}
```
try it yourself [here!.](https://codesandbox.io/s/sukuroru-example1-9cg9b?file=/src/App.tsx)

keep in mind that in order for a component to become scrollable, the height of the content inside the wrapper must be bigger.

<hr>

ScrollWrapper accept any props that a normal div element can accept plus some additional including:

```jsx
<ScrollWrapper
scrollSpeed={1}     // any number.
horizontal={false}  // toggle horizontal scrolling
active={true}       // deactivate this if you dont want the element to scroll
springConfig={{     // a spring config value.
    tension: 280;
    friction: 120;
}}
innerProps
></ScrollWrapper>
```

ScrollWrapper have an inner an outer div. if you want to change any of the inner div props, use innerProps.
```jsx
innerProps={{
    className: 'inner',
    onClick:{handleClick}
    style:{MyStyle}
}}
```

`useScrollContext` is a hook that contains the scrollWrapper states and properties. this is only accesible inside the ScrollWrapper component.

```jsx
import { useScrollContext } from 'sukuroru'


const MyButtons = () => {
    const {
        offset,   // {x, y} position of current offset as SpringValue.
        scrollTo, // use this to manually change the scroll position.
        spring    // the wrapper spring api.
        } = useScrollContext()

    return (
        <>
            <button onClick={() => scrollTo(3)}> scroll to the fourth element inside scrollWrapper </button> 
            <button onClick={() => scrollTo('500px')}> scroll to 500px</button>
        </>
    )
}

const App = () => {
    return (
        <ScrollWrapper>
            <MyButtons />
        </ScrollWrapper>
    )
}
```

want more control for the animation? check out [react-spring](https://github.com/pmndrs/react-spring) docs!




if you have questions or having a problem feel free to open [issues](https://github.com/gelargew/sukuroru/issues). also [PR](https://github.com/gelargew/sukuroru/pulls) is open