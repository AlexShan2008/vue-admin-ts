<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick"
              transfer-class-name="user-dropdown"
              transfer>
      <div class="user">
        <img class="user-img"
             src="../../../../assets/images/profile.png"
             alt="">
        <div class="username-container">
          <span class="username-class">
            {{$store.state.user.userName}}（ {{userRule}} ）
          </span>
          <Icon :size="18"
                type="md-arrow-dropdown"></Icon>
        </div>
      </div>
      <DropdownMenu slot="list">
        <DropdownItem disabled>{{$store.state.user.email}}</DropdownItem>
        <DropdownItem disabled
                      divided>{{$store.state.user.expireTime}}</DropdownItem>
        <DropdownItem v-if="!fromGadgets"
                      name="changpwd">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <!-- 修改密码 -->
    <Modal v-model="changePwdModalStatus">
      <div slot="header"
           class="tac">修改密码</div>
      <Form ref="formCustom"
            :model="formCustom"
            :rules="ruleCustom"
            :label-width="100">
        <FormItem label="原始密码"
                  prop="oldPasswd">
          <Input type="password"
                 v-model="formCustom.oldPasswd" />
        </FormItem>
        <FormItem label="新密码"
                  prop="passwd">
          <Input type="password"
                 v-model="formCustom.passwd" />
        </FormItem>
        <FormItem label="再次输入新密码"
                  prop="passwdCheck">
          <Input type="password"
                 v-model="formCustom.passwdCheck" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary"
                @click="handlePostNewPwd">确认</Button>
        <Button @click="handleChangePwdModalStatus">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import md5 from 'md5'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    const validateOldPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原始密码'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.formCustom.passwdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField('passwdCheck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formCustom.passwd) {
        callback(new Error('两次输入密码不同'))
      } else {
        callback()
      }
    }
    return {
      formCustom: {
        oldPasswd: '',
        passwd: '',
        passwdCheck: ''
      },
      ruleCustom: {
        oldPasswd: [
          {
            trigger: 'blur',
            validator: validateOldPwd,
            message: '请输入原始密码'
          }
        ],
        passwd: [{ validator: validatePass, trigger: 'blur' }],
        passwdCheck: [{ validator: validatePassCheck, trigger: 'change' }]
      },
      changePwdModalStatus: false
    }
  },
  methods: {
    ...mapActions(['handleLogOut', 'changePwd']),
    logout() {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message() {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleChangePwdModalStatus() {
      this.changePwdModalStatus = !this.changePwdModalStatus
      this.formCustom.passwd = ''
      this.formCustom.passwdCheck = ''
    },
    handleClick(name) {
      switch (name) {
        case 'changpwd':
          this.handleChangePwdModalStatus()
          break
        case 'logout':
          this.logout()
          break
        case 'message':
          this.message()
          break
      }
    },
    // 提交修改密码
    handlePostNewPwd() {
      this.$refs.formCustom.validate(valid => {
        if (!valid) {
          return false
        }
        let username = this.$store.state.user.email
        let oldPassword = md5(this.formCustom.oldPasswd)
        let newPassword = md5(this.formCustom.passwd)
        this.changePwd({ username, oldPassword, newPassword })
          .then(res => {
            this.handleChangePwdModalStatus()
            this.$Message.warning({
              content: '修改成功, 将退出重新登录',
              duration: 3
            })
            setTimeout(() => {
              location.reload()
            }, 3000)
          })
          .catch(error => {
            this.$Message.error(error.message)
          })
      })
    }
  },
  computed: {
    userRule() {
      let access = this.$store.state.user.access[0]
      let rule = ''
      switch (access) {
        case 'ADMIN':
          rule = '管理员'
          break
        case 'MANAGER':
          rule = '优化经理'
          break
        case 'OPERATE':
          rule = '优化师'
          break
        case 'DESIGNER':
          rule = '设计师'
          break
      }
      return rule
    },
    fromGadgets() {
      return this.$store.state.user.fromGadgets
    }
  }
}
</script>
