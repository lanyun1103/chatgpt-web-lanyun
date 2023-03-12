import * as mysql from 'mysql'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

export interface User {
  id?: number
  username: string
  password: string
  email: string
  is_premium?: number
}

export class Database {
  private connection: mysql.Connection

  constructor() {
    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'chatgpt-web',
      port: 4000,
      // password: 'Lollol110302.',
      // database: 'chatgptweb',
    })
    this.connection.connect((error) => {
      if (error)
        console.error('Error connecting to MySQL database: ', error)

      // console.log('Connected to MySQL database!')
    })
  }

  public query(sql: string, values: string[], callback: Function) {
    this.connection.query(sql, values, (error, results) => {
      if (error) {
        console.error('Error executing query: ', error)
        callback(error, null)
        return
      }
      callback(null, results)
    })
  }

  public close() {
    this.connection.end((error) => {
      if (error)
        console.error('Error closing MySQL database connection: ', error)

      // console.log('Closed MySQL database connection!')
    })
  }
}

export class Auth {
  private db: Database
  private saltRounds = 10
  private secretKey = 'your_secret_key'

  constructor() {
    this.db = new Database()
  }

  public register(user: User, callback: Function) {
    const checkDuplicateSql = 'SELECT COUNT(*) AS count FROM users WHERE username = ?'
    const checkDuplicateValues = [user.username]
    this.db.query(checkDuplicateSql, checkDuplicateValues, (error, results) => {
      if (error) {
        console.error('Error checking duplicate username: ', error)
        callback(error, null)
        return
      }
      const count = results[0].count
      if (count > 0) {
        const duplicateError = new Error('Duplicate username')
        callback(duplicateError, null)
        return
      }
      bcrypt.hash(user.password, this.saltRounds, (error, hash) => {
        if (error) {
          console.error('Error hashing password: ', error)
          callback(error, null)
          return
        }
        const sql = 'INSERT INTO users SET ?'
        const values = {
          username: user.username,
          password: hash,
          email: user.email,
        }
        this.db.query(sql, values, (error, results) => {
          if (error) {
            console.error('Error registering user: ', error)
            callback(error, null)
            return
          }
          // console.log('Registered user: ', user)
          callback(null, results.insertId)
        })
      })
    })
  }

  public login(username: string, password: string, callback: Function) {
    const sql = 'SELECT * FROM users WHERE username = ?'
    const values = [username]
    this.db.query(sql, values, (error, results: User[]) => {
      if (error) {
        console.error('Error executing query: ', error)
        callback(error, null, 0)
        return
      }
      if (results.length === 0) {
        // console.log('User not found: ', username)
        callback(null, null, 0)
        return
      }
      const user = results[0]
      bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) {
          console.error('Error comparing passwords: ', error)
          callback(error, null, 0)
          return
        }
        if (!isMatch) {
          // console.log('Invalid password: ', password)
          callback(null, null, 0)
          return
        }
        const token = jwt.sign({ id: user.id }, this.secretKey)
        // console.log('User logged in: ', user)
        if (user.is_premium === 1) {
          callback(null, token, 1)
          return
        }
        callback(null, token, 0)
      })
    })
  }

  public verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.secretKey) as { id: number }
      return decoded.id
    }
    catch (error) {
      console.error('Error verifying token: ', error)
      return null
    }
  }
}

// // 示例用法：
//
// const auth = new Auth()
//
// // 注册新用户
// auth.register(
//   {
//     username: 'john_doe',
//     password: 'password123',
//     email: 'john_doe@example.com',
//   },
//   (error, userId) => {
//     if (error) {
//       console.error('Error registering user: ', error)
//       return
//     }
//     console.log('Registered user with ID: ', userId)
//   },
// )
//
// // 登录用户
// auth.login('john_doe', 'password123', (error, token) => {
//   if (error) {
//     console.error('Error logging in user: ', error)
//     return
//   }
//   console.log('Logged in user with token: ', token)
// })
//
// // 验证 JSON Web Token
// const userId = auth.verifyToken('your_token')
// if (userId)
//   console.log('Verified user with ID: ', userId)
// else
//   console.log('Invalid token!')
