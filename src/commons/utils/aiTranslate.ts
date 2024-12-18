import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

export const aiTranslate = async (body: string) => {
  try {
    const prompt = `Dịch đoạn truyện từ tiếng Trung này sang tiếng Việt: ${body}`

    const result = await model.generateContent(prompt)

    const response = result.response

    return response.text()
  } catch (err) {
    throw new Error(err)
  }
}
