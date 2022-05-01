import gsap, {Linear} from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Draggable} from "gsap/Draggable";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import EventBus from "~/assets/js/utils/event-bus";

gsap.registerPlugin(MotionPathPlugin, Draggable, DrawSVGPlugin, InertiaPlugin);

export default class RangeSlider {
  constructor(element, settings) {
    this.range = element;
    this.endRangeValue = settings.endRangeValue || 55;

    this.settings = {
      circle_radius : 96,
      circle_thickness: 14,
      circle_angle_start: 0,
      circle_angle_active: 30,
      circle_angle_end: 330,
      pad_width: 12,
      pad_border_size: 6,
      endRangeValue: this.endRangeValue,
    }

    if('ontouchstart' in window){
      this.settings.pad_width *= 1.5
    }

    this.initRange(this.range);
  }

   initRange = () => {
      this.drawSVGPaths(this.range);
      this.initDrag(this.range);
  }

  drawSVGPaths = (element) => {
    const svg = document.querySelector('.circle#' + element.id +' svg');
     svg.setAttributeNS(null, 'width', this.settings.circle_radius*2);
     svg.setAttributeNS(null, 'height', this.settings.circle_radius*2);
     svg.setAttributeNS(null, 'viewBox', '0 0 '+this.settings.circle_radius*2+' '+this.settings.circle_radius*2);

    const endPathX = this.settings.circle_radius + (this.settings.circle_radius - this.settings.circle_thickness/2) * Math.sin(this.settings.circle_angle_end * Math.PI/180)
    const endPathY = this.settings.circle_radius - (this.settings.circle_radius - this.settings.circle_thickness/2) * Math.cos(this.settings.circle_angle_end * Math.PI/180)
    const path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    const outerCircle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');

    const pad = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    const pathDValue = 'M' + this.settings.circle_radius + ',' + this.settings.circle_thickness/2 +' A' + (this.settings.circle_radius - this.settings.circle_thickness/2) +',' + (this.settings.circle_radius - this.settings.circle_thickness/2) +' 0 1,1 '+endPathX+','+endPathY;


    gsap.set(outerCircle, {
      attr: {
        id: 'outerCircle',
        cx: this.settings.circle_radius,
        cy: this.settings.circle_radius,
        r: this.settings.circle_radius + 32,
        fill: 'transparent',
        stroke:'#514634',
        'stroke-width': 1,
      }
    })
    svg.appendChild(outerCircle);


    /**
     * UNITS
     *
     */
    const unitDecalage = 14;
    const unitSize = 8;
    for(let a=-90; a <= this.settings.circle_angle_end -90 ; a+=6){
      const unitDefSize = (a % 30 ===0) ?  unitSize : unitSize/3;
      const unitDefDecalage = (a % 30 ===0) ? unitDecalage- unitSize/2 : unitDecalage;
      const unitPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
      gsap.set(unitPath, {
        attr:{
          id:'unit-'+a,
          stroke: '#8e7a5c',
          'stroke-width': 1,
          d: 'M ' + (this.settings.circle_radius + (this.settings.circle_radius + unitDefDecalage) * Math.cos(a * Math.PI/180)) +
            ' ' + (this.settings.circle_radius + (this.settings.circle_radius + unitDefDecalage) * Math.sin(a * Math.PI/180)) +
            ' l ' + (unitDefSize * Math.cos(a * Math.PI/180)) +
            ' ' + (unitDefSize * Math.sin(a * Math.PI/180))
        }
      })
      svg.appendChild(unitPath);

      if(a % 90 === 0 || a === this.settings.circle_angle_end - 90) {
        const unitText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        unitText.textContent = (this.settings.endRangeValue* (a + 90)/this.settings.circle_angle_end).toLocaleString();
        if(a === this.settings.circle_angle_end - 90) {unitText.textContent = '+'+unitText.textContent;}
        unitText.setAttributeNS(null, 'id', 'text-'+a)
        svg.appendChild(unitText);
        unitText.setAttributeNS(null, 'x', this.settings.circle_radius + (this.settings.circle_radius + unitDefDecalage+4) * Math.cos(a * Math.PI/180) + unitText.getBBox().width * Math.cos(a*Math.PI/180))
        unitText.setAttributeNS(null, 'y', this.settings.circle_radius + (this.settings.circle_radius + unitDefDecalage+8) * Math.sin(a * Math.PI/180) + unitText.getBBox().height * Math.sin(a*Math.PI/180))
        unitText.setAttributeNS(null, 'transform', 'translate(-' + unitText.getBBox().width/2 + ' ' + unitText.getBBox().height/3+')')
        // bg
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        const SVGRect = unitText.getBBox();
        rect.setAttribute("class", 'unitTextBg');
        rect.setAttribute("x", SVGRect.x);
        rect.setAttribute("y", SVGRect.y);
        rect.setAttribute("width", SVGRect.width);
        rect.setAttribute("height", SVGRect.height);
        rect.setAttribute("fill", "#352b29");
        rect.setAttribute( 'transform', 'translate(-' + unitText.getBBox().width/2 + ' ' + unitText.getBBox().height/3+')')

        svg.insertBefore(rect, unitText);

      }
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
    const endRotation = this.settings.circle_angle_end;
    const endRangeValue = this.settings.endRangeValue;

    gsap.set(pad, {
      transformOrigin: (0.5*(this.settings.pad_width + this.settings.pad_border_size)) + "px "+ (this.settings.circle_radius + 0.25*(this.settings.circle_thickness)) +"px",
      x:96,
      y:8
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
      liveSnap(value){
        return Math.round(value / snapAngle) * snapAngle;
      },
      onDrag() {
        const rotation = parseInt(this.rotation % 360, 10);
        const progress = rotation / endRotation;
        tl.time(progress)
        EventBus.$emit("DRAGEND_CHOICE1", {
          elem: this.target.closest('.circle'),
          value: progress * endRangeValue,
          eventType: 'onDrag'
        });
      },
      onDragEnd(){
        const rotation = parseInt(this.rotation % 360, 10);
        const progress = rotation / endRotation;
        EventBus.$emit("DRAGEND_CHOICE1", {
          elem: this.target.closest('.circle'),
          value: progress * endRangeValue,
          eventType: 'onDragEnd'
        });
      },
    });
  }
}
