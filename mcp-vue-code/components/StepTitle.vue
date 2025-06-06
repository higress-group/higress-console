<template>
  <div
    style="
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    "
  >
    <div
      style="
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: 1px solid rgb(25, 28, 31);
        position: relative;
      "
    >
      <div
        style="
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgb(25, 28, 31);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "
      ></div>
    </div>
    <slot />
  </div>
</template>
<script>
  export default {
    name: 'StepTitle',
  }
</script>
