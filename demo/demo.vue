<template>
  <div class="demo">
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
          text: 'more more',
          onPress: moreBtn,
          style: { backgroundColor: 'orange', color: 'white' }
        },
        {
          text: 'delete',
          onPress: deleteBtn,
          style: { backgroundColor: 'red', color: 'white' }
        }
      ]"
      :onOpen="openEvent"
      :onClose="closeEvent"
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

<script>
import VSwipeout from '../index'

export default {
  data () {
    return {
      msg: 'hello'
    }
  },
  methods: {
    readBtn () {
      console.log('read');
    },
    replayBtn () {
      console.log('replay me');
    },
    moreBtn () {
      console.log('more more');
    },
    deleteBtn () {
      console.log('delete');
    },
    openEvent () {
      console.log('open');
    },
    closeEvent () {
      console.log('close');
    }
  },
  components: {
    VSwipeout
  }
}
</script>
