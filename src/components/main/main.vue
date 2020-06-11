<template>
  <div class="container">Main</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Main extends Vue {
  @Prop() private msg!: string
}
</script>
<style lang="less" scoped>
@import './main.less';
</style>
