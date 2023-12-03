// flow rest api: routes -> middleware -> controller -> service/validation -> model
import supertest from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import createServer from '../utils/server'
import type { Application } from 'express'
import { addProductToDB } from '../services/product.service'
import { v4 as uuidv4 } from 'uuid'
import { createUser } from '../services/auth.service'
import { hashing } from '../utils/hashing'

const app: Application = createServer()

const productId1 = uuidv4()
const productId2 = uuidv4()
const userIdAdmin = uuidv4()
const userIdRegular = uuidv4()

const productPayload = {
  product_id: productId1,
  name: 'Product 1',
  price: 100,
  size: 'S'
}

const productPayloadCreate = {
  product_id: productId2,
  name: 'Product 2',
  price: 100,
  size: 'S'
}

const userAdminCreated = {
  user_id: userIdAdmin,
  email: 'age1@gmail.com',
  name: 'Age',
  password: `${hashing('12345')}`,
  role: 'admin'
}

const userCreated = {
  user_id: userIdRegular,
  email: 'ega1@gmail.com',
  name: 'Ega',
  password: `${hashing('12345')}`,
  role: 'regular'
}

const userAdmin = {
  email: 'age1@gmail.com',
  password: '12345'
}

const userRegular = {
  email: 'ega1@gmail.com',
  password: '12345'
}

describe('product routes', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
    await addProductToDB(productPayload)
    await createUser(userAdminCreated)
    await createUser(userCreated)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  describe('get all products', () => {
    describe('given the product does exist', () => {
      it('should return 200, and all product data', async () => {
        const { statusCode } = await supertest(app).get('/product')
        expect(statusCode).toBe(200)
      })
    })
  })

  describe('get detail product', () => {
    describe('given the product does not exist', () => {
      it('should return 404, and empty data', async () => {
        const productId = 'PRODUCT_123'
        await supertest(app).get(`/product/${productId}`).expect(404)
      })
    })
    describe('given the product exists', () => {
      it('should return 200, and detail product data', async () => {
        const { statusCode } = await supertest(app).get(`/product/${productId1}`)
        expect(statusCode).toBe(200)
      })
    })
  })

  describe('create product', () => {
    describe('if user is not login', () => {
      it('should return 403, request forbidden', async () => {
        const { statusCode } = await supertest(app).post('/product').send(productPayloadCreate)
        expect(statusCode).toBe(403)
      })
    })
    describe('if user is login as admin', () => {
      it('should return 201, success create product', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        await supertest(app)
          .post('/product')
          .set('Authorization', `Bearer ${body.data.accessToken}`)
          .send(productPayloadCreate)
          .expect(201)
      })
      it('should return 422, product name is exist in db', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        await supertest(app)
          .post('/product')
          .set('Authorization', `Bearer ${body.data.accessToken}`)
          .send(productPayload)
          .expect(422)
      })
    })
    describe('if user is login as regular', () => {
      it('should return 403, request forbidden', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        await supertest(app)
          .post('/product')
          .set('Authorization', `Bearer ${body.data.accessToken}`)
          .send(productPayloadCreate)
          .expect(403)
      })
    })
  })
})
