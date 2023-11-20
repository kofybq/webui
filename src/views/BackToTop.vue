<!-- BackToTop.vue -->
<template>
  <div class="back-to-top" @click="handleClick">
    <el-button icon="el-icon-top" size="medium " circle></el-button>
  </div>
</template>
    
    <script>
export default {
  name: "BackToTop",
  props: {
    // icon: String, // 按钮图标的URL
    // text: String, // 按钮文本
    // color: String, // 按钮颜色
  },
  methods: {
    handleClick() {
      // 使用window.scrollTo()方法回到页面顶部
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
};
</script>
    
    <style scoped>
.back-to-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 30px;
}

.text {
  color: white;
}
</style>
    

    
