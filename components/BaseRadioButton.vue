<template>
  <label :for="option.value">
    <input
      :id="option.value"
      type="radio"
      :value="option.value"
      :name="option.name"
      :checked="option.checked"
    />
    {{ option.label }}
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
    margin: 5px 15px 0 0;
    font-size: 14px;
    color:#FFF;
    font-family: "Kia Signature Fix Bold", serif;
    input {
      width:18px !important;
      margin-right: 10px;
    }
  }
</style>
