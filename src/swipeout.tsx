import Vue, { CreateElement } from 'vue';
import VTouch from './touch.vue';
import Component from 'vue-class-component';
import '../assets/index.less';

// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
// http://caniuse.com/#search=match
function closest(el: any, selector: string) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    } else {
      el = el.parentElement;
    }
  }
  return null;
}

@Component({
  props: {
    left: Array,
    right: Array,
    autoClose: {
      type: Boolean,
      default: false
    },
    onOpen: Function,
    onClose: Function,
    disabled: {
      type: Boolean,
      default: false
    },
    prefixCls: {
      type: String,
      default: 'v-swipeout'
    }
  },
  components: {
    VTouch
  }
})
export default class Swipeout extends Vue {
  // class property
  btnsLeftWidth!: number;
  btnsRightWidth!: number;
  needShowLeft!: boolean;
  needShowRight!: boolean;

  // data
  openedLeft: boolean = false;
  openedRight: boolean = false;
  swiping: boolean = false;

  // refs
  content: any;
  cover: any;
  l: any;
  r: any;

  // props
  prefixCls!: string;
  autoClose!: boolean;
  right!: any[];
  left!: any[];
  onOpen!: () => void;
  onClose!: () => void;
  disabled!: boolean;

  onPanStart (e: any) {
    const { direction, moveStatus } = e;
    const { x: deltaX } = moveStatus;
    // http://hammerjs.github.io/api/#directions
    const isLeft = direction === 2;
    const isRight = direction === 4;

    if (!isLeft && !isRight) {
      return;
    }
    this.needShowRight = isLeft && this.right && this.right.length > 0;
    this.needShowLeft = isRight && this.left && this.left.length > 0;
    if (this.l) {
      this.l.style.visibility = this.needShowRight ? 'hidden' : 'visible';
    }
    if (this.r) {
      this.r.style.visibility = this.needShowLeft ? 'hidden' : 'visible';
    }
    if (this.needShowLeft || this.needShowRight) {
      this.swiping = true;
      this._setStyle(deltaX);
    }
  }

  onPanMove (e: any) {
    const { moveStatus } = e;
    const { x: deltaX } = moveStatus;
    if (!this.swiping) {
      return;
    }
    this._setStyle(deltaX);
  }

  onPanEnd (e: any) {
    if (!this.swiping) {
      return;
    }
    
    const { moveStatus } = e;
    const { x: deltaX } = moveStatus;

    const needOpenRight = this.needShowRight && Math.abs(deltaX) > this.btnsRightWidth / 2;
    const needOpenLeft = this.needShowLeft && Math.abs(deltaX) > this.btnsLeftWidth / 2;

    if (needOpenRight) {
      this.doOpenRight();
    } else if (needOpenLeft) {
      this.doOpenLeft();
    } else {
      this.close();
    }
    this.swiping = false;
    this.needShowLeft = false;
    this.needShowRight = false;
  }

  doOpenLeft () {
    this.open(this.btnsLeftWidth, true, false);
  }

  doOpenRight () {
    this.open(-this.btnsRightWidth, true, false);
  }

  onCloseSwipe (ev: Event) {
    if (!(this.openedLeft || this.openedRight)) {
      return;
    }
    const pNode = closest(ev.target, `.${this.prefixCls}-actions`);
    if (!pNode) {
      ev.preventDefault();
      this.close();
    }
  }

  _getContentEasing (value: number, limit: number) {
    // limit content style left when value > actions width
    const delta = Math.abs(value) - Math.abs(limit);
    const isOverflow = delta > 0;
    const factor = limit > 0 ? 1 : -1;
    if (isOverflow) {
      value = limit + Math.pow(delta, 0.85) * factor;
      return Math.abs(value) > Math.abs(limit) ? limit : value;
    }
    return value;
  }

  // set content & actions style
  _setStyle (value: number) {
    const limit = value > 0 ? this.btnsLeftWidth : -this.btnsRightWidth;
    const contentLeft = this._getContentEasing(value, limit);
    this.content.style.left = `${contentLeft}px`;
    if (this.cover) {
      this.cover.style.display = Math.abs(value) > 0 ? 'block' : 'none';
      this.cover.style.left = `${contentLeft}px`;
    }
  }

  open (value: number, openedLeft: boolean, openedRight: boolean) {
    if (!this.openedLeft && !this.openedRight && this.onOpen) {
      this.onOpen();
    }

    this.openedLeft = openedLeft;
    this.openedRight = openedRight;
    this._setStyle(value);
  }

  close () {
    if ((this.openedLeft || this.openedRight) && this.onClose) {
      this.onClose();
    }
    this._setStyle(0);
    this.openedLeft = false;
    this.openedRight = false;
  }

  onBtnClick (ev: Event, btn: any) {
    const onPress = btn.onPress;
    if (onPress) {
      onPress(ev);
    }
    if (this.autoClose) {
      this.close();
    }
  }

  mounted () {
    this.l = this.$refs.leftBtns;
    this.r = this.$refs.rightBtns;
    this.content = this.$refs.content;
    this.cover = this.$refs.cover;

    this.btnsLeftWidth = this.l ? this.l.offsetWidth : 0;
    this.btnsRightWidth = this.r ? this.r.offsetWidth : 0;
    document.body.addEventListener('touchstart', this.onCloseSwipe, true);
  }

  destroyed () {
    document.body.removeEventListener('touchstart', this.onCloseSwipe, true);
  }

  $refs!: {
    leftBtns: any,
    rightBtns: any,
    content: any,
    cover: any
  }

  renderButtons(h: CreateElement, buttons: any[], ref: string) {
    const prefixCls = this.prefixCls;

    return (buttons && buttons.length) ? (
      <div class={`${prefixCls}-actions ${prefixCls}-actions-${ref}`} ref={`${ref}Btns`}>
        {
          buttons.map((btn, i) => {
            return (
              <div key={i}
                class={`${prefixCls}-btn`}
                style={btn.style}
                role="button"
                onClick={(e: Event) => this.onBtnClick(e, btn)}
              >
                <div class={`${prefixCls}-btn-text`}>{btn.text || 'Click'}</div>
              </div>
            )
          })
        }
      </div>
    ) : null
  }

  render (h: CreateElement) {
    const prefixCls = this.prefixCls;
    const left = this.left;
    const right = this.right;
    const disabled = this.disabled;
    const autoClose = this.autoClose;
    const onOpen = this.onOpen;
    const onClose = this.onClose;

    const cls = this.swiping ? `${prefixCls} ${prefixCls}-swiping` : `${prefixCls}`;

    return (left!.length || right!.length) && !disabled ? (
      <div class={cls}>
        <div class={`${prefixCls}-cover`} ref="cover"></div>
        { this.renderButtons(h, left, 'left') }
        { this.renderButtons(h, right, 'right') }
        <v-touch
          onPanstart={this.onPanStart}
          onPanmove={this.onPanMove}
          onPanend={this.onPanEnd}
          onSwipeleft={this.doOpenRight}
          onSwiperight={this.doOpenLeft}
          pan-options={{direction: 'horizontal'}}
          swipe-options={{direction: 'horizontal'}}
        >
          <div class={`${prefixCls}-content`} ref="content">{this.$slots.default}</div>
        </v-touch>
      </div>
    ) : (
      <div>{this.$slots.default}</div>
    )
  }
}