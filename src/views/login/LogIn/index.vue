<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import type { FormRules } from 'naive-ui'
import { NAlert, NButton, NForm, NFormItem, NInput } from 'naive-ui'
import type { LoginResModel } from '../../../../service/src/types'
import { fetchLogin, fetchRegister } from '@/api'

const router = useRouter()

const loginForm = ref({
  username: '',
  password: '',
})

const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
})

const loginErrorMessage = ref('')
const registerErrorMessage = ref('')

const loginRules: FormRules = {
  username: [{ required: true, message: 'Please enter your username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter your password', trigger: 'blur' }],
}

const registerRules: FormRules = {
  username: [{ required: true, message: 'Please enter your username', trigger: 'blur' }],
  password: [
    { required: true, message: 'Please enter yourpassword', trigger: 'blur' },
    { min: 6, max: 20, message: 'Password length should be between 6 and 20 characters', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
  ],
}
const login = () => {
  fetchLogin<LoginResModel>({
    username: loginForm.value.username,
    password: loginForm.value.password,
  }).then((response) => {
    alert('登录成功')
    localStorage.setItem('token', response.data.token || '')
    localStorage.setItem('pFlag', `${response.data.pFlag}`)
    router.push('/chat')
  }).catch((error) => {
    alert(`登录失败：${error}`)
  })
}

const register = () => {
  // console.log(registerForm.value.username)
  fetchRegister<string>({
    username: registerForm.value.username,
    password: registerForm.value.password,
    email: registerForm.value.email,
  }).then((response) => {
    alert('注册成功，请登录')
  }).catch((error) => {
    console.error('注册失败 ', error)
    alert(`注册失败: ${error}`)
  })
}
</script>

<template>
  <div>
    <div class="login-form" style="padding-top: 40px; border-color: black">
      <img style="height: 200px; width: 400px" src="https://lanyun1103-1300568527.cos.ap-nanjing.myqcloud.com/pic/1.png">
      <NSpace>
        <span>目前OPENAI API已使用费用 80$，理论上已经开启了每人只可以回答十个问题的限制<br></span>
        <span>如果希望每日回答无限次数，每月15元让我回回本就可以了/(ㄒoㄒ)/~~<br></span>
        <span>连夜赶出来的登录功能，还没有校验，且用且珍惜，已经打赏过的用户名带上本人姓名最后一个字即可<br></span>
        <NText strong>
          登录页面
        </NText>
        <NForm ref="loginForm" :model="loginForm" :rules="loginRules">
          <NFormItem label="Username" prop="username">
            <NInput v-model:value="loginForm.username" placeholder="请输入用户名哦~" />
          </NFormItem>
          <NFormItem label="Password" prop="password">
            <NInput v-model:value="loginForm.password" type="password" placeholder="请输入密码哦~" />
          </NFormItem>
          <NFormItem>
            <NButton class="page-button" type="primary" style="margin-top: -50px" @click="login">
              Login
            </NButton>
          </NFormItem>
        </NForm>
        <NAlert v-if="loginErrorMessage" title="Error" type="error" :show-icon="true" :closable="true">
          {{ loginErrorMessage }}
        </NAlert>
      </NSpace>
    </div>

    <div class="login-form">
      <NSpace>
        <NText>还没有账号？</NText>
        <NForm ref="registerForm" :model="registerForm" :rules="registerRules">
          <NFormItem label="Username" prop="username">
            <NInput v-model:value="registerForm.username" placeholder="输入你的用户名" />
          </NFormItem>
          <NFormItem label="Email" prop="email">
            <NInput v-model:value="registerForm.email" placeholder="输入你的邮箱" />
          </NFormItem>
          <NFormItem label="Password" prop="password">
            <NInput v-model:value="registerForm.password" type="password" placeholder="输入密码" />
          </NFormItem>
          <NFormItem label="Confirm Password" prop="confirmPassword">
            <NInput v-model:value="registerForm.confirmPassword" type="password" placeholder="确认密码" />
          </NFormItem>
          <NFormItem>
            <NButton class="page-button" type="primary" style="margin-top: -50px" @click="register">
              Register
            </NButton>
          </NFormItem>
        </NForm>
        <NAlert v-if="registerErrorMessage" title="Error" type="error" :show-icon="true" :closable="true">
          {{ registerErrorMessage }}
        </NAlert>
      </NSpace>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-form{
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}
.page-button{
    margin-left: 50px;
}
</style>
