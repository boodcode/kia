<template>
  <div>
    <h3 v-html="title"></h3>
    <p>{{subtitle}}</p>
    <div class="content">
      <ul class="order-infos">
        <li v-for="(element,k) in list" :key="k" class="ordre">{{ k+1 }} - </li>
      </ul>

      <draggable
        v-model="list"
        class="list-group"
        tag="ul"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
        @update="onUpdate"
      >

        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <li
            v-for="element in list"
            :id="element.id"
            :key="element.order"
            class="list-group-item"
          >
            <i
              :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
              aria-hidden="true"
              @click="element.fixed = !element.fixed"
            ></i>
            {{ element.name }}
          </li>
        </transition-group>
      </draggable>
    </div>
    <NavButtons></NavButtons>
  </div>
</template>
<script>

import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },
  data(){
    return {
      title: 'Vos priorités sont',
      subtitle: 'Faites glisser de haut en bas pour choisir l’ordre',
      enabled: true,
      list: [
        {id: 'coffre', name:'La taille du coffre', order: 1},
        {id: 'puissance', name:'La puissance du véhicule', order: 2},
        {id: 'silence', name:'Rouler sans bruit', order: 3},
        {id: 'autonomie', name:"L'autonomie", order: 4},
      ],
      drag: false

    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  mounted() {
  },
  methods: {
    sort() {
      this.list = this.list.sort((a, b) => a.order - b.order);
    },
    onUpdate(){
      const prioritySorted = {};
      document.querySelectorAll('.list-group-item').forEach((elem, i)=> {
        prioritySorted['p'+(i+1)] = elem.id
      })
      this.$store.commit('user/updateConduite', {...this.$store.state.user.conduite, priority:prioritySorted})
    }
  }
}
</script>
<style lang="scss">

.flip-list-move {
  transition: transform 0.5s 'ease-out';
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group, .order-infos {
  min-height: 20px;
  margin:1em 0;
  padding-left: 0;

  @media screen and(max-width: 640px){
    margin:0.5em 0;
  }
}

  .list-group-item i {
    cursor: move;
  }
  .order-infos {

    .ordre {
      position:relative;
      padding: 0;
      height:80px;
      font-size: 20px;
      color:#FFFFFF;
      display: flex;
      align-items: center;
      margin: 5px 0px;

      @media screen and (max-width: 640px) {
        height:60px;
        font-size: 16px;
      }
    }
  }

  .list-group-item {
    position:relative;
    padding: 0 100px 0 30px;
    border:1px solid #514634;
    background-color: #2e2521;
    height:78px;
    font-size: 20px;
    color:#FFFFFF;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: move;
    margin: 5px 10px;

    @media screen and (max-width: 640px){
      padding: 0 80px 0 20px;
      font-size: 16px;
      height:58px;
    }

    &:after {
      content:"";
      position: absolute;
      top:0;right:20px;
      width:14px;
      height:100%;
      background-image: url('~assets/images/pad@2x.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
  }


</style>
