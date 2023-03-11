<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { NAlert, NButton, NForm, NFormItem, NInput } from 'naive-ui'
import axios from 'axios'
const router = useRouter()
const api = axios.create({
  baseURL: 'http://localhost:3002', // 将此处的 URL 替换为您的后端 API URL
})

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

const loginRules = {
  username: [{ required: true, message: 'Please enter your username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter your password', trigger: 'blur' }],
}

const registerRules = {
  username: [{ required: true, message: 'Please enter your username', trigger: 'blur' }],
  password: [
    { required: true, message: 'Please enter yourpassword', trigger: 'blur' },
    { min: 6, max: 20, message: 'Password length should be between 6 and 20 characters', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
    {
      validator(rule, value, callback) {
        if (value !== registerForm.value.password)
          callback(new Error('The two passwords do not match'))
        else
          callback()
      },
      trigger: 'blur',
    },
  ],
}

const showError = (message) => {
  // 显示错误提示框
  loginErrorMessage.value = message
  registerErrorMessage.value = message
}
const login = (e) => {
  e.preventDefault()
  loginForm.value?.validate((errors) => {
    if (!errors) {
      // message.success('验证成功')
    }
    else {
      console.log(errors)
      // message.error('验证失败')
    }
  })
  api.post('/login', { username: loginForm.value.username, password: loginForm.value.password }).then((response) => {
    console.log('Logged in user: ', response.data)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('pFlag', `${response.data.pFlag}`)
    router.push('/chat')
  }).catch((error) => {
    console.error('Error logging in user: ', error)
    alert('Login failed')
  })
}

const register = (e) => {
  e.preventDefault()
  loginForm.value?.validate((errors) => {
    if (!errors) {
      console.log('验证成功')
    }
    else {
      console.log(errors)
      console.log('验证失败')
    }
  })
  console.log(registerForm.value.username)
  api.post('/register', { username: registerForm.value.username, password: registerForm.value.password, email: registerForm.value.email }).then((response) => {
    console.log('Registered user: ', response.data)
    alert('User registered successfully')
  }).catch((error) => {
    console.error('Error registering user: ', error)
    alert('Registration failed')
  })
}
</script>

<template>
  <div>
    <div class="login-form">
      <NSpace>
        <h1>登录页面</h1>
        <NForm ref="loginForm" :model="loginForm" :rules="loginRules">
          <NFormItem label="Username" prop="username">
            <NInput v-model:value="loginForm.username" placeholder="请输入用户名哦~" />
          </NFormItem>
          <NFormItem label="Password" prop="password">
            <NInput v-model:value="loginForm.password" type="password" placeholder="请输入密码哦~" />
          </NFormItem>
          <NFormItem>
            <NButton class="page-button" type="primary" @click="login">
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
        <h1>还没有账号？</h1>
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
            <NButton class="page-button" type="primary" @click="register">
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
    text-align: center
}
.page-button{
    margin-left: 50px;
}
</style>
