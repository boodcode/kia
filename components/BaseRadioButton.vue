<template>
  <label :for="option.value">
    {{ option.label }}
    <input
      :id="option.value"
      type="radio"
      :value="option.value"
      name="radio-input"
      :checked="option.checked"

    />

  </label>
</template>

<script>
export default {
  props: {
    option: {
      required: true,
      type: Object,
    },
  },
};
</script>

<style scoped lang="scss">
  label {
    width:100px;
    display: flex;
    align-items: center;
    color: #fff;
    margin-right: 35px;
    font-size: 14px;
    color:#FFF;
    font-family: "Kia Signature Fix Bold", serif;
    input {
      width:18px !important;
      margin-left: 10px;
    }
  }
</style>
