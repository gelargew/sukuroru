<h1 align="center">
  SUKURORU
</h1>
<small align="center">スクロール / scroll</small>

[![Version](https://img.shields.io/npm/v/sukuroru?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/sukuroru)



a simple wrapper around [react-spring](https://github.com/pmndrs/react-spring) to create
a smooth scrolling div for your react application. 



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
keep in mind that in order for a component to become scrollable, the height of the content inside the wrapper must be bigger.

<hr>

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




if you have questions or having a problem feel free to open [issues](https://github.com/gelargew/sukuroru/issues)