<template>
  <div class="header">
    <div class="logo">
      <span class="logo-view"></span>
    </div>
    <nav class="nav">
      <div v-for="(item,index) in menuList"
           :key="index">
        <template v-if="!item.meta.hideInMenu">
          <p :class="item['name'] === activeNav ? 'active nav-item' : 'nav-item'"
             @click="handleNavClick(item['name'])">{{item['meta'].title}}</p>
        </template>
      </div>

    </nav>
    <user class="user"
          :message-unread-count="unreadCount"
          :user-avatar="userAvatar" />
    <div class="message">
      <img class="message-img"
           src="../../../../assets/images/notice.png"
           alt=""
           @click="openNotice">
      <span v-if='hasNewUpdates'
            class="red-dot"></span>
    </div>
  </div>
</template>

<script>
import User from '../user'
import { mapActions } from 'vuex'
import Cookies from 'js-cookie'
import { getLocalStorage } from '@/libs/util'

export default {
  name: 'RyHeader',
  components: { User },
  mixins: [],
  props: {
    menuList: {
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      activeNav: '',
      userAvatar: '',
      unreadCount: 0,
      hasNewUpdates: Cookies.get('hasNewUpdates')
        ? JSON.parse(Cookies.get('hasNewUpdates'))
        : true
    }
  },
  methods: {
    ...mapActions('header', ['setActiveNav']),
    handleNavClick(name) {
      this.activeNav = name
      const cachedRoutes = getLocalStorage('CACHED_ROUTES')
      const hasCache = _.has(cachedRoutes, name)

      if (hasCache) {
        this.handleRoutePushFromCache(cachedRoutes[name])
      } else {
        this.$router.push({
          name
          // params: {
          //   mediaCode: this.mediaCode
          // }
        })
      }

      this.setActiveNav(name)
    },
    handleRoutePushFromCache(cachePath) {
      this.$router.push({
        path: cachePath
      })
    },
    updateNavByUrl() {
      const { meta } = this.$route

      if (meta && meta.cName) {
        this.activeNav = meta.cName
        this.setActiveNav(meta.cName)
      }
    },
    openNotice() {
      const flag = JSON.stringify(false)
      Cookies.remove('hasNewUpdate')

      Cookies.set('hasNewUpdates', flag, {
        expires: 30
      })
      this.hasNewUpdates = false
      this.$emit('openNotice')
    }
  },
  created() {
    const { name, meta } = this.$route
    const activeNav = meta.cName || name
    if (activeNav) {
      this.activeNav = activeNav
      this.setActiveNav(activeNav)
    }
  },
  mounted() {},
  computed: {},
  watch: {
    $route() {
      this.updateNavByUrl()
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
