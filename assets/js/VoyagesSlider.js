import gsap, {Linear} from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Draggable} from "gsap/Draggable";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import EventBus from "~/assets/js/utils/event-bus";

gsap.registerPlugin(MotionPathPlugin, Draggable, DrawSVGPlugin, InertiaPlugin);

export default class VoyagesSlider {
  constructor(element, settings) {

    this.range = element;
    this.endRangeValue = settings.endRangeValue || 55;

    this.settings = {
      circle_radius : 140,
      circle_thickness: 14,
      circle_angle_start: 0,
      circle_angle_active: 30,
      circle_angle_end: 180,
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
    const svg = document.querySelector('.circle-voyages#' + element.id +' svg');
    svg.setAttributeNS(null, 'width', this.settings.circle_radius);
    svg.setAttributeNS(null, 'height', this.settings.circle_radius*2);
    svg.setAttributeNS(null, 'viewBox', this.settings.circle_radius+' 0 '+this.settings.circle_radius+' '+this.settings.circle_radius*2);

    const debordOuterCircle = 8;

    const endPathX = this.settings.circle_radius + (this.settings.circle_radius - this.settings.circle_thickness/2) * Math.sin(this.settings.circle_angle_end * Math.PI/180)
    const endPathY = this.settings.circle_radius - (this.settings.circle_radius - this.settings.circle_thickness/2) * Math.cos(this.settings.circle_angle_end * Math.PI/180)
    const endPathOuterY = this.settings.circle_radius - (this.settings.circle_radius +debordOuterCircle*2) * Math.cos(this.settings.circle_angle_end * Math.PI/180)
    const endPathOuterY2 = this.settings.circle_radius - (this.settings.circle_radius +debordOuterCircle) * Math.cos(this.settings.circle_angle_end * Math.PI/180)

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    const outerCircle = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    const outerCircle2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    const pad = document.createElementNS("http://www.w3.org/2000/svg", 'circle');

    const pathDValue = 'M' + this.settings.circle_radius + ',' + this.settings.circle_thickness/2 +' A' + (this.settings.circle_radius - this.settings.circle_thickness/2) +',' + (this.settings.circle_radius - this.settings.circle_thickness/2) +' 0 1,1 '+endPathX+','+endPathY;
    const outerPathDValue = 'M' + (this.settings.circle_radius) + ',-' + (this.settings.circle_thickness/2+debordOuterCircle) +' A' + (this.settings.circle_radius +debordOuterCircle) +',' + (this.settings.circle_radius+debordOuterCircle ) +' 0 1,1 '+endPathX+','+endPathOuterY;
    const outerPathDValue2 = 'M' + (this.settings.circle_radius) + ',-' + (this.settings.circle_thickness/2 ) +' A' + (this.settings.circle_radius ) +',' + (this.settings.circle_radius  ) +' 0 1,1 '+endPathX+','+endPathOuterY2;


    /**
     * UNITS
     *
     */
    const unitDecalage = 12;
    const unitSize = 8;
    for(let a=-90; a <= this.settings.circle_angle_end -90 ; a+=6){
      const unitDefSize = (a % 30 ===0) ?  unitSize : unitSize/3;
      const unitDefDecalage = (a % 30 ===0) ? unitDecalage + unitSize/3 : unitDecalage;
      const unitPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
      gsap.set(unitPath, {
        attr:{
          id:'unit-'+a,
          stroke: '#8e7a5c',
          'stroke-width': 1,
          d: 'M ' + (this.settings.circle_radius +  (this.settings.circle_radius - unitDefDecalage*2) * Math.cos(a * Math.PI/180)) +
            ' ' + (this.settings.circle_radius + (this.settings.circle_radius - unitDefDecalage*2) * Math.sin(a * Math.PI/180)) +
            ' l ' + (unitDefSize * Math.cos(a * Math.PI/180)) +
            ' ' + (unitDefSize * Math.sin(a * Math.PI/180))
        }
      })
      svg.appendChild(unitPath);
    }



    gsap.set(svg, {overflow: 'visible'})
    gsap.set(path1, {
      attr: {
        id: "path1",
        d: pathDValue,
        fill: 'transparent',
        stroke:'#29160e',
        'stroke-width': this.settings.circle_thickness,
        'stroke-linecap': 'round',
        // style: 'filter: url(#glow);'
      }
    })
    gsap.set(path2, {
      attr: {
        id: "path2",
        d: pathDValue,
        fill: 'transparent',
        stroke:'#ebe0d8',
        'stroke-width': this.settings.circle_thickness,
        'stroke-linecap': 'round',
        'filter': 'url(#inner-glow)'
      }
    })
    gsap.set(pad, {
      attr: {
        id: "pad",
        r: this.settings.pad_width,
        fill: '#f8b746',
        stroke:'#fff',
        'stroke-width': this.settings.pad_border_size,
      }
    })
    gsap.set(outerCircle, {
      attr: {
        id: 'outerCircle',
        d: outerPathDValue,
        fill: 'transparent',
        stroke:'#514634',
        'stroke-width': 1,
      }
    })
    gsap.set(outerCircle2, {
      attr: {
        id: 'outerCircle2',
        d: outerPathDValue2,
        fill: 'transparent',
        stroke:'#352b29',
        'stroke-width': 14,
      }
    })
    svg.appendChild(outerCircle);
    svg.appendChild(outerCircle2);

    svg.appendChild(path1);
    svg.appendChild(path2);
    svg.appendChild(pad);
  }

  initDrag = (element) => {
    const pad = element.querySelector('#pad');
    const activePath = element.querySelector('#path2');
    const endRotation = this.settings.circle_angle_end;
    const endRangeValue = this.settings.endRangeValue;

    // gsap.set(pad, {
    //   transformOrigin: (0.5*(this.settings.pad_width + 2*this.settings.pad_border_size)) + "px "+ (this.settings.circle_radius + 0.6*(this.settings.circle_thickness)) +"px",
    //   x:this.settings.circle_radius,
    //   y:this.settings.circle_thickness/2 - this.settings.pad_border_size/2
    // })

    gsap.set(pad, {
      transformOrigin:
        ((this.settings.pad_width + this.settings.pad_border_size)/2) + "px " +
        (this.settings.circle_radius + (this.settings.circle_thickness /3)) +"px",
      x:this.settings.circle_radius + this.settings.pad_width/2 ,
      y:this.settings.pad_width/2 + this.settings.pad_border_size/2
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

    const snapAngle = 15;
    Draggable.create(pad, {
      type: 'rotation',
      bounds: {minRotation:0, maxRotation:this.settings.circle_angle_end},
      dragClickables: false,
      liveSnap(value){
        return Math.round(value / snapAngle) * snapAngle;
      },
      onDrag() {
        const rotation = parseInt(this.rotation % 360, 10);
        const progress = rotation / endRotation;
        tl.time(progress)
        EventBus.$emit("DRAGEND_CHOICE2", {
          elem: this.target.closest('.circle-voyages'),
          valueStep2: progress * endRangeValue,
          eventType: 'onDragVoyages'
        });
      },
      onDragEnd(){
        const rotation = parseInt(this.rotation % 360, 10);
        const progress = rotation / endRotation;
        EventBus.$emit("DRAGEND_CHOICE2", {
          elem: this.target.closest('.circle-voyages'),
          valueStep2: progress * endRangeValue,
          eventType: 'onDragEndVoyages'
        });
      }
    });
  }
}
