import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { get, post } from '@/utils/request'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  return post<T>({
    url: '/chat-process',
    data: { prompt: params.prompt, options: params.options },
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchVerify<T = any>(
  params: {
    token: string
  },
) {
  const auth = `Bearer ${params.token}`
  return get<T>({
    url: '/verify',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth,
    },
  })
}

export function fetchRegister<T = any>(
  params: {
    username: string
    password: string
    email: string
  },
) {
  return post<T>({
    url: '/register',
    data: { username: params.username, password: params.password, email: params.email },
  })
}

export function fetchLogin<T = any>(
  params: {
    username: string
    password: string
  },
) {
  try {
    const response = post<T>({
      url: '/login',
      data: { username: params.username, password: params.password },
    })
    // console.log(response)
    // return response
  }
  catch (error) {
    console.error('Error logging in user1: ', error)
    throw error
  }
  // return post<T>({
  //   url: '/login',
  //   data: { username: params.username, password: params.password },
  // })
}
