<template>
  <div class="bt">
    <svg
      id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 762.3 762.3" style="enable-background:new 0 0 762.3 762.3;" xml:space="preserve">
      <style type="text/css">
        .st1{stroke-width:20;stroke-miterlimit:10;}
      </style>
        <g>
          <circle class="st1 bt-circle" cx="381.2" cy="381.2" r="371.2"/>
          <path
            class="arrow" d="M494.5,377.6l-71.4-71.4l-0.1-0.1c-1.6-1.4-3.7-2.3-5.8-2.4h-10.1c-2.4,0-3.3,1.4-3.5,2s-0.7,2.2,1.1,4
          l63.9,63.9H270.4c-1.6,0-2.9,0.7-3.6,1.9s-0.6,2.7,0.2,4l3.4,5.7l0.1,0.1c1.3,1.9,3.4,3.1,5.7,3.2h192.3l-63.9,63.9
          c-1.7,1.7-1.3,3.4-1.1,4s1.1,2.1,3.5,2.1h10.1c2.1-0.1,4.2-1,5.8-2.4l0,0l71.4-71.4c0.9-0.9,1.5-2.2,1.5-3.5
          S495.5,378.6,494.5,377.6L494.5,377.6z"/>
        </g>
    </svg>
  </div>
</template>

<style lang="scss">
  .bt {
    cursor: no-drop;
    position:relative;
    z-index:900;
    width: 50px;
    height: 50px;

    svg {
      width:100%;
      height: 100%;
      .arrow {
        fill:#FFFFFF;
      }
      .bt-circle {
        fill:none;
        stroke:#FFFFFF
      }
    }
    &.active {
      cursor: pointer;
      svg {
        .arrow {
          fill:#000000;
        }
        .bt-circle {
          fill:#FFFFFF;
          stroke:#FFFFFF
        }
      }
    }
  }
</style>
