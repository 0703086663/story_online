import { BadRequestException, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { SigninAuthDto, SignupAuthDto } from './auth.dto'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(signupAuthDto: SignupAuthDto) {
    const { name, email, password } = signupAuthDto
    if (!name) throw new BadRequestException('Name cannot be null')
    if (!email) throw new BadRequestException('Email cannot be null')
    if (!password) throw new BadRequestException('Password cannot be null')

    const user = await this.prisma.user.findUnique({ where: { email } })
    if (user) throw new BadRequestException('Email is existed')

    const hashed = await bcrypt.hash(password, Number(process.env.SALT_BCRYPT))

    return this.prisma.user.create({ data: { name, email, password: hashed } })
  }

  async signin(signinAuthDto: SigninAuthDto) {
    const { email, password } = signinAuthDto

    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new BadRequestException('Email is not exist')

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) throw new BadRequestException('Invalid password')

    const { password: hashed, ...userWithoutPassword } = user
    return { accessToken: await this.jwt.signAsync(userWithoutPassword), user: userWithoutPassword }
  }
}
