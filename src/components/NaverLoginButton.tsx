import { useEffect } from "react";
import { isNaverCallbackPath } from "../auth";
import { naverCallbackUrl, naverClientId } from "../config";

type Props = {
  label?: string;
};

export function NaverLoginButton({ label = "네이버로 로그인" }: Props) {
  useEffect(() => {
    if (isNaverCallbackPath()) return;
    const clientId = naverClientId();
    if (!clientId || typeof window.naver_id_login === "undefined") return;
    const naver = new window.naver_id_login(clientId, naverCallbackUrl());
    const state = naver.getUniqState();
    naver.setState(state);
    naver.init_naver_id_login();
  }, []);

  function handleClick() {
    const link = document.querySelector<HTMLAnchorElement>("#naver_id_login a");
    if (link) {
      link.click();
      return;
    }
    window.alert("네이버 로그인을 아직 준비하지 못했어요. 잠시 후 다시 눌러 주세요.");
  }

  return (
    <>
      <div id="naver_id_login" hidden />
      <button className="btn btn--naver" type="button" onClick={handleClick}>
        {label}
      </button>
    </>
  );
}
