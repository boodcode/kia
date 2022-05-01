import gsap, {Linear} from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Draggable} from "gsap/Draggable";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import EventBus from "~/assets/js/utils/event-bus";

gsap.registerPlugin(MotionPathPlugin, Draggable, DrawSVGPlugin, InertiaPlugin);

export default class VerticalSlider {
  constructor(element, settings) {
    this.range = element;
    this.endRangeValue = settings.endRangeValue || 55;

    this.settings = {
      drag_thickness: 14,
      drag_length: 250,
      pad_width: 12,
      pad_border_size: 6,
      endRangeValue: this.endRangeValue,
    }

    if('ontouchstart' in window){
      this.settings.pad_width *= 1.25
    }

    this.initRange(this.range);
  }

   initRange = () => {
      this.drawSVGPaths(this.range);
      this.initDrag(this.range);
  }

  drawSVGPaths = (element) => {
    const svg = document.querySelector('.slider-frequence#' + element.id +' svg');
     svg.setAttributeNS(null, 'width', this.settings.pad_width + this.settings.pad_border_size);
     svg.setAttributeNS(null, 'height', this.settings.drag_length);
     svg.setAttributeNS(null, 'viewBox', '0 0 '+(this.settings.pad_width + this.settings.pad_border_size)+' '+this.settings.drag_length);

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    const pad = document.createElementNS("http://www.w3.org/2000/svg", 'circle');


    gsap.set(svg, {overflow: 'visible'})
    gsap.set(path1, {
      attr: {
        id: "path1",
        x1:this.settings.drag_thickness/2, y1:this.settings.drag_length,
        x2:this.settings.drag_thickness/2, y2:0,
        fill: 'transparent',
        stroke:'#29160e',
        'stroke-width': this.settings.drag_thickness,
        'stroke-linecap': 'round',
      }
    })
    gsap.set(path2, {
      attr: {
        id: "path2",
        d: "M " + this.settings.drag_thickness/2 + " " + this.settings.drag_length+ " v -" + this.settings.drag_length,
        fill: 'transparent',
        stroke:'#ebe0d8',
        'stroke-width': this.settings.drag_thickness,
        'stroke-linecap': 'round',
        'filter': 'url(#inner-glow)'
      }
    })
    gsap.set(pad, {
      attr: {
        id: "pad",
        r: this.settings.pad_width*0.75,
        fill: '#f8b746',
        stroke:'#fff',
        'stroke-width': this.settings.pad_border_size,
      }
    })

    svg.appendChild(path1);
    svg.appendChild(path2);
    svg.appendChild(pad);
  }

  initDrag = (element) => {
    const pad = element.querySelector('#pad');
    const activePath = element.querySelector('#path2');
    const endRangeValue = this.settings.endRangeValue;
    const dragLength = this.settings.drag_length;
    const rangeId = this.range.id;


    gsap.set(pad, {
      transformOrigin:  "0px 0px",
      x:(this.settings.drag_thickness)/2,
      y:this.settings.drag_length
    })

    const tl = gsap.timeline({paused: true});
    tl.from(activePath, {
      drawSVG: 0,
      ease: "none",
      duration:1
    })
    tl.to(pad, {
      duration:0,
      ease: Linear.easeNone
    })

    Draggable.create(pad, {
      type: 'y',
      bounds: {minY:0, maxY: this.settings.drag_length},
      liveSnap:{
        y: [0, 125, 225, 250]
      },
      onDrag() {
        const progress = this.y / dragLength;
        tl.time(1 - progress)

        EventBus.$emit("DRAGEND_CHOICE3", {
          elem: this.target.closest('.slider-frequence'),
          value: Math.round(endRangeValue - progress * endRangeValue),
          eventType: 'onDragFrequence',
          elemId: rangeId
        });
      },
      onDragEnd(){
        const progress = this.y / dragLength;
        EventBus.$emit("DRAGEND_CHOICE3", {
          elem: this.target.closest('.slider-frequence'),
          value: Math.round(endRangeValue - progress * endRangeValue),
          eventType: 'onDragEndFrequence',
          elemId: rangeId
        });
      }
    });
  }
}
