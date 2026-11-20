// 카카오(다음) 우편번호 서비스 — 무료, 키 필요 없음
interface PostcodeData {
  zonecode: string
  roadAddress: string
  jibunAddress: string
  buildingName: string
}
declare global {
  interface Window {
    daum?: { Postcode: new (opts: { oncomplete: (d: PostcodeData) => void }) => { open: () => void } }
  }
}

const SRC = 'https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'

function load(): Promise<void> {
  if (window.daum?.Postcode) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SRC
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('우편번호 서비스를 불러오지 못했습니다.'))
    document.head.appendChild(s)
  })
}

export async function searchAddress(): Promise<{ zipcode: string; address: string } | null> {
  await load()
  return new Promise((resolve) => {
    new window.daum!.Postcode({
      oncomplete: (d) => {
        const base = d.roadAddress || d.jibunAddress
        resolve({ zipcode: d.zonecode, address: d.buildingName ? `${base} (${d.buildingName})` : base })
      },
    }).open()
  })
}
