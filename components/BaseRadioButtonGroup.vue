<template>
  <div class="input-group">
    <BaseRadioButton v-for="option in options" :key="option.value" :option="option" />
  </div>
</template>

<script>
import BaseRadioButton from "./BaseRadioButton.vue";

export default {
  name: "BaseRadionButtonGroup",
  components: {
    BaseRadioButton,
  },
  props: {
    options: {
      required: true,
      type: Array,
    },
  },
};
</script>

<style scoped lang="scss">
.input-group {
  display: flex;
  justify-content: flex-start;

}

label {
  cursor: pointer;
}
</style>
