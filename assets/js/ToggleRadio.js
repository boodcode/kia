import gsap, {Linear, Expo} from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Draggable} from "gsap/Draggable";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import EventBus from "~/assets/js/utils/event-bus";

gsap.registerPlugin(MotionPathPlugin, Draggable, DrawSVGPlugin, InertiaPlugin);

export default class ToggleRadio {
  constructor(element, settings) {
    this.range = element;
    this.endRangeValue = settings.endRangeValue || 100;

    this.settings = {
      drag_thickness: 20,
      drag_length: 45,
      pad_width: 12,
      pad_border_size: 6,
      endRangeValue: this.endRangeValue,
    }

    this.initRange(this.range);
  }

   initRange = () => {
      this.drawSVGPaths(this.range);
      this.initDrag(this.range);
  }

  drawSVGPaths = (element) => {
    const svg = document.querySelector('.toggle-radio#' + element.id +' svg');
    svg.setAttributeNS(null, 'width', this.settings.drag_length);
    svg.setAttributeNS(null, 'height', this.settings.drag_thickness);
    svg.setAttributeNS(null, 'viewBox', '0 0 '+this.settings.drag_length+' '+this.settings.drag_thickness);

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    const pad = document.createElementNS("http://www.w3.org/2000/svg", 'circle');


    gsap.set(svg, {overflow: 'visible'})
    gsap.set(path1, {
      attr: {
        id: "path1",
        x1:0, y1:this.settings.drag_thickness/2,
        x2:this.settings.drag_length, y2:this.settings.drag_thickness/2,
        fill: 'transparent',
        stroke:'#29160e',
        'stroke-width': this.settings.drag_thickness,
        'stroke-linecap': 'round',
      }
    })
    gsap.set(path2, {
      attr: {
        id: "path2",
        d: "M " + 0 + " " + this.settings.drag_thickness/2+ " h " + this.settings.drag_length,
        fill: 'transparent',
        stroke:'#ebe0d8',
        'stroke-width': this.settings.drag_thickness,
        'stroke-linecap': 'round',
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
      transformOrigin: (this.settings.pad_width) + "px " + "0px",
      x:0 ,
      y:this.settings.drag_thickness/2
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

    let progress = 0;
    Draggable.create(pad, {
      type: 'x',
      bounds: {minX:0, maxX: this.settings.drag_length},
      liveSnap(value) {
        return (Math.round(value / dragLength) * dragLength);
      },
      onDrag(){
        progress = this.x / dragLength;
        tl.progress(progress)
        EventBus.$emit("DRAGEND", {
          elem: this.target.closest('.toggle-radio'),
          value: Math.round( progress),
          eventType: 'onDragEndRecharge',
          elemId: rangeId
        });
      },
      onDragEnd(){
        progress = this.x / dragLength;
        // tl.progress(progress)
        EventBus.$emit("DRAGEND", {
          elem: this.target.closest('.toggle-radio'),
          value: Math.round( progress),
          eventType: 'onDragEndRecharge',
          elemId: rangeId
        });
      }
    });

    element.addEventListener('click', ()=> {
      progress = 1 - progress;
        tl.progress(progress)
        gsap.to(pad, {x:progress * dragLength, duration:0.4, ease:Expo.easeOut})

        EventBus.$emit("DRAGEND", {
          elem: element,
          value:  progress,
          eventType: 'onDragEndRecharge',
          elemId: rangeId
        });
      })
  }
}
