# v-swipeout

[![Build Status](https://travis-ci.org/ttian226/vue-swipeout.svg?branch=master)](https://travis-ci.org/ttian226/vue-swipeout)

## Install

```shell
npm install --save v-swipeout
```

## Usage

```javascript
import VSwipeout from 'v-swipeout';

export default {
  name: 'app',
  methods: {
    readBtn () {},
    replayBtn () {},
    moreBtn () {},
    deleteBtn () {},
    openCb () {},
    closeCb () {}
  },
  components: {
    VSwipeout
  }
}
```

```html
<template>
  <div id="app">
    <v-swipeout
      :autoClose="false"
      :style="{ backgroundColor: 'white' }"
      :left="[
        {
          text: 'read',
          onPress: readBtn,
          style: { backgroundColor: 'blue', color: 'white' }
        },
        {
          text: 'reply',
          onPress: replayBtn,
          style: { backgroundColor: 'green', color: 'white' }
        }
      ]"
      :right="[
        {
          text: 'more',
          onPress: moreBtn,
          style: { backgroundColor: 'orange', color: 'white' }
        },
        {
          text: 'delete',
          onPress: deleteBtn,
          style: { backgroundColor: 'red', color: 'white' }
        }
      ]"
      :onOpen="openCb"
      :onClose="closeCb"
    >
      <div 
        :style="{
          height: 44,
          backgroundColor: 'white',
          lineHeight: '44px',
          borderTop: '1px solid #dedede',
          borderBottom: '1px solid #dedede',
        }"
      >
        swipe out simple demo
      </div>
    </v-swipeout>
  </div>
</template>
```

## API

### Props

| name       | description      | type       | default       |
|-----------|-----------|-----------|-------------|
| style | swipeout style | `Object`  |  |
| left | swipeout buttons on left | `Array`  | `null` |
| right | swipeout buttons on right | `Array`  | `null` |
| autoClose | auto close on button press | `Boolean`  |  `false`  |
| onOpen | open callback | `(): void`  |  `function() {}`  |
| onClose | close callback | `(): void`  |  `function() {}`  |

### Button props

| name       | description      | type       | default       |
|-----------|-----------|-----------|-------------|
| text | button text | `String`  |  |
| style | button style | `Object`  |  |
| onPress | button press function | `(): void`  | `function() {}` |