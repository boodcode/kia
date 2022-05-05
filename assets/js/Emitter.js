import gsap from 'gsap'
import {Physics2DPlugin} from 'gsap/Physics2DPlugin'
import EventBus from "~/assets/js/utils/event-bus";

gsap.registerPlugin(Physics2DPlugin)


export default class Emitter {
  constructor() {
    this.emitter = document.getElementById("emitter");
    this.bounds = this.emitter.getBoundingClientRect();
    this.emitterSize = 60;
    this.dotPool = [];
    this.dotQuantity = 15;
    this.dotSizeMax = 80;
    this.dotSizeMin = 20;
    this.speed = 1;
    this.gravity = 0;
    this.dotIndex = 0;
    //
    this.init()
  }

  init = () => {
    gsap.set(this.emitter, {width: this.emitterSize, height: this.emitterSize, xPercent: -50, yPercent: -50});

    for (let i = this.dotQuantity - 1; i >= 0; i--) {
      const dot = document.createElement("div");
      dot.className = "dot";
      gsap.set(dot, {xPercent: -50, yPercent: -50, force3D: true});
      document.querySelector('#__nuxt').appendChild(dot);
      this.dotPool[i] = dot;

      // gsap.timeline({repeat: -1}).call(this.shootDot, [], 2 / this.dotQuantity);

    }
  }

  startAnim = () => {
    gsap.timeline({repeat: 10, onComplete: this.endOfAnimEvent}).call(this.shootDot, [], 2 / this.dotQuantity);
  }

  shootDot = () => {
    // create all the dots
    const dot = this.dotPool[this.dotIndex++];
    if (this.dotIndex === this.dotQuantity) this.dotIndex = 0;
    const size = this.getRandom(this.dotSizeMin, this.dotSizeMax);
    const angle = (Math.random() * Math.PI / 2) - (45 * 180 / Math.PI); // random angle
    // const angle = 30;
    // figure out the maximum distance from the center, factoring in the size of the dot (it must never go outside the circle), and then pick a random spot along that length where we'll plot the point.
    const length = Math.random() * (this.emitterSize / 2 - size / 2);
    // place the dot at a random spot within the emitter, and set its size.
    gsap.set(dot, {
      opacity: 1,
      x: Math.cos(angle) * length + this.bounds.left + this.bounds.width / 4,
      y: Math.sin(angle) * length - (window.innerHeight - this.bounds.top) - this.bounds.height / 4,
      width: size,
      height: size
    });
    // this is where we do the animation...
    gsap.to(dot, {
      duration: 1 + Math.random(),
      opacity: 0,
      physics2D: {
        angle: angle * 180 / Math.PI, // translate radians to degrees
        velocity: (100 + Math.random() * 250) * this.speed, // initial velocity
        gravity: 500 * this.gravity // you could increase/decrease this to give gravity more or less pull
      }
    });
  }

  getRandom = (min, max) => {
    return min + Math.random() * (max - min);
  }

  endOfAnimEvent = () => {
    EventBus.$emit("EMITTER_END")
  }
}
