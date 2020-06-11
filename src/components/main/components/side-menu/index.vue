<template>
  <div class="menu-container">
    <ul class="menu">
      <!-- 左侧导航菜单 -->
      <li v-for="(item, idx) in menus"
          :key="idx"
          :name="item.name"
          class="tab"
          :class="activeTab === item.name ? 'active' : ''"
          @click="onClick(item.name)">
        <p>
          <span :class="'iconfont '+ item.meta.icon"></span>
          {{item.meta.title}}
        </p>

        <!-- 三级菜单 -->
        <!-- <template v-if="item.children && item.children.length > 0">
          <p v-for="(child,index) in item.children"
             :key="index"
             :class="activeTab === child.name ? 'active' : ''"
             @click="onClick(child.name)">
            {{child.meta.title}}
          </p>
        </template> -->
      </li>
    </ul>
  </div>
</template>
<script>
import mixin from './mixin'
import { mapGetters } from 'vuex'
import { DEFAULT_MEDIA_CODE } from '@/config/init-config.js'
import { hasModuleAccessFromAdmin, getLocalStorage } from '@/libs/util'

export default {
  name: 'SideMenu',
  mixins: [mixin],
  components: {},
  props: {
    menuList: {
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      activeTab: '',
      mediaCode: DEFAULT_MEDIA_CODE,
      menus: []
    }
  },
  methods: {
    onClick(name) {
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

      this.activeTab = name
    },
    handleRoutePushFromCache(cachePath) {
      this.$router.push({
        path: cachePath
      })
    },
    updateActiveNavByUrl() {
      const { name, path } = this.$route
      if (name && path.includes('tools/logger')) {
        this.activeTab = name
      }
      this.updateActiveTab()
    },
    updateActiveTab() {
      const { name, meta } = this.$route
      const activeName = meta.pName ? meta.pName : name
      this.activeTab =
        this.activeNav !== name
          ? activeName
          : this.menus.length && this.menus[0].children
          ? this.menus[0].children[0].name
          : ''
    }
  },
  computed: {
    ...mapGetters(['activeNav'])
  },
  watch: {
    activeNav(newVal) {
      const subMenu = this.menuList.filter(menu => menu.name === newVal)
      this.menus =
        subMenu && subMenu.length && subMenu[0].children
          ? subMenu[0].children
          : []
      this.activeTab =
        this.menus.length && this.menus[0].name ? this.menus[0].name : ''
    },
    $route() {
      this.updateActiveNavByUrl()
    }
  },
  created() {
    const { params } = this.$route
    if (params && params.mediaCode) {
      this.mediaCode = params.mediaCode
    }
    const navList = this.menuList.filter(route => {
      return route.name === this.activeNav
    })

    this.menus =
      navList && navList.length && navList[0].children
        ? navList[0].children
        : []
    this.menus = this.menus.filter(route => hasModuleAccessFromAdmin(route))
    this.updateActiveTab()
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
