<h1 align="center">
  SUKURORU
  <small>スクロール</small>
</h1>

[![Version](https://img.shields.io/npm/v/sukuroru?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/sukuroru)


<blockquote align="center">
  a simple wrapper around [react-spring](https://github.com/pmndrs/react-spring) to create
  <br>
    a smooth scrolling div for your react application
</blockquote>


```bash
$ npm install sukuroru
```

in your application:

```jsx
import { ScrollWrapper } from 'sukuroru'

const MyComponent = () => {
    return (
        <ScrollWrapper
        scrollSpeed={1} //optional scroll intensity, default 1
        config={config.mollases} //optional spring config. check react-spring documentation for its config properties, default to config.molasses
        {...props} // any HTMLDivElement props is accepted here. it is just a div afterall!
        >
            <h1> YOUR PAGES / COMPONENT </h1>
        </ScrollWrapper>
    )
}
```

keep in mind that in order for a component to become scrollable, the height of the content inside the wrapper must be bigger.



if you have questions or having a problem feel free to open [issues](https://github.com/gelargew/sukuroru/issues)