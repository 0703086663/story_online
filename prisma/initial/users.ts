import * as bcrypt from 'bcrypt'

enum ROLE {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

export const users = [
  {
    role: ROLE.ADMIN,
    name: 'Alice Admin',
    email: 'admin@example.com',
    phone: '123-456-7890',
    birthdate: '1985-06-15T00:00:00Z',
    image: 'https://example.com/images/alice.jpg',
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin', Number(process.env.SALT_BCRYPT)),
    money: 1000.5,
    refreshToken: 'refresh_token_example_admin',
    emailVerified: true,
    createdAt: '2024-10-11T12:00:00Z',
  },
  {
    role: ROLE.MANAGER,
    name: 'Bob Manager',
    email: 'manager@example.com',
    phone: '987-654-3210',
    birthdate: '1990-01-25T00:00:00Z',
    image: 'https://example.com/images/bob.jpg',
    password: bcrypt.hashSync(process.env.MANAGER_PASSWORD || 'manager', Number(process.env.SALT_BCRYPT)),
    money: 500.75,
    refreshToken: 'refresh_token_example_manager',
    emailVerified: false,
    createdAt: '2024-10-11T12:00:00Z',
  },
  {
    role: ROLE.USER,
    name: 'Charlie User',
    email: 'user@example.com',
    phone: null,
    birthdate: '1995-12-05T00:00:00Z',
    image: null,
    password: bcrypt.hashSync(process.env.USER_PASSWORD || 'user', Number(process.env.SALT_BCRYPT)),
    money: 100.0,
    refreshToken: null,
    emailVerified: false,
    createdAt: '2024-10-11T12:00:00Z',
  },
]
