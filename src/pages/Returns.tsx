import LegalPage from '../components/LegalPage'
import { POLICY, BUSINESS } from '../config'
import { won } from '../lib/format'

export default function Returns() {
  return (
    <LegalPage title="배송·교환·반품" updated="2026. 12. 25">
      <h2>배송</h2>
      <ul>
        <li>배송비 {won(POLICY.shippingFee)} · {won(POLICY.freeShippingOver)} 이상 구매 시 무료배송</li>
        <li>결제 완료 후 {POLICY.dispatchDays} 영업일 이내 출고 ({POLICY.courier})</li>
        <li>드롭(한정 발매) 상품은 상품 페이지에 안내된 출고 일정이 우선합니다.</li>
        <li>출고 후 송장번호는 마이페이지 주문 내역에서 확인할 수 있습니다.</li>
      </ul>

      <h2>교환·반품 신청</h2>
      <ul>
        <li>상품 수령 후 {POLICY.returnDays}일 이내에 {BUSINESS.email}로 주문번호와 사유를 보내 주세요.</li>
        <li>단순 변심에 의한 교환·반품은 왕복 배송비 {won(POLICY.returnFee)}이 부과됩니다.</li>
        <li>불량·오배송은 수령 후 3개월 이내(사실을 안 날부터 30일 이내) 신청할 수 있으며, 배송비는 회사가 부담합니다.</li>
        <li>반품 주소: {POLICY.returnAddress}</li>
      </ul>

      <h2>교환·반품이 어려운 경우</h2>
      <ul>
        <li>착용, 세탁, 향수·화장품 등의 흔적이 있거나 택을 제거한 경우</li>
        <li>고객의 책임으로 상품이 훼손된 경우</li>
        <li>수령 후 {POLICY.returnDays}일이 지난 경우 (불량·오배송 제외)</li>
      </ul>

      <h2>환불</h2>
      <ul>
        <li>반품 상품 도착 및 검수 후 3영업일 이내에 결제하신 수단으로 환불됩니다.</li>
        <li>카드 결제는 카드사 사정에 따라 취소 반영까지 3~7영업일이 걸릴 수 있습니다.</li>
      </ul>
    </LegalPage>
  )
}
