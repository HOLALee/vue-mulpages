<template>
  <div class="">
    <header class="header">
      <h1>首页-><a href="#/indexsub">子页面</a></h1>
      <div>
        <a href="page2.html">page2</a> 
      </div>
    </header>
    
  </div>
</template>

<script>
  import CONSTANT from '@/lib/Constant'

export default {
  name: 'main',
  data () {
    return {
      'data': this.$store.state.data
    }
  },
  created () {
    // 创建成功，data与el对象已可用
    var self = this
    // 邀约码
    var YYM = self.$util.getQueryString('YYM', location.search)
    // 渠道
    var CHANNEL = self.$util.getQueryString('CHANNEL', location.search)
    // 分享人
    var INVITE = self.$util.getQueryString('INVITE', location.search)

    self.data.YYM = YYM
    self.data.CHANNEL = CHANNEL
    self.data.INVITE = INVITE
    // 缓存到localStorage
    self.$store.commit('$_setStorage', self.data)

  },
  methods: {
    
  }
}
</script>

<style lang="scss" type="text/css">
</style>
