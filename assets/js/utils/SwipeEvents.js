export default class SwipeEvents {
  constructor() {
    this.xDown = null;
    this.yDown = null;
    this.result = null;
 }

  getTouches = (evt) => {
    return evt.touches || evt.originalEvent.touches;
  }

  handleTouchStart= (evt) => {
    const firstTouch = this.getTouches(evt)[0];
    this.xDown = firstTouch.clientX;
    this.yDown = firstTouch.clientY;
  }

  handleTouchMove = (evt) => {
    if ( ! this.xDown || ! this.yDown ) {
      return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = this.xDown - xUp;
    const yDiff = this.yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/* most significant */
      if ( xDiff > 0 ) {
        /* left swipe */
        this.result = 'left'
      } else {
        /* right swipe */
        this.result = 'right'
      }
    } else if ( yDiff > 0 ) {
        /* up swipe */
      this.result = 'up'
      } else {
        /* down swipe */
      this.result = 'down'
      }
    /* reset values */
    this.xDown = null;
    this.yDown = null;

    // console.log(this.result)
    return this.result
  }
}

